const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

let file = path.join(__dirname, 'answers.txt');

const output = fs.createWriteStream(file);

stdout.write('Hello. What do you want to write in the file?\n');

stdin.on('data', data => {
  if (data.toString().toLocaleLowerCase().includes("exit")) {
    exit()
  }
  output.write(data)
  stdout.write('Anything else?\n ');
});

process.on('SIGINT', exit);

function exit() {
  console.log('\nEverything is recorded, thank you! Bye!');
  process.exit();
}