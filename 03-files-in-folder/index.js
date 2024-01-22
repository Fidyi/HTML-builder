const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const fileInfo = path.parse(filePath);
        console.log(
          `${fileInfo.name} - ${fileInfo.ext.slice(1)} - ${(stats.size/1024).toFixed(3)} Kb`,
        );
      }
    });
  });
});
