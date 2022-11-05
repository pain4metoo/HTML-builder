const fs = require('fs');
const path = require('path');

const truePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(truePath, 'utf-8');

stream.on('data', (chunk) => console.log(chunk))













