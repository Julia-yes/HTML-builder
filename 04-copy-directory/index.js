const fs = require( 'fs' );
const path = require('path');

let dir = path.join(__dirname, 'files');
let newDir = path.join(__dirname, 'files-copy');

async function copyFiles() {

fs.promises.mkdir( newDir, { recursive: true }).then( function () {
  console.log( 'Directory created' );
  }). catch ( function () {
  console.log( 'error' );
  });

  await fs.readdir(newDir, 
    (err, files) => { 
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let filePath = path.join(__dirname, 'files-copy', file);
        fs.unlink(filePath, (err) => {
        if (err) throw err;      
        console.log('Deleted');
      });
      })
    }
  });


  await fs.readdir(dir, 
    (err, files) => { 
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let filePath = path.join(__dirname, 'files', file);
        let filePathNew = path.join(__dirname, 'files-copy', file);
        fs.promises.copyFile(filePath, filePathNew)
        .then( function () {
        console.log( "File copied" );
        })
        . catch ( function (error) {
        console.log(error);
        });
      })
    }
  })};

copyFiles()