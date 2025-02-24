const { Sequelize } = require('sequelize');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const readline = require('readline');

/* Import your functions*/
const { randomizeUserNames } = require('./randomize');


async function listSqlFiles() {
    const files = await fs.readdir('/databases');
    return files.filter(file => file.endsWith('.sql'));
}

async function getUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const sqlFiles = await listSqlFiles();
    
    if (sqlFiles.length === 0) {
        console.error('No SQL files found in the databases directory');
        process.exit(1);
    }

    async function promptForFile() {
        /* Takes in a .sql file of a database dump. */
        console.log('Please specify a SQL file name. It should end with .sql.');
        console.log('These are the following files I see:');
        sqlFiles.forEach((file, index) => console.log(`${index + 1}. ${file}`));
        console.log('\n');

        return new Promise((resolve) => {
            process.stdout.write(' > ');
            rl.once('line', async (answer) => {
                if (!answer.trim()) {
                    const defaultFile = sqlFiles[0];
                    console.log(`No input provided. Defaulting to: ${defaultFile}`);
                    rl.close();
                    resolve(defaultFile);
                } else if (!answer.trim().endsWith('.sql')) {
                    console.log('File must end with .sql\n');
                    resolve(await promptForFile()); 
                } else {
                    rl.close();
                    resolve(answer.trim());
                }
            });
        });
    }

    return promptForFile();
}

async function getDatabaseName(filePath) {
    const stream = require('fs').createReadStream(filePath, {
        encoding: 'utf8',
        start: 0,
        end: 1000 
    });

    const chunk = await new Promise((resolve, reject) => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
        stream.on('error', reject);
    });

    let dbNameMatch = chunk.match(/CREATE DATABASE.*`(.+?)`/i)[1];
    if (!dbNameMatch) {
        console.warn('Could not find database name in dump file. Defaulting to `mydatabase`.');
        dbNameMatch = 'mydatabase';
    }
    return dbNameMatch;
}

async function processDatabase() {
    const inputFile = await getUserInput();
    const inputPath = `/databases/${inputFile}`;
    const outputFile = inputFile.replace('.sql', '_randomized.sql');
    const outputPath = `/databases/${outputFile}`;

    try {
        console.log('Importing database...');
        await execPromise(`mysql -u root -proot < ${inputPath}`);

        const dbName = await getDatabaseName(inputPath);

        const sequelize = new Sequelize(dbName, 'root', 'root', {
            host: 'localhost',
            dialect: 'mysql',
            logging: false
        });

        await sequelize.authenticate();
        console.log('Database connection established successfully!');

        console.log('Running functions...');
        /* <--- Add your functions here ---> */
        await randomizeUserNames(sequelize);
        /* <--- Add your functions here ---> */
        await sequelize.close();
        
        console.log('Exporting database...');
        await execPromise(`mysqldump -u root -proot ${dbName} > ${outputPath}`);
        console.log(`Database dump has been saved to ${outputPath}`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

processDatabase(); 