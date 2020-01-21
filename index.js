const imageClipper = require('image-clipper');
const fs = require("fs");
//Пути к изображениям, json файлам и путь вывода.
const {projectPath, output} = require('./path.json');
const Canvas = require('canvas');
imageClipper.configure('canvas',Canvas);

const sourcePath = "/home/ezhov/Рабочий стол/tst/VOTT/sourceImages";

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
                        for (let el of output) {
                            if (el.tags.includes(region.tags[0])) {
                                console.log('in: ', filename);
                                conf.outputFile = `${el.path}/${create_UUID()}.jpg`;
                                await write(conf).then(result=>console.log(result)) .catch((err)=>{console.log(err)});
                            }
                        }
                    }
                }
            }
        }
}

function write(conf) {
    return new Promise((resolve,reject)=>{
         console.log('out:', conf.outputFile);
         //временно пропускаем файлы с кириллицей
        // if (!decodeURI(conf.tFile.asset.name).match(/[а-яА-Я]/g)) {
            // let sourcePath = conf.tFile.asset.path.slice(5, -conf.tFile.asset.name.length-1);
            imageClipper(sourcePath + '/' + decodeURI(conf.tFile.asset.name), function () {
                this.crop(conf.x, conf.y, conf.width, conf.height)
                    .toFile(conf.outputFile, function () {
                        resolve('saved: '+conf.outputFile);
                        reject('error');
                    });
            });
        // } else {
        //     resolve('skipped')
        // }
    })
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

start();