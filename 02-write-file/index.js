const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const truePath = path.resolve(__dirname, 'text.txt');

fs.open(truePath, 'w', (err) => {
    if (err) throw err
})

stdout.write('Input your text here:\n');

stdin.on('data', (data) => {
    let correctData = String(data).trim();
    if (correctData === 'exit') {
        stdout.write('\nGood Luck!');
        process.exit();
    }
    fs.appendFile(truePath, correctData, (err) => {
        if (err) throw new Error(err);
    })

})

process.on('SIGINT', () => {
    console.log('\nGood Luck!')
    process.exit();
})



