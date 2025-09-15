var express = require("express");
var router = express.Router();


// Get all Clinics
router.get("/", authenticateToken, (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM clinictable " + restrictClinic() + " ORDER BY CreatedAt DESC", (err, result) => {
            connection.release(); 
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(result);
            }
        });
    });
});


// Route to create a new Clinic
router.post("/", authenticateToken, (req, res) => {
    const newClinic = req.body.newClinic;
    console.log('newClinic', newClinic);
    // Perform database query to insert the new station into the database
    const insertQuery = "INSERT INTO clinictable (Name, CreatedBy, CreatedAt) VALUES (?, ?, NOW())";
    const values = [newClinic.Name, newClinic.CreatedBy];
  
    // Execute the query
    db.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting database connection:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      connection.query(insertQuery, values, (err, result) => {
        connection.release(); // Release the connection back to the pool
        if (err) {
          console.error("Error creating new station:", err);
          res.status(500).json({ error: "Failed to create new station" });
        } else {
          console.log("New station created successfully");
          res.status(200).json({ message: "New station created successfully" });
        }
      });
    });
  });


router.put("/update", authenticateToken, async (req, res) => {
    let {
      ID, Name
    } = req.body.newClinic;
    
  
    try {
        // Check if the patient ID exists in the database
        const checkQuery = "SELECT * FROM clinictable WHERE ID = ?";
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
  
            connection.query(checkQuery, [ID], async (error, results) => {
                connection.release(); // Release the connection back to the pool
            if (error) {
                console.error("Error checking clinic ID:", error);
                return res.status(400).send("Error checking station ID");
            }
  
            if (results.length === 0) {
                // station ID does not exist, return an error
                console.log("clinic not found:", ID);
                return res.status(404).send("Clinic ID not found");
            }
            
  
            const updateQuery = "UPDATE clinictable SET Name = ? WHERE ID = ?";
            const values = [Name, ID];
  
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
  
                connection.query(updateQuery, values, (updateError, result) => {
                    connection.release(); // Release the connection back to the pool
                    if (updateError) {
                        console.error("Clinic record not updated:", updateError);
                        return res.status(500).send("Clinic record not updated");
                    }
                    return res.send("Clinic record updated correctly");
                });
            });
        });
    });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
  });
  
  // Update Status
  router.post("/delete", authenticateToken, async (req, res) => {
    const ID = req.body.ID;
    try {
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
  
            connection.query(
                "DELETE FROM clinictable WHERE ID = ?",
                [ID],
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


module.exports = router;
