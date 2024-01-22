const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const filePath = path.join(__dirname, 'text.txt');

fs.appendFile(filePath, '', function () {
  stdout.write('Hello! I\'m waiting for you to write smth...\n');
  stdin.on('data', function (data) {
    if (data.toString().trim() === 'exit') {
      stdout.write('By By!');
      process.exit();
    } else {
      fs.appendFile(filePath, data, function () {
        stdout.write("u can write smth else I'm waiting\n");
      });
    }
  });
});

process.on('SIGINT', function () {
  stdout.write('\nBy! By!');
  process.exit();
});
