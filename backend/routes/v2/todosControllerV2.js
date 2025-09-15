var express = require("express");
var router = express.Router();

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

router.post("/", authenticateToken, async (req, res) => {
    const newTask = req.body.newTask;
    const CreatedBy = req.body.CreatedBy;


    console.log("All daily tasks inserted correctly", req.body);
    try {

        const insertTasksPromises = [];
        for (const [patientID, taskData] of Object.entries(newTask)) {
            // Convert date to the exact format (YYYY-MM-DD)
            const taskDate = formatDate(taskData.date);
            const insertQuery = `
              INSERT INTO dailytasktable (PatientID, ClinicID, StationNr, BedNr, TaskDate, Weight, Length, HeadCircumference, FatMass, FatFreeMass, PercentFatFreeMass, CreatedBy)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON DUPLICATE KEY UPDATE
              Weight = COALESCE(VALUES(Weight), Weight),
              Length = COALESCE(VALUES(Length), Length),
              HeadCircumference = COALESCE(VALUES(HeadCircumference), HeadCircumference),
              FatMass = COALESCE(VALUES(FatMass), FatMass),
              FatFreeMass = COALESCE(VALUES(FatFreeMass), FatFreeMass),
              PercentFatFreeMass = COALESCE(VALUES(PercentFatFreeMass), PercentFatFreeMass),
              TaskDate = COALESCE(VALUES(TaskDate), TaskDate);
            `;
            const values = [
                patientID,
                taskData.ClinicID,
                taskData.StationNr,
                parseInt(taskData.BedNr),
                taskDate,
                taskData.Weight,
                taskData.Length,
                taskData.HeadCircumference,
                taskData.FatMass,
                taskData.FatFreeMass,
                taskData.PercentFatFreeMass,
                CreatedBy,
            ];

            // Push the database operation as a promise to the array
            const insertTaskPromise = new Promise((resolve, reject) => {
                db.getConnection((err, connection) => {
                    if (err) {
                        console.error('Error getting database connection:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }
            
                    connection.query(insertQuery, values, (insertError, result) => {
                        connection.release(); // Release the connection back to the pool
                        if (insertError) {
                            console.error("Daily task not inserted:", insertError);
                            reject("Daily task not inserted");
                        } else {
                            resolve(result);
                        }
                    });
                });
            });

            insertTasksPromises.push(insertTaskPromise);
        }
        // Wait for all the insert operations to complete
        const insertResults = await Promise.all(insertTasksPromises);
        return res.send(insertResults);
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});



router.post("/UpdateNewDailyTask", authenticateToken, async (req, res) => {
    const newTask = req.body.newTask;
    const CreatedBy = req.body.CreatedBy;

    console.log("All daily tasks inserted correctly", req.body); 

    try {

        const updateTasksPromises = [];
        for (const [patientID, taskData] of Object.entries(newTask)) {

            const updateQuery = `
            UPDATE dailytasktable
            SET
                Weight = COALESCE(?, Weight),
                Length = COALESCE(?, Length),
                HeadCircumference = COALESCE(?, HeadCircumference),
                FatMass = COALESCE(?, FatMass),
                FatFreeMass = COALESCE(?, FatFreeMass),
                PercentFatFreeMass = COALESCE(?, PercentFatFreeMass),
                TaskDate = COALESCE(?, TaskDate),
                TaskEditDate = NOW()
                WHERE ID = ?;
                `;
            const values = [
                taskData.Weight,
                taskData.Length,
                taskData.HeadCircumference,
                taskData.FatMass,
                taskData.FatFreeMass,
                taskData.PercentFatFreeMass,
                formatDate(taskData.TaskDate),
                taskData.ID,
            ];

            const insertTaskPromise = new Promise((resolve, reject) => {
                db.getConnection((err, connection) => {
                    if (err) {
                        console.error('Error getting database connection:', err);
                        res.status(500).send('Internal Server Error');
                        return;
                    }

                    connection.query(updateQuery, values, (updateError, result) => {
                        connection.release();
                        if (updateError) {
                            console.error("Daily task not updated:", updateError);
                            reject("Daily task not updated");
                        } else {
                            resolve(result);
                        }
                    });
                });
            });

            updateTasksPromises.push(insertTaskPromise);
        
        }
        // Wait for all the insert operations to complete
        const updateResults = await Promise.all(updateTasksPromises);
        return res.send(updateResults);
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});

// Get patients without daily tasks for the specific date
router.put("/search", authenticateToken, (req, res) => {
    const specificDate = req.body.searchDate;
    const formattedDate = formatDate(specificDate);
    // Get patients along with their daily tasks (if any) for the specific date using LEFT JOIN
    const tasksQuery = "SELECT p.ID, p.StationID, p.ClinicID, p.BedNr, p.FirstName, p.LastName, dt.TaskDate, dt.Weight, dt.Length, dt.HeadCircumference, dt.FatMass, dt.FatFreeMass, dt.PercentFatFreeMass FROM patienttable p LEFT JOIN dailytasktable dt ON p.ID = dt.PatientID AND p.StationID = dt.StationNr AND p.ClinicID = dt.ClinicID AND DATE(dt.TaskDate) = DATE(?) WHERE (p.Discharged IS NULL OR p.Discharged = 0) AND DATE(p.Birthday) <= DATE(?);";
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(tasksQuery, [formattedDate, formattedDate], (taskError, tasks) => {
            connection.release(); // Release the connection back to the pool
            if (taskError) {
                console.log(taskError);
                return res.status(500).send("Error fetching daily tasks");
            }

            // Return the list of patients without matching tasks for the specific date
            res.send(tasks);
        });
    });
});


router.post("/Create", authenticateToken, (req, res) => {
    const {
        Title,
        Description,
        art,
        DayOfLife,
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        TaskStartPostmenstrualAge,
    } = req.body.newTask;
    const CreatedBy = req.body.CreatedBy;

    try {
        const insertQuery =
            "INSERT INTO todolisttasks (Title, Description, art, DayOfLife, LowerWeekLimit, UpperWeekLimit, LowerBirthWeight, UpperBirthWeight, TaskStartPostmenstrualAge, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            Title,
            Description,
            art,
            DayOfLife,
            LowerWeekLimit,
            UpperWeekLimit,
            LowerBirthWeight,
            UpperBirthWeight,
            TaskStartPostmenstrualAge,
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
                console.error("New Tasknot inserted:", insertError);
                return res.status(500).send("New Tasknot inserted");
            }
            console.log("New Task inserted correctly");
            return res.send("New Taskinserted correctly");
        });
    });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});

