# Use the official MySQL image as the base
FROM mysql:latest

# Set environment variables
ENV MYSQL_ROOT_PASSWORD='root'
ENV MYSQL_DATABASE='growthcalculator'

# Add the SQL file to the Docker image
ADD mysqlDatabase.sql /docker-entrypoint-initdb.d