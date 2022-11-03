const path = require('path');
const fs = require('fs');

let dir = path.join(__dirname, 'secret-folder');

fs.readdir(dir, 
  { withFileTypes: true },
  (err, files) => { 
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (file.isFile()) {
        let name = file.name.split(".")[0];
        let ext = file.name.split(".")[1];
        let filePath = path.join(__dirname, 'secret-folder', file.name)
        fs.promises.stat(filePath)
        .then(res => 
          console.log(`${name} - ${ext} - ${res.size/1024} kb`));
      }
      
    })
  }
})

