const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');


function pdfFileUpload(req, filepath) {
    if (!fs.existsSync(path.resolve("./" + 'public' + filepath))){
        fs.mkdirSync(path.resolve("./" + 'public' + filepath));
    }
    return new Promise(function(resolve, reject) {
        console.log('-------------open-----')
        if(req.files === null){
            resolve('');
        }
        if(req.files == undefined){
            resolve('');
        }
        if (req.files || Object.keys(req.files).length > 0) {
            console.log('-------------DDD-----')
            let  file = req.files.file;
            filename = `${uuidv4()}.${getExtension(file.name)}`;
            file.mv(path.resolve("./" + 'public' + filepath + filename), function(err) {
                if (err){
                    console.log(err);
                }
                resolve(filepath + filename);
            })
        }
        else{
            resolve('')
        }
    })
}


function getExtension(fileaddres){
    if(fileaddres == null){
        return '';
    }else{
        return fileaddres.split('.').pop();
    }
    
}

exports.pdfFileUpload = pdfFileUpload;



