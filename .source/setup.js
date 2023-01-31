const fs = require("fs");
const path = require("path");

// Reset Folders
const sourceInput = "./.source/source/input/";
const sourceOutput = "./.source/source/output/";
const targetInput = "./input/";
const targetOutput = "./.source/output/";

const deleteDirectory = dirPath => {
  if (!fs.existsSync(dirPath)) return;
  fs.readdirSync(dirPath).forEach(file => {
    const curPath = path.join(dirPath, file);
    if (fs.lstatSync(curPath).isDirectory()) {
      deleteDirectory(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  });
  fs.rmdirSync(dirPath);
};

const copyDirectory = (src, dst) => {
  fs.readdirSync(src).forEach(file => {
    const curSrc = path.join(src, file);
    const curDst = path.join(dst, file);
    if (fs.lstatSync(curSrc).isDirectory()) {
      fs.mkdirSync(curDst, { recursive: true });
      copyDirectory(curSrc, curDst);
    } else {
      fs.copyFileSync(curSrc, curDst);
    }
  });
};

try {
  deleteDirectory(targetInput);
  deleteDirectory(targetOutput);
  fs.mkdirSync(targetInput, { recursive: true });
  fs.mkdirSync(targetOutput, { recursive: true });
  copyDirectory(sourceInput, targetInput);
  copyDirectory(sourceOutput, targetOutput);
} catch (err) {
  console.error(`Error copying and deleting directories: ${err.message}`);
}


const root = path.resolve('./');

fs.readdir(root, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const zipFiles = files.filter(file => file.endsWith('.zip'));
  zipFiles.forEach(zipFile => {
    fs.unlink(path.join(root, zipFile), err => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`Deleted ${zipFile}`);
    });
  });
});

fs.writeFile('createPack.bat', 'npm run convert', (err) => {
  if (err) throw err;
  console.log('convert.bat file created successfully');
});