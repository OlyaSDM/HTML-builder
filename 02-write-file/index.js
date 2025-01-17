const fs = require('fs');
const path = require('path');
const readline = require('readline');

const outputFilePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(outputFilePath);

console.log('Welcome! Type your input and press Enter. Type "exit" to quit.');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'exit') {
        console.log('Farewell! Your input has been saved.');
        rl.close();
    } else {
        writeStream.write(`${input}\n`);
    }
});

process.on('SIGINT', () => {
    console.log('Farewell! Your input has been saved.');
    rl.close();
});
