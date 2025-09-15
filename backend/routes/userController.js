var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
// const crypto = require("crypto");
// const JWT = require("jsonwebtoken"); // Added jsonwebtoken package
// const SECRET_KEY = crypto.randomBytes(32).toString("hex");
// const authHelper = require("./helper.js");

// Function to generate access token
function generateAccessToken(user) {
    return JWT.sign(user, SECRET_KEY, { expiresIn: '356d' });
}

// Function to generate refresh token
function generateRefreshToken(user) {
    return JWT.sign(user, SECRET_KEY, { expiresIn: '723d' });
}

router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const Username = email.split('@')[0];

    try {
        const result = await new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
        
                connection.query(
                "SELECT User_ID, First_Name, Last_Name, Email_Address, Password, ClinicID, StationID, Username, Role, Status FROM usertable WHERE Email_Address = ?",
                [email],
                (error, rows) => {
                    connection.release(); // Release the connection back to the pool        
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    });

        if (result.length === 0) {
            res.send("User not found");
            return;
        }

        if(result[0].Status === 0) {
            res.status(403).send("User deactivated");
            return;
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            result[0].Password
        );

        if (passwordCorrect) {
            const user = {
                User_ID: result[0].User_ID,
                First_Name: result[0].First_Name,
                Username: result[0].Username,
                Email_Address: result[0].Email_Address,
                accountStatus: result[0].Status,
                ClinicID: result[0].ClinicID,
                StationID: result[0].StationID,
                role: result[0].Role,
                authenticated: true,
            };

            CURRENT_USER = result[0]

            // Generate access and refresh tokens for the authenticated user
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // Send tokens in the response
            res.json({ accessToken, refreshToken, user });
        } else {
            res.send("Incorrect password");
        }
    } catch (error) {
        res.send("Server error");
    }
});

router.post("/token", (req, res) => {
    const refreshToken = req.body.token; 
    console.log("refreshToken: >" + refreshToken)
    
    if (!refreshToken) {
        return res.sendStatus(401);
    }

    // const accessToken = generateAccessToken(CURRENT_USER);
    // res.send(accessToken);
    // res.json({ accessToken });

    try {

        JWT.verify(refreshToken, SECRET_KEY, (err, user) => {
            if (err) {
                console.log('error', err)
                return res.sendStatus(403);
            }

            const newUser = {...user}
            delete newUser.iat
            delete newUser.exp

            const accessToken = generateAccessToken(newUser);
            return res.json({ accessToken });
        });

    } catch (error) {
        console.log('error', error)
        return res.sendStatus(403);
    }
});

router.post("/signup", async (req, res) => {
    const { Name, Email_Address, Birthdate, ClinicID, StationID } = req.body.newUser;

    // Extract username from email address
    const Username = Email_Address.split('@')[0];
    const First_Name = Name.split(' ')[0];
    const Last_Name = Name.split(' ')[1];
    const UserRole = 'user';
    const Password = '$2b$10$MFzOTPGMYUX09saIhDnt3u73sTAj5rRHQpuxwGH/.bwX5h16KdTuO';

    try {
        // Check if the email already exists in the database
        const checkQuery = "SELECT * FROM usertable WHERE Email_Address = ?";
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            connection.query(checkQuery, [Email_Address], async (error, results) => {
                connection.release(); // Release the connection back to the pool

                if (error) {
                    console.error("Error checking email:", error);
                    return res.status(400).send("Error checking email");
                }

                if (results.length > 0) {
                    // Email already exists, return an error
                    console.log("Email already exists:", Email_Address);
                    return res.send("Email already exists");
                }

//                 res.status(500).send('Internal Server Errorsss INSERT INTO usertable (First_Name, Last_Name, Username, Email_Address, Birthdate, ClinicID, Role, StationID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

                const insertQuery = "INSERT INTO usertable (First_Name, Last_Name, Username, Email_Address, Birthdate, Password, ClinicID, Role, StationID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const values = [First_Name, Last_Name, Username, Email_Address, Birthdate, Password, ClinicID, UserRole, StationID];


                db.getConnection((err, connection) => {
                    if (err) {
                        console.error('Error getting database connection:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
            
                    connection.query(insertQuery, values, (insertError, result) => {
                        connection.release(); // Release the connection back to the pool            
                        if (insertError) {
                            console.error("Signup not completed:", insertError);
                            return res.status(500).send("Signup not completed", insertError);
                        }
                        console.log("Signup completed correctly");
                        return res.send("Signup completed correctly");
                    });
                });
            });
        });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});

// Update Password
router.put("/update-password", authenticateAdmin, async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(
            "UPDATE usertable SET password = ? WHERE email = ?",
            [hashedPassword, email],
            (err, result) => {
                connection.release(); // Release the connection back to the pool
    
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            }
        );
    });
    } catch {
        res.status(500).send();
    }
});