router.post("/CreateSimpleTask", authenticateToken, (req, res) => {

    console.log(req.body.newTask)

    const {
        patientID,
        Title,
        Description,
        date,
    } = req.body.newTask.Task;

    const CreatedBy = req.body.CreatedBy;
    
    try {
        const insertQuery =
            "INSERT INTO individuelltodolisttasks (patientID, Title, Description, date, CreatedBy) VALUES (?, ?, ?, ?, ?)";
        const values = [
            patientID,
            Title,
            Description,
            date,
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
                console.error("No New Task inserted:" + insertQuery);
                return res.status(500).send("No new Task inserted" +  insertQuery);
            }
            console.log("New Task inserted correctly");
            return res.send("New Task inserted correctly");
        });
    });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});

router.post("/CreateIndvTask", authenticateToken, (req, res) => {
    const {
        ID,
        patientID,
        Title,
        Description,
        art,
        DayOfLife,
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        TaskStartPostmenstrualAge,
    } = req.body.newTask.Task;
    const CreatedBy = req.body.CreatedBy;
    console.log("ID", req.body.newTask.Task)
    try {
        const insertQuery =
            "INSERT INTO individuelltodolisttasks (patientID, oldTaskId, Title, Description, art, DayOfLife, LowerWeekLimit, UpperWeekLimit, LowerBirthWeight, UpperBirthWeight, TaskStartPostmenstrualAge, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            patientID,
            ID,
            Title,
            Description,
            art ? art : "indeviduell Aufgabe",
            DayOfLife,
            LowerWeekLimit,
            UpperWeekLimit,
            LowerBirthWeight,
            UpperBirthWeight,
            TaskStartPostmenstrualAge,
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
                console.error("New Tasknot inserted:", insertError);
                return res.status(500).send("New Tasknot inserted");
            }
            console.log("New Task inserted correctly");
            return res.send("New Taskinserted correctly");
        });
    });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});
