# Database Operations
A tool that allows you to run operations on a database and export its results without having the need to spin up your own MySQL, MariaDB, or Postgres Database. 

## Running the Container
You can start the container by running the `run_container.bat` (for Windows) or `run_container.sh` (for Mac/Linux). This will remove existing images and build a new one.

You can also pull and examine the image from Docker Hub:
```
docker run -it -v "$(pwd)/databases:/databases" -p 3326:3306 zibdie/database-operations "$1"
```

## How to Use

1. Ensure you have your NodeJS script ready and included in the `process-database.js` in the area highlighted below. For reference, I created a `randomize.js` that randomizes names.
```
        await sequelize.authenticate();
        console.log('Database connection established successfully!');

        console.log('Running functions...');
        /* <--- Add your functions here ---> */
        await randomizeUserNames(sequelize);
        /* <--- Add your functions here ---> */
        await sequelize.close();
```
2. Make a database dump, in the form of a `.sql` file, and place it into the `databases` folder, which the container will mount a volume too

3. Run the container and type the name of the `.sql` file. If you do not see it, ensure that the container can successfully mount into the `databases` folder.

You should get a new file called `<your sql file name>_randomized.sql` which contains the export.

### Example
```
 => => naming to docker.io/library/db-operations:latest                                                                  0.0s
 => => unpacking to docker.io/library/db-operations:latest                                                               2.3s

View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/abc123
12:00:00 mysqld_safe Logging to syslog.
12:00:00 mysqld_safe Starting mariadbd daemon with databases from /var/lib/mysql
Please specify a SQL file name. It should end with .sql.
These are the following files I see:
1. sample_database.sql


 > sample_database.sql
Importing database...
Database connection established successfully!
Running functions...
Exporting database...
Database dump has been saved to /databases/sample_database_randomized.sql
```