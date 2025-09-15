var express = require("express");
var router = express.Router();

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

router.get("/today/all", authenticateToken, (req, res) => {

    var arrItems = req.query?.ids;

    let str = '(';

    for (let i = 0; i < arrItems.length; i++){
        str += `"${arrItems[i]}"`;
        str += i < arrItems.length - 1 ? ',' : '';
    }
    str +=')';
    const query = `SELECT * FROM patient_tasks_table WHERE PatientID IN ${str} AND Processed IS NULL`;
    
    if (!req.query?.ids) {
        res.send([]);
    }
        
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

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

router.get("/today/patient/:PatientID", authenticateToken, (req, res) => {
    const PatientID = req.params.PatientID;

    const query = "SELECT * FROM `patient_tasks_table` WHERE PatientID = '" + PatientID + "' AND `Processed` IS NULL";
    console.log('query patient: ', query)

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

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



// GET
router.get("/individual/:ID", authenticateToken, (req, res) => {
    const PatientID = req.params.ID;

    const query = "SELECT * FROM `patient_tasks_table` WHERE PatientID = " + PatientID + " ORDER BY Deadline ASC";
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

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

// CREATE
router.post("/individual/create", authenticateToken, (req, res) => {
    const {
        PatientID,
        Title,
        Description,
        Type,
        Deadline
    } = req.body.data;

    const CreatedByUser = req?.user?.ID;
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(`INSERT INTO patient_tasks_table
            (ID, PatientID, RoutineID, AdmissionID, Title, Description, Type, Deadline, CreatedByUser, CreatedAt, Processed, ProcessedAt, ProcessedByUser)
               VALUES
            (NULL, '${PatientID}', NULL, NULL, '${Title}', '${Description}', '${Type}', '${Deadline}', ${CreatedByUser}, NOW(), NULL, NULL, NULL)`,

            (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(JSON.stringify(req.user));
            }
        });
    });
});

// UPDATE
router.post("/individual/update/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    const {
        Title,
        Description,
        Type,
        Deadline,
        DayOfLife,
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        TaskStartPostmenstrualAge
    } = req.body.data;

    const CreatedByUser = req?.user?.ID;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        let updateQuery = "UPDATE `patient_tasks_table` SET  Title=?, Description=?, Type=?, Deadline=? WHERE `ID` = " + ID;
        let values = [Title, Description, Type, Deadline]

        if(Type === 'admission') {
            updateQuery = "UPDATE `patient_tasks_table` SET  Title=?, Description=?, Type=?, Deadline=? WHERE `ID` = " + ID;
            values = [Title, Description, Type, Deadline];
        } else if(Type === 'routine') {
            updateQuery = "UPDATE `patient_tasks_table` SET Title=?, Description=?, Type=?, DayOfLife=?, LowerWeekLimit=?, UpperWeekLimit=?, LowerBirthWeight=?, UpperBirthWeight=?, TaskStartPostmenstrualAge=?, CreatedAt=NOW(), CreatedByUser=? WHERE ID = " + ID;
            values = [
                Title,
                Description,
                Type,
                !DayOfLife || DayOfLife.toString() === '' ? null : DayOfLife,
                !LowerWeekLimit || LowerWeekLimit.toString() === '' ? null : LowerWeekLimit,
                !UpperWeekLimit || UpperWeekLimit.toString() === '' ? null : UpperWeekLimit,
                !LowerBirthWeight || LowerBirthWeight.toString() === '' ? null : LowerBirthWeight,
                !UpperBirthWeight || UpperBirthWeight.toString() === '' ? null : UpperBirthWeight,
                !TaskStartPostmenstrualAge || TaskStartPostmenstrualAge.toString() === '' ? null : TaskStartPostmenstrualAge,
                CreatedByUser
            ];
        }

        connection.query(updateQuery, values, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

// PROCESS
router.post("/individual/process/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    const ProcessedByUser = req?.user?.ID;
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = "UPDATE `patient_tasks_table` SET  Processed=?, ProcessedAt=NOW(), ProcessedByUser=? WHERE `ID` = " + ID;
        const values = [
            1,
            ProcessedByUser
        ]

        connection.query(updateQuery, values, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/individual/restore/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = "UPDATE `patient_tasks_table` SET  Processed=NULL, ProcessedAt=NULL, ProcessedByUser=NULL WHERE `ID` = " + ID;
        
        connection.query(updateQuery, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

// DELETE
router.delete("/individual/delete/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = "DELETE FROM `patient_tasks_table` WHERE `ID` = " + ID;
        
        connection.query(updateQuery, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});


// admission tasks
router.get("/admission/all", authenticateToken, (req, res) => {
    const PatientID = req.params.PatientID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM `patient_admission_taskstable` ORDER BY `CreatedAt` ASC", (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/admission/create", authenticateToken, (req, res) => {
    const {
        Title,
        Description,
        Type
    } = req.body.data;

    const CreatedByUser = req?.user?.ID;
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(`INSERT INTO patient_admission_taskstable
            (ID, Title, Description, Type, CreatedByUser, CreatedAt)
               VALUES
            (NULL, '${Title}', '${Description}', '${Type}', ${CreatedByUser}, NOW())`,

            (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/admission/update/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    const {
        Title,
        Description,
        Type
    } = req.body.data;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = "UPDATE `patient_admission_taskstable` SET  Title=?, Description=?, Type=? WHERE `ID` = " + ID;
        const values = [Title, Description, Type]

        connection.query(updateQuery, values, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.delete("/admission/delete/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = "DELETE FROM `patient_admission_taskstable` WHERE `ID` = " + ID;
        
        connection.query(updateQuery, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});


// routine tasks
router.get("/routine/all", authenticateToken, (req, res) => {
    const PatientID = req.params.PatientID;
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query("SELECT * FROM `patient_routine_tasks_table` ORDER BY `CreatedAt` ASC", (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/routine/create", authenticateToken, (req, res) => {
    const {
        Title,
        Description,
        Type,
        DayOfLife,
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        TaskStartPostmenstrualAge
    } = req.body.data;

    const CreatedByUser = req?.user?.ID;
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(`INSERT INTO patient_routine_tasks_table (
                ID,
                Title,
                Description,
                Type,
                DayOfLife,
                LowerWeekLimit,
                UpperWeekLimit,
                LowerBirthWeight,
                UpperBirthWeight,
                TaskStartPostmenstrualAge,
                CreatedByUser,
                CreatedAt
            ) VALUES (
                NULL,
                '${Title}',
                '${Description}',
                '${Type}',
                ${DayOfLife ?? 'NULL'},
                ${LowerWeekLimit ?? 'NULL'},
                ${UpperWeekLimit ?? 'NULL'},
                ${LowerBirthWeight ?? 'NULL'},
                ${UpperBirthWeight ?? 'NULL'},
                ${TaskStartPostmenstrualAge ?? 'NULL'},
                ${CreatedByUser},
                NOW()
            )`, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.post("/routine/update/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;
    const {
        Title,
        Description,
        Type,
        DayOfLife,
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        TaskStartPostmenstrualAge
    } = req.body.data;

    const CreatedByUser = req?.user?.ID;
    
    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = `UPDATE patient_routine_tasks_table SET Title=?, Description=?, Type=?, DayOfLife=?, LowerWeekLimit=?, UpperWeekLimit=?, LowerBirthWeight=?, UpperBirthWeight=?, TaskStartPostmenstrualAge=?, CreatedAt=NOW(), CreatedByUser=? WHERE ID = ${ID}`;
        const values = [
            Title,
            Description,
            Type,
            !DayOfLife || DayOfLife.toString() === '' ? null : DayOfLife,
            !LowerWeekLimit || LowerWeekLimit.toString() === '' ? null : LowerWeekLimit,
            !UpperWeekLimit || UpperWeekLimit.toString() === '' ? null : UpperWeekLimit,
            !LowerBirthWeight || LowerBirthWeight.toString() === '' ? null : LowerBirthWeight,
            !UpperBirthWeight || UpperBirthWeight.toString() === '' ? null : UpperBirthWeight,
            !TaskStartPostmenstrualAge || TaskStartPostmenstrualAge.toString() === '' ? null : TaskStartPostmenstrualAge,
            CreatedByUser
        ]

        connection.query(updateQuery, values, (err, result) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    });
});

router.delete("/routine/delete/:ID", authenticateToken, (req, res) => {
    const ID = req.params.ID;

    db.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const updateQuery = "DELETE FROM `patient_routine_tasks_table` WHERE `ID` = " + ID;
        
        connection.query(updateQuery, (err, result) => {
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



module.exports = router;