// Get all users
router.get("/users", authenticateAdmin, (req, res) => {

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM usertable ORDER BY User_ID DESC", (err, result) => {
            connection.release(); // Release the connection back to the pool

        if (err) {
            console.log(err);
        } else {
            let users = [];
            result.map(
                user => {
                    users.push({ ID: user.User_ID, First_Name: user.First_Name, Last_Name: user.Last_Name, ClinicID: user.ClinicID, StationID: user.StationID, Email_Address: user.Email_Address, Role: user.Role, Status: user.Status });
                }
            );
            res.send(users);
        }
    });
});
});


// Reset Password
router.post("/reset-password", authenticateAdmin, async (req, res) => {
    const email = req.body.email;
    const newPasswort = req.body.newPassword;
    const accountStatus = req.body.accountStatus;

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPasswort, salt);
        let updateSql = `UPDATE usertable SET password = '${hashedPassword}', Status = '${accountStatus ? 1 : 0}' WHERE email = '${email}'`;
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(updateSql, (err, result) => {
            connection.release(); // Release the connection back to the pool

            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
    } catch {
        res.status(500).send();
    }
});

router.put("/changeRole", authenticateAdmin, (req, res) => {
    const actualRole = req.user.Role;
    const { ID, newRole  } = req.body;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (actualRole.toLocaleLowerCase() !== 'admin') {
            console.error('Don\`t have the permissions:', err);
            res.status(403).json({ error: 'You don`t have the permissions' });
            return;
        }

        connection.query(
        "UPDATE usertable SET Role = ? WHERE User_ID = ?",
        [newRole, ID], (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});


router.put("/changeStatus", authenticateAdmin, (req, res) => {
    const { ID, actualStatus  } = req.body;
    const newStatus = (actualStatus === true || actualStatus === 'true' || actualStatus === 1  || actualStatus === '1') ? false : true;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(
        "UPDATE usertable SET Status = ? WHERE User_ID = ?",
        [newStatus, ID], (err, result) => {
            connection.release(); // Release the connection back to the pool

            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.put("/savePassword", authenticateAdmin, async (req, res) => {
    const { ID, password  } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(
        "UPDATE usertable SET Password = ? WHERE User_ID = ?",
        [hashedPassword, ID], (err, result) => {
            connection.release(); // Release the connection back to the pool

        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
});

// Update Role
router.put("/role", authenticateAdmin, async (req, res) => {
    const User_ID = req.body.User_ID;
    const role = req.body.role;
    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(
            "UPDATE usertable SET role = ? WHERE User_ID = ?",
            [role, User_ID],
            (err, result) => {
                connection.release(); // Release the connection back to the pool
    
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            }
        );
    });
    } catch {
        res.status(500).send();
    }
});

// Update Status
router.put("/status", authenticateAdmin, async (req, res) => {
    const User_ID = req.body.User_ID;
    const status = req.body.status;
    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(
            "UPDATE usertable SET Status = ? WHERE User_ID = ?",
            [status, User_ID],
            (err, result) => {
                connection.release(); // Release the connection back to the pool
    
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            }
        );
    });
    } catch {
        res.status(500).send();
    }
});

router.put("/remove", authenticateAdmin, async function (req, res) {
    try {
        const User_ID = req.body.User_ID;
        if (!User_ID) {
            return res.status(400).json({ error: 'User_ID is missing in the request body.' });
        }

        const result = await deleteUser(User_ID);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
});

async function deleteUser(User_ID) {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query("DELETE FROM usertable WHERE User_ID = ?", [User_ID], (err, result) => {
                connection.release(); // Release the connection back to the pool
    
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    });
}

module.exports = router;