router.post("/processTask", authenticateToken, (req, res) => {
    const {
        patientInfo,
        Task,
    } = req.body.newTask;
    let taskFromTodo = true;
    if(Task.oldTaskId)
        taskFromTodo = false;
    const CreatedBy = req.body.CreatedBy;

    try {
        const insertQuery =
            "INSERT INTO todolisthistory (todoID, patientID, ProcessedBy, taskFromTodoList) VALUES (?, ?, ?, ?)";
        const values = [
            Task.ID,
            patientInfo.ID,
            CreatedBy,
            taskFromTodo
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
                console.error("New Todolisthistory Tasknot inserted:", insertError);
                return res.status(500).send("New Todolisthistory Tasknot inserted");
            }
            console.log("New Todolisthistory Task inserted correctly");
            return res.send("New Todolisthistory Taskinserted correctly");
        });
    });
    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).send("Internal server error");
    }
});


router.get("/", authenticateToken, (req, res) => {
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT dt.*, p.* FROM dailytasktable dt LEFT JOIN patienttable p ON p.ID = dt.PatientID  AND p.StationID = dt.StationNr AND p.ClinicID = dt.ClinicID ORDER BY TaskDate DESC", (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');                
            } else {
                res.send(result);
            }
        });
    });
});


/* new */

router.get("/all/:patientID", authenticateToken, (req, res) => {
    const patientID = req.params.patientID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM `patient_tasks_table` WHERE patientID=" + patientID, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/process/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).send('Internal Server Error');
        }

        connection.query("UPDATE `patient_tasks_table` SET `done` = '1' WHERE `ID` = " + ID, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/unProcess/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).send('Internal Server Error');
        }

        connection.query("UPDATE `patient_tasks_table` SET `done` = NULL WHERE `ID` = " + ID, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

/* new end */

router.get("/todoTasks", authenticateToken, (req, res) => {
    db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).send('Internal Server Error');                
            }

            connection.query("SELECT * FROM todolisttasks ORDER BY ID DESC", (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.get("/todoIndvTasks", authenticateToken, (req, res) => {
    db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).send('Internal Server Error');
            }

            connection.query("SELECT * FROM individuelltodolisttasks ORDER BY ID DESC", (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});



router.post("/update", authenticateToken, async (req, res) => {
    const {
        ID,
        Title,
        Description,
        art,
        DayOfLife,
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        TaskStartPostmenstrualAge,
    } = req.body.newTask;

    try {
        // Check if the patient ID exists in the database
        const checkQuery = "SELECT * FROM todolisttasks WHERE ID = ?";
        db.getConnection((err, connection) => {
            if (err) {
                console.error('Error getting database connection:', err);
                return res.status(500).send('Internal Server Error')
            }
    
            connection.query(checkQuery, [ID], async (error, results) => {
            connection.release(); // Release the connection back to the pool
            if (error) {
                console.error("Error checking Todo Tasks ID:", error);
                return res.status(400).send("Error checking Todo Tasks ID");
            }

            if (results.length === 0) {
                // Patient ID does not exist, return an error
                console.log("Todo Tasks ID not found:", patientID);
                return res.status(404).send("Todo Tasks ID not found");
            }

            const updateQuery =
                "UPDATE todolisttasks SET Title=?, Description=?, art=?, DayOfLife=?, LowerWeekLimit=?, UpperWeekLimit=?, LowerBirthWeight=?, UpperBirthWeight=?, TaskStartPostmenstrualAge=? WHERE ID=?";
            const values = [
                Title,
                Description,
                art,
                DayOfLife,
                LowerWeekLimit,
                UpperWeekLimit,
                LowerBirthWeight,
                UpperBirthWeight,
                TaskStartPostmenstrualAge,
                ID,
            ];

            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    return res.status(500).send('Internal Server Error');
                }
        
                connection.query(updateQuery, values, (updateError, result) => {
                connection.release(); // Release the connection back to the pool
                if (updateError) {
                    console.error("Todo Tasks record not updated:", updateError);
                    return res.status(500).send("Todo Tasks record not updated");
                }
                console.log("Todo Tasks record updated correctly");
                return res.send("Todo Tasks record updated correctly");
            });
        });
        });
    });
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).send("Internal server error");
    }
});


