var express = require("express");
var router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
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

    try {            
        const insertQuery =
            "INSERT INTO patienttable (StationID, ClinicID, Birthday, Gender, BedNr, FirstName, LastName, GestationalWeek, GestationalDay, BirthWeight, BirthLength, HeadCircumference, FatMass, FatFreeMass, MotherAge, MotherHeight, MotherPrePregnancyWeight, MotherafterPregnancyWeight, FatherAge, FatherWeight, FatherHeight, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
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

        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            connection.query(insertQuery, values, (insertError, result) => {
                connection.release(); // Release the connection back to the pool
                if (insertError) {
                    console.error("Patient record not inserted:", insertError);
                    return res.status(500).send("Patient record not inserted", insertError);
                }
                console.log("Patient record inserted correctly");
                return res.send("Patient record inserted correctly");
            });
    
        });
    
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
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
            "UPDATE patienttable SET StationID=?, Birthday=?, Gender=?, ClinicID=?, BedNr=?, FirstName=?, LastName=?, GestationalWeek=?, GestationalDay=?, BirthWeight=?, BirthLength=?, HeadCircumference=?, FatMass=?, FatFreeMass=?, MotherAge=?, MotherHeight=?, MotherPrePregnancyWeight=?, MotherafterPregnancyWeight=?, FatherAge=?, FatherWeight=?, FatherHeight=? WHERE ID=?";
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
            res.status(500).send('Internal Server Error');
            return;
        }

        const query = "SELECT * FROM patienttable WHERE (Discharged IS NULL OR Discharged = 0) " + restrictClinic("AND") + " ORDER BY LastName ASC";

        connection.query(query, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.get("/id/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const query = "SELECT * FROM patienttable WHERE (Discharged IS NULL OR Discharged = 0) AND ID = '" + ID + "'";

        connection.query(query, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result[0]);
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
            } else {
                res.send(result);
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
                res.status(500).send('Internal Server Error');
                return;
            }

            connection.query(
                "UPDATE patienttable SET Discharged = ? WHERE ID = ?",
                [true, User_ID],
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
                    } else {
                        console.log(result)
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
