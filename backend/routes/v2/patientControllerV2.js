var express = require("express");
var router = express.Router();

router.post("/", authenticateToken, async (req, res) => {

    const CreatedByUser = req?.user?.ID;

    const {
        StationID,
        ClinicID,
        Birthday,
        Gender,
        BedNr,
        FirstName,
        LastName,
        GestationalWeek,
        GestationalDay,
        BirthWeight,
        BirthLength,
        HeadCircumference,
        FatMass,
        FatFreeMass,
        MotherAge,
        MotherHeight,
        MotherPrePregnancyWeight,
        MotherafterPregnancyWeight,
        FatherAge,
        FatherWeight,
        FatherHeight,
        CreatedBy,
    } = req.body.newPatient;

    const sql1 =
            "INSERT INTO patienttable (StationID, ClinicID, Birthday, Gender, BedNr, FirstName, LastName, GestationalWeek, GestationalDay, BirthWeight, BirthLength, HeadCircumference, FatMass, FatFreeMass, MotherAge, MotherHeight, MotherPrePregnancyWeight, MotherafterPregnancyWeight, FatherAge, FatherWeight, FatherHeight, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const values1 = [
            StationID,
            ClinicID,
            Birthday,
            Gender,
            BedNr,
            FirstName,
            LastName,
            GestationalWeek,
            GestationalDay,
            BirthWeight,
            BirthLength,
            HeadCircumference,
            FatMass,
            FatFreeMass,
            MotherAge,
            MotherHeight,
            MotherPrePregnancyWeight,
            MotherafterPregnancyWeight,
            FatherAge,
            FatherWeight,
            FatherHeight,
            CreatedBy,
        ];

    const promise1 = new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(sql1, values1, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    
    const sql2 = "SELECT * FROM `patient_routine_tasks_table`";
    const sql3 = "SELECT * FROM `patient_admission_taskstable`";

    const promise2 = new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(sql2, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });
        
    const promise3 = new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(sql3, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

   
    Promise.all([promise1, promise2, promise3]).then(results => {

        const t0 = results[0]
        const t1 = results[1]
        const t2 = results[2]

        const PatientID = t0.insertId;
        
        let sql4 = '';
        const promise3 = new Promise((resolve, reject) => {
            sql4 = 'INSERT INTO `patient_tasks_table` VALUES ';

            t1.forEach((e, index) => {
                sql4 += `(NULL, '${PatientID}', ${e.ID}, NULL, '${e.Title}', '${e.Description}', '${e.Type}', NULL, ${e.DayOfLife}, ${e.LowerWeekLimit}, ${e.UpperWeekLimit}, ${e.LowerBirthWeight}, ${e.UpperBirthWeight}, ${e.TaskStartPostmenstrualAge}, ${CreatedByUser}, NULL, NULL, NULL, NULL)`;
                if(index < t1.length - 1){
                    sql4 += ','
                }
            })

            sql4 += ','

            const dateNow = new Date().toISOString().slice(0, 10);
            
            t2.forEach((e, index) => {
                sql4 += `(NULL, '${PatientID}', NULL, ${e.ID}, '${e.Title}', '${e.Description}', '${e.Type}', '${dateNow}', NULL, NULL, NULL, NULL, NULL, NULL, ${CreatedByUser}, NULL, NULL, NULL, NULL)`;
                if(index < t2.length - 1){
                    sql4 += ','
                }
            })

            sql4 += ';'

            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
        
                connection.query(sql4, (err, result) => {
                    connection.release(); // Release the connection back to the pool
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        })
            
        res.status('200').send('done')
        // res.send(str); // filterTodoList(results));
    }).catch(err => {
        console.log(err);
    });

});



router.put("/update", authenticateToken, async (req, res) => {
    const {
        ID,
        StationID,
        ClinicID,
        Birthday,
        Gender,
        BedNr,
        FirstName,
        LastName,
        GestationalWeek,
        GestationalDay,
        BirthWeight,
        BirthLength,
        HeadCircumference,
        FatMass,
        FatFreeMass,
        MotherAge,
        MotherHeight,
        MotherPrePregnancyWeight,
        MotherafterPregnancyWeight,
        FatherAge,
        FatherWeight,
        FatherHeight,
    } = req.body.newPatient;

    try {
        // Check if the patient ID exists in the database
       
        const BirthdayData = new Date(Birthday)
        const FormatedBirthday = BirthdayData.toISOString().split('T')[0]
        const updateQuery =
            "UPDATE patienttable SET StationID=?, Birthday=?, Gender=?, ClinicID=?, BedNr=?, FirstName=?, LastName=?, GestationalWeek=?, GestationalDay=?, BirthWeight=?, BirthLength=?, HeadCircumference=?, FatMass=?, FatFreeMass=?, MotherAge=?, MotherHeight=?, MotherPrePregnancyWeight=?, MotherafterPregnancyWeight=?, FatherAge=?, FatherWeight=?, FatherHeight=? WHERE ID = ?";
        const values = [
            StationID,
            FormatedBirthday,
            Gender,
            ClinicID,
            BedNr,
            FirstName,
            LastName,
            GestationalWeek,
            GestationalDay,
            BirthWeight,
            BirthLength,
            HeadCircumference,
            FatMass,
            FatFreeMass,
            MotherAge,
            MotherHeight,
            MotherPrePregnancyWeight,
            MotherafterPregnancyWeight,
            FatherAge,
            FatherWeight,
            FatherHeight,
            ID,
        ];

        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            connection.query(updateQuery, values, (updateError, result) => {
                connection.release(); // Release the connection back to the pool
                if (updateError) {
                    console.error("Patient record not updated:", updateError);
                    return res.status(500).send("Patient record not updated");
                }
                console.log("Patient record updated correctly");
                return res.send("Patient record updated correctly");
            });
        });
    
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});



// Get all Patients
router.get("/", authenticateToken, (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).send('Internal Server Error');
        }

        const query = "SELECT * FROM patienttable WHERE (Discharged IS NULL OR Discharged = 0) " + restrictClinic("AND") + " ORDER BY LastName ASC";

        connection.query(query, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
                return res.status(500).send('DB Error');
            } else {
                return res.send(result);
            }
        });
    });
});

