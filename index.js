const Clipper = require('image-clipper');
const fs = require("fs");
//Пути к изображениям, json файлам и путь вывода.

const sourcePath =  '/home/ezhov/Рабочий стол/ztest/src';
const projectPath = '/home/ezhov/Рабочий стол/ztest/project';
const outputPath =  '/home/ezhov/Рабочий стол/ztest/output';

/*
const sourcePath = 'C:\\Users\\alexa\\Desktop\\VottSnils\\sourceImages';
const projectPath = 'C:\\Users\\alexa\\Desktop\\VottSnils\\Project';
const outputPath =  'C:\\Users\\alexa\\Desktop\\ztest\\output';
*/

const Canvas = require('canvas');
Clipper.configure('canvas',Canvas);

let tFile,height,width,x, y,outputFile;

fs.readdirSync(projectPath).forEach(filename=>{
    if (filename.indexOf('.json') > 0) {
        tFile = require(projectPath + '/' + filename);
        tFile.regions.forEach(region=> {
            if (region.type === 'RECTANGLE') {
                height = region.boundingBox.height;
                width = region.boundingBox.width;
                x = region.points[0].x;
                y = region.points[0].y;
                outputFile = outputPath + '/' + region.id + tFile.asset.name;
                console.log(sourcePath + '/' + tFile.asset.name)
                Clipper(sourcePath + '/' + tFile.asset.name, function () {
                    this.crop(x, y, width, height)
                        .toFile(outputFile, function () {
                            console.log('saved!');
                        });
                });
            }
        });
    }
});