router.get("/todoListToProcess", authenticateToken, (req, res) => {
    let sql1 = "SELECT * FROM `patienttable` WHERE (Discharged IS NULL OR Discharged = 0) " + restrictClinic("AND") + " ORDER BY ID DESC";
    let sql2 = "SELECT * FROM `todolisttasks` ORDER BY ID DESC";
    let sql3 = "SELECT * FROM `todolisthistory` ORDER BY ID DESC";
    let sql4 = "SELECT * FROM `individuelltodolisttasks` WHERE status IS NULL OR status = 0 ORDER BY ID DESC";

    Promise.all([
        new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    return res.status(500).send('Internal Server Error');
                }
        
                connection.query(sql1, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) reject(err);
                else resolve(result);
            });
        });
        }),
        new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    return res.status(500).send('Internal Server Error');
                }
        
                connection.query(sql2, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) reject(err);
                else resolve(result);
            });
        });
        }),
        new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
        
                connection.query(sql3, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) reject(err);
                else resolve(result);
            });
        });
        }),
        new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
        
                connection.query(sql4, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) reject(err);
                else resolve(result);
            });
        });
    })
    ]).then(results => {
        res.send(filterTodoList(results));
    }).catch(err => {
        console.log(err);
    });
});

const filterTodoList = (results) => {
    const patientList = results[0];
    const todolisttasksList = results[1];
    const todolisthistory = results[2];
    const individuelltodolisttasks = results[3];
    let TasksToProcess = [];
    // Create a Set to store unique combinations of patient and task IDs from todolisthistory
    const historySet = new Set(todolisthistory.map(history => `${history.patientID}-${history.todoID}`));

    patientList.forEach(patient => {
        todolisttasksList.forEach(task => {
            const key = `${patient.ID}-${task.ID}`;

            if (!historySet.has(key) && !individuelltodolisttasks.some(indvTask =>
                indvTask.patientID === patient.ID && indvTask.oldTaskId === task.ID
            )) {
                TasksToProcess.push({ "patientInfo": patient, "Task": task });
            } else if (!historySet.has(key)) {
                // Handle the case where an individuelltodolisttask is found and add it to TasksToProcess
                const individuellTask = individuelltodolisttasks.find(indvTask =>
                    indvTask.patientID === patient
                );

                if (individuellTask) {
                    TasksToProcess.push({ "patientInfo": patient, "Task": individuellTask });
                }
            }
        });
    });


    return TasksToProcess;
}


// Get all daily tasks with Discharged = 1
router.get("/GrowthData/:PatientID", authenticateToken, (req, res) => {
    const PatientID = req.params.PatientID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM dailytasktable WHERE PatientID = ? ORDER BY ID DESC", [PatientID], (err, result) => {
        connection.release(); // Release the connection back to the pool
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});
});


router.get("/todoListToProcessArchiv/:PatientID", authenticateToken, (req, res) => {
    const PatientID = req.params.PatientID;
    console.log("UID *****************", PatientID)
    let sql2 = "SELECT * FROM `todolisttasks` ORDER BY ID DESC";
    let sql3 = `SELECT todoID FROM todolisthistory WHERE patientID = ${PatientID} ORDER BY ID DESC`;

    Promise.all([
        new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
        
                connection.query(sql2, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) reject(err);
                else resolve(result);
            });
        });
        }),
        new Promise((resolve, reject) => {
            db.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting database connection:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
        
                connection.query(sql3, (err, result) => {
                connection.release(); // Release the connection back to the pool
                if (err) reject(err);
                else resolve(result);
            });
        });
        })
    ]).then(results => {
        const todolisttasksList = results[0];
        const todolisthistory = results[1];
        let TasksArchiv = [];
        todolisttasksList.forEach(task => {
            let isExist = todolisthistory.some(history =>
                history.todoID === task.ID
            );
            if (isExist) {
                TasksArchiv.push(task);
            }
        });
        res.send(TasksArchiv);
    }).catch(err => {
        console.log(err);
    });
});


router.post("/taskreset", authenticateToken, async (req, res) => {
    const taskId = req.body.taskId;
    const patientId = req.body.patientId;
    const resetSql = `DELETE FROM todolisthistory WHERE todoID = ${taskId} AND patientID = ${patientId}`; 
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(resetSql, (err, result) => {
        connection.release(); // Release the connection back to the pool
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

});

module.exports = router;