router.get("/id/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).send('Internal Server Error');
        }

        const query = "SELECT * FROM patienttable WHERE (Discharged IS NULL OR Discharged = 0) AND ID = '" + ID + "'";

        connection.query(query, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
                return
            } else {
                return res.send(result[0]);
            }
        });
    });
});


// Get all Patients
router.get("/Archiv", authenticateToken, (req, res) => {
    console.log("archiv request")
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM patienttable WHERE (Discharged IS NOT NULL OR Discharged = 1) " + restrictClinic("AND") + " ORDER BY ID DESC", (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
                return
            } else {
                return res.send(result);
            }
        });
    });
});


// Update Status
router.put("/discharge", authenticateToken, async (req, res) => {
    const User_ID = req.body.ID;
    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).send('Internal Server Error');
            }

            connection.query(
                "UPDATE patienttable SET Discharged = ? WHERE ID = ?",
                [true, User_ID],
                (err, result) => {
                    connection.release(); // Release the connection back to the pool
                    if (err) {
                        console.log(err);
                        return
                    } else {
                        return res.send(result);
                    }
                }
            );
        });
    } catch {
        return res.status(500).send();
    }
});

// Update Status
router.put("/restore", authenticateToken, async (req, res) => {
    const User_ID = req.body.ID;
    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            connection.query(
                "UPDATE patienttable SET Discharged = NULL WHERE ID = ?",
                [User_ID],
                (err, result) => {
                    connection.release(); // Release the connection back to the pool
                    if (err) {
                        console.log(err);
                        return
                    } else {
                        return res.send(result);
                    }
                }
            );
        });
    } catch {
        res.status(500).send();
    }
});

router.put("/lastGewicht", authenticateToken, async (req, res) => {
    const patientID = req.body.patientID;
    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            connection.query(
                "SELECT Weight FROM dailytasktable WHERE PatientID = ? ORDER BY TaskSavedDate DESC LIMIT 1",
                [patientID],
                (err, result) => {
                    connection.release(); // Release the connection back to the pool
                    if (err) {
                        console.log(err);
                        return
                    } else {
                        console.log(result)
                        return res.send(result);
                    }
                }
            );
        });
    } catch {
        res.status(500).send();
    }
});


module.exports = router;
