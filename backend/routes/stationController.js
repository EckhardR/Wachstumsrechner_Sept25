var express = require("express");
var router = express.Router();

// Route to create a new Station
router.post("/", authenticateToken, (req, res) => {
  const newStation = req.body.newStation;
  console.log('newStation', newStation);
  // Perform database query to insert the new station into the database
  const insertQuery = "INSERT INTO stationtable (StationNr, ClinicID, Name, BedArray, CreatedBy, CreatedAt) VALUES (?, ?, ?, ?, ?, NOW())";
  const values = [newStation.StationNr, newStation.ClinicID, newStation.Name, JSON.stringify(newStation.BedArray), newStation.CreatedBy];

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

// Get all Station
router.get("/", authenticateToken, (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    connection.query("SELECT * FROM stationtable " + restrictClinic() + " ORDER BY ID DESC", (err, result) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.log(err);
      } else
        res.send(result);
    });
  });
});



router.put("/update", authenticateToken, async (req, res) => {
  let {
    ID, StationNr, ClinicID, Name, BedArray
  } = req.body.newStation;
  if( typeof(BedArray) === JSON )
  {
    BedArray = J
  }

  try {
      // Check if the patient ID exists in the database
      const checkQuery = "SELECT * FROM stationtable WHERE ID = ?";
      db.getConnection((err, connection) => {
          if (err) {
              console.error('Error getting database connection:', err);
              res.status(500).send('Internal Server Error');
              return;
          }

          connection.query(checkQuery, [ID], async (error, results) => {
              connection.release(); // Release the connection back to the pool
          if (error) {
              console.error("Error checking station ID:", error);
              return res.status(400).send("Error checking station ID");
          }

          if (results.length === 0) {
              // station ID does not exist, return an error
              console.log("station not found:", ID);
              return res.status(404).send("station ID not found");
          }
          // Check if BedArray is a string
          if (!(typeof BedArray === 'string')) {
            // Convert BedArray to a JSON string
            BedArray = JSON.stringify(BedArray);
          }

          const updateQuery =
              "UPDATE stationtable SET StationNr=?, ClinicID=?, Name=?, BedArray=? WHERE ID=?";
          const values = [
            StationNr, ClinicID, Name, BedArray, ID
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
      });
  });
  } catch (error) {
      console.error("Internal server error:", error);
      res.status(500).send("Internal server error");
  }
});

// Update Status
router.post("/discharge", authenticateToken, async (req, res) => {
  const ID = req.body.ID;
  try {
      db.getConnection((err, connection) => {
          if (err) {
              console.error('Error getting database connection:', err);
              res.status(500).send('Internal Server Error');
              return;
          }

          connection.query(
              "DELETE FROM stationtable WHERE ID = ?",
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
