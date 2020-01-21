const imageClipper = require('image-clipper');
const fs = require("fs");
//Пути к изображениям, json файлам и путь вывода.
const {sourcePath, projectPath, outputPath} = require('./path.json');
const Canvas = require('canvas');
imageClipper.configure('canvas',Canvas);

async function start() {
    let prj = fs.readdirSync(projectPath);
    let conf = {};
        for (let filename of prj) {
            if (filename.indexOf('.json') > 0) {
                conf.tFile = require(projectPath + '/' + filename);
                for (let region of conf.tFile.regions) {
                    if (region.type === 'RECTANGLE') {
                        conf.height = region.boundingBox.height;
                        conf.width = region.boundingBox.width;
                        conf.x = region.points[0].x;
                        conf.y = region.points[0].y;
                        conf.outputFile = outputPath + '/' + region.id +region.tags[0]+ decodeURI(conf.tFile.asset.name);
                        console.log('in: ',filename);
                        await write(conf).then(result=>console.log(result)) .catch((err)=>{console.log(err)});
                    }
                }
            }
        }
}

function write(conf) {
    return new Promise((resolve,reject)=>{
         console.log('out:', conf.outputFile);
         //временно пропускаем файлы с кириллицей
        if (!decodeURI(conf.tFile.asset.name).match(/[а-яА-Я]/g)) {
            imageClipper(sourcePath + '/' + decodeURI(conf.tFile.asset.name), function () {
                this.crop(conf.x, conf.y, conf.width, conf.height)
                    .toFile(conf.outputFile, function () {
                        resolve('saved: '+conf.outputFile);
                        reject('error');
                    });
            });
        } else {
            resolve('skipped')
        }
    })
}

start();