const path = require('path');
const fs = require('fs');

let file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, 'utf-8');
let allText = "";
stream.on('data', chunk => allText += chunk);
stream.on('end', () => console.log(allText));