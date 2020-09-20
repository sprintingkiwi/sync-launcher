console.log("Welcome to the PTCGO Sync Launcher - by LoveBird Pixels")

const child_process = require("child_process");
const fs = require('fs');
const readline = require('readline');
var status = {};


writeStatus = function (callback) {
    let data = JSON.stringify(status, null, 2);
    fs.writeFile('status.json', data, function (err) {
        if (err) {
            throw err;
        }

        console.log("Data written to status file");
        callback();
    });
}

startGame = function () {
    child_process.exec("start.lnk", function (error, stdout, stderr) {

        // Error log
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        // What happens after the game has been closed
        console.log(`stdout: ${stdout}`);

    });
}

checkUsers = function () {
    if (status["logged-user"] != "None") { // If there alrealdy is someone logged in
        console.log("There is already someone playing with this account. Quitting...")
        writeStatus(function () {
            setTimeout(function () {
                process.exit;
            });
        });
    }
    else { // If there is no one else logged in
        console.log("There's no one playing with this account, let's start the game!")
        writeStatus(function () {
            startGame();
        });
    }
}


// Main process
fs.readFile('status.json', function (err, data) {
    if (err) {
        throw err;
    }

    status = JSON.parse(data);
    console.log(status);
    if (status["my-name"] == "") { // If it's the first time
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Write your name...\n", function (answer) { // Ask user name
            console.log(`Hello: ${answer}!`);
            status["my-name"] = answer
            rl.close();
            checkUsers();
        });
    }
    else {
        console.log(`Welcome back ${status["my-name"]}!`);
        checkUsers();
    }
});

console.log('Goodbye');
