const path = require('path');
const fs = require('fs');

let cssPath = path.join(__dirname, 'project-dist','bundle.css');
const cssFile = fs.createWriteStream(cssPath);

let cssFiles = path.join(__dirname, 'styles');

fs.readdir(cssFiles, 
  (err, files) => { 
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      let filePath = path.join(__dirname, 'styles', file);
      if(path.extname(filePath) == ".css") {
        const stream = fs.createReadStream(filePath, 'utf-8');
        let allText = "";
        stream.on('data', chunk => allText += chunk);
        stream.on('end', () => cssFile.write(allText));
        console.log("bundle.css done")
      }
    })
  }
});