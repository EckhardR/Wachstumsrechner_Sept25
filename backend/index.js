const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const crypto = require("crypto");

JWT = require("jsonwebtoken"); // Added jsonwebtoken package
SECRET_KEY = crypto.randomBytes(32).toString("hex");
CURRENT_USER = {
  ClinicID: -1
}

// Middleware to verify access token
authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token){
    console.log('Token Invalid');
    return res.status(401).send('You don`t have the permissions to access this content.');
  }

  JWT.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log('Token Invalid');
        return res.status(401).send('You don`t have the permissions to access this content.');
      }
      if(user?.AccountStatus <= 0) {
        console.log('Token Invalid');
        return res.status(401).send('You don`t have the permissions to access this content.');
      }
      req.user = user;
      next();
      return
  });
}

// Middleware to verify access token
authenticateAdmin = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send('You don`t have the permissions to access this content');    

  JWT.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log('Token Invalid');
        return res.status(401).send('You don`t have the permissions to access this content')
      }
      req.user = user;
      if (user.Role !== 'admin' || user.AccountStatus <= 0) {
          console.error('Don`t have the permissions. Please ask the administrator: ', err);
          return res.status(403).send('You don`t have the permissions to access this content. Please contact the administrator')
      }
      next();
  });
}

// Middleware reduce clinid
restrictClinic = function (preString = 'WHERE') {
  let str = '';
  if (CURRENT_USER.Role !== 'admin') {
    str = ' ' + preString + ' ClinicID = ' + CURRENT_USER.ClinicID + ' ';
  }
  return str;
}

// Import routes
// const UserRoute = require("./routes/userController.js");
// const stationRoute = require("./routes/stationController.js");
// const clinicRoute = require("./routes/clinicController.js");
// const patientRoute = require("./routes/patientController.js");
// const taskRoute = require("./routes/tasksController.js");

const userRouteV2 = require("./routes/v2/userControllerV2.js");
const stationRouteV2 = require("./routes/v2/stationControllerV2.js");
const clinicRouteV2 = require("./routes/v2/clinicControllerV2.js");
const patientRouteV2 = require("./routes/v2/patientControllerV2.js");
const taskRouteV2 = require("./routes/v2/tasksControllerV2.js");
const todosRouteV2 = require("./routes/v2/todosControllerV2.js");


// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Create an Express app
const app = express();

// Set up database connection
db = require("./config/Database.js");

const PORT = process.env.BACKEND_PORT || 3000;

// Apply middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply middleware for security and performance
app.use(compression());
app.use(helmet());
app.use(cors());

// Use the UserRoute
// app.use("/User", UserRoute);
// app.use("/station", stationRoute);
// app.use("/clinic", clinicRoute);
// app.use("/Patient", patientRoute);

// app.use("/Tasks", taskRoute);

app.use("/V2/User", userRouteV2);
app.use("/V2/Station", stationRouteV2);
app.use("/V2/Clinic", clinicRouteV2);
app.use("/V2/Tasks", taskRouteV2);
app.use("/V2/Patient", patientRouteV2);
app.use("/V2/Todos", todosRouteV2);




// Start the server
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
