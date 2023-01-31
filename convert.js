const { createCanvas, Image } = require('canvas');
const fs = require("fs");
const fse = require('fs-extra');
const path = require("path");
const AdmZip = require('adm-zip');
const details = require("./input/details.json");
const packName = details["watchingSkin.customSkinPack.name"];
const customSkinTypes = [
  details["watchingSkin.customSkin1.type"],
  details["watchingSkin.customSkin2.type"],
  details["watchingSkin.customSkin3.type"],
  details["watchingSkin.customSkin4.type"],
  details["watchingSkin.customSkin5.type"],
];

// Skins
const skins = [1, 2, 3, 4, 5];
const skinSourcePath = "./input/skins/";
const targetPath = "./output/assets/watching/textures/item/herobrine/custom/";

try {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
} catch (err) {
  console.error(`Error creating directory: ${err.message}`);
}

skins.forEach(skin => {
  const skinPath = `${skin}.png`;
  const emissivePath = `${skin}_emissive.png`;

  try {
    fs.copyFileSync(path.join(skinSourcePath, skinPath), path.join(targetPath, skinPath));
    fs.copyFileSync(path.join(skinSourcePath, emissivePath), path.join(targetPath, emissivePath));
  } catch (err) {
    console.error(`Error moving skin ${skin}: ${err.message}`);
  }
});

// Skin Details
const detailsPath = "./input/details.json";
const targetLangPath = "./output/assets/minecraft/lang/";
const langs = ["en_us", "en_au", "en_ca", "en_gb", "en_nz"];

try {
  if (!fs.existsSync(targetLangPath)) {
    fs.mkdirSync(targetLangPath, { recursive: true });
  }
} catch (err) {
  console.error(`Error creating directory: ${err.message}`);
}

langs.forEach(lang => {
  try {
    fs.copyFileSync(detailsPath, path.join(targetLangPath, `${lang}.json`));
  } catch (err) {
    console.error(`Error copying file for ${lang}: ${err.message}`);
  }
});

// Create Icons
const iconOutputPath = './output/assets/watching/textures/font/watching_ui/icons/skins/custom/';

try {
    if (!fs.existsSync(iconOutputPath)) {
      fs.mkdirSync(iconOutputPath, { recursive: true });
    }
  } catch (err) {
    console.error(`Error creating directory: ${err.message}`);
  }

const numbers = [1, 2, 3, 4, 5];

(async () => {
  for (const number of numbers) {
    try {
    const canvas = createCanvas(8, 8);
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = fs.readFileSync(`${skinSourcePath}${number}.png`);
    ctx.drawImage(image, -8, -8, 64, 64);

    const emissiveImage = new Image();
    emissiveImage.src = fs.readFileSync(`${skinSourcePath}${number}_emissive.png`);
    ctx.drawImage(emissiveImage, -8, -8, 64, 64);

    const out = fs.createWriteStream(`${iconOutputPath}${number}.png`);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log(`${number} icon was created`));
  } catch (error) {
    console.error(`An error occurred while processing ${number}.png:`, error);
  }
}
})();

// Check for wide or slim
customSkinTypes.forEach((customSkinType, index) => {
  const skinType = customSkinType === "wide" ? "wide" : "slim";
  const sourceFolder = path.resolve(`./source/skin_types/${skinType}/${index + 1}`);
  const destinationFolder = path.resolve(`./output/assets/watching/models/item/herobrine/custom/${index + 1}`);

  fse.copy(sourceFolder, destinationFolder)
    .then(() => console.log(`${sourceFolder} was copied to ${destinationFolder}`))
    .catch(err => console.error(err));
});

// Zip Finished product
setTimeout(() => {
const zip = new AdmZip();
zip.addLocalFolder('./output');
zip.writeZip(`./${packName}-From-The-Fog-Skin-Creator.zip`);
}, 1000);