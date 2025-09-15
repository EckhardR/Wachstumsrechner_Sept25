# Growth Calculator Web App README

Welcome to the Growth Calculator web app. Built with ReactJS for the frontend and Node.js for the backend, this app also utilizes MySQL for database management and phpMyAdmin for database administration. The entire application is containerized using Docker, making it easy to set up and deploy.

# Prerequisites

Before you begin, ensure you have Docker and Docker Compose installed on your machine. If you do not have Docker installed, follow the instructions below based on your operating system:

- Windows: Install Docker Desktop on [Windows](https://docs.docker.com/desktop/install/windows-install/)
- MacOS: Instructions are similar to Windows, and can be found on the Docker [official website](https://docs.docker.com/desktop/install/windows-install/).
- Linux: Install Docker Engine on [Linux](https://docs.docker.com/engine/install/)

# Installation

1 - Clone the repository:

First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/sweissbach/growth-calculator.git
```

2 - Navigate to the project directory:

Change into the project directory:

```bash
cd GrowthCalculator
```

3- Environment Variables:

Before running the application, you need to set up the necessary environment variables. Create a .env file in the root directory and fill in the following variables:

```bash
BACKEND_PORT=4000
MYSQLDB_LOCAL_PORT=3306
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=growthcalculator
```

Adjust the values as necessary for your environment.

# Running the Application

To start the application, run the following command in the root directory of the project:

```bash
docker-compose up --build
```

This command builds and starts all the services defined in your docker-compose.yml file.

# Build single service

```bash
docker compose up -d --no-deps --build <service>
```

e.g. rebuild backend

```bash
docker compose up -d --no-deps --build backend
```

# Accessing the Application

Once the containers are up and running, you can access the application components as follows:
Frontend: Open your browser and navigate to http://localhost:3000 to view the ReactJS frontend.
Backend: The Node.js backend is accessible on

```
 http://localhost:${BACKEND_PORT}
```

where ${BACKEND_PORT} is the port you specified in your .env file.
phpMyAdmin: Access the MySQL database management interface at http://localhost:8080.

# Viewing Logs

To view the logs for a specific service, use the following command:

```bash
docker-compose logs -f <service_name>
```

Replace <service_name> with the name of the service you want to view logs for (e.g., frontend, backend, growthcalculator-mysql-app).

# Stopping the Application

To stop and remove all running containers, use the following command:

```bash
docker-compose down
```

# Troubleshooting

If you encounter any issues while running the application, you can consult the Docker documentation for troubleshooting [Docker Desktop](https://docs.docker.com/desktop/troubleshoot/overview/).

# Login Info:

Email: admin@gmail.com

Password :

```bash
DG!?od(=%6bI
```

new patients
