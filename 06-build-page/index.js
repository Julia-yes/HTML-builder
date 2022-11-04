const path = require('path');
const fs = require('fs');

let dist = path.join(__dirname, 'project-dist');
let assetsNew = path.join(__dirname, 'project-dist', 'assets');
let assets = path.join(__dirname, 'assets');
let components = path.join(__dirname, 'components');
let htmlPath = path.join(__dirname, 'project-dist', 'index.html');
let template = path.join(__dirname, 'template.html');

function createDir(path) {
  fs.promises.mkdir( path, { recursive: true }).then( function () {
    console.log( 'Directory created' );
    }). catch ( function () {
    console.log( 'error' );
    });
};

function createHtml() {  
  const stream = fs.createReadStream(template, 'utf-8');
  let allText = "";
  stream.on('data', chunk => allText += chunk);  
  stream.on('end', () => fillHtml(allText));
}

function getText(path) {
  return new Promise((resolve, reject) => {
    let text = "";
    const stream = fs.createReadStream(path, 'utf-8');
    stream.on('data', chunk => {
      text += chunk;
    });
    stream.on('end', () => {
      resolve(text);
    });
    stream.on('error', err => {
      reject(err);
    });
  })
};

async function fillHtml(text) {
  let htmlText = text;

  const files = await fs.promises.readdir(components, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    return files;
  });

  for (const file of files) {
    let filePath = path.join(__dirname, 'components', file);
    let fileName = path.basename(filePath);
    let elem = fileName.split(".")[0];
    let start = htmlText.indexOf(elem)-2;
    let end = htmlText.indexOf(elem) + elem.length + 2;
    let textEnd = htmlText.slice(end);
    let textStart = htmlText.slice(0, start);

    htmlText = await getText(filePath).then((response) => {
        htmlText = textStart;
        htmlText += response;
        htmlText += textEnd;
        return htmlText;
      }).catch((error) => {
        console.log(error);
    });
  }
  const html = fs.createWriteStream(htmlPath);
  html.write(htmlText)
}

function createCssFile() {
  let cssPath = path.join(__dirname, 'project-dist','style.css');
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
          console.log("style.css done")
        }
      })
    }
  })
};

async function copyAssets() {

  createDir(assetsNew);

  function deleteFiles(path, name) {
    fs.readdir(path,
      {withFileTypes: true},
        (err, files) => { 
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
            if (file.isFile()) {
              let filePath = `${assetsNew}\\${name}\\${file.name}`;
              fs.unlink(filePath, (err) => {
              if (err) throw err;
              console.log('Deleted');
            })}
            else {
              filePath = `${path}\\${file.name}`;
              deleteFiles(filePath, file.name)
            }
          });
        }
    })
  }

  function copyDir(path, name) {
    fs.readdir(path, 
      { withFileTypes: true },
    (err, files) => { 
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.isFile()) {
          let filePath = `${path}\\${file.name}`;
          let filePathNew = `${assetsNew}\\${name}\\${file.name}`;
          fs.promises.copyFile(filePath, filePathNew)
          .then( function () {
          console.log( "File copied" );
          })
          . catch ( function (error) {
          console.log(error);
          });
        }
        else {
          filePath = `${path}\\${file.name}`;
          filePathNewDir = `${assetsNew}\\${file.name}`;
          createDir(filePathNewDir);
          copyDir(filePath, file.name)
        }
      })
    }
    })
    
  }
  await deleteFiles(assetsNew)
  await copyDir(assets)
}

function createDist() {
  createDir(dist);
  createHtml();
  createCssFile();
  copyAssets();
}

createDist()