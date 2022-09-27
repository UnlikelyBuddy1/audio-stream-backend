import { extname } from 'path';

export const audioFileFilter = (req, file, callback) => {
  if (!file.originalname.normalize().match(/\.(mp3|wav|ogg)$/)) {
    return callback(new Error('Only music files are allowed!'), false);
  }
  callback(null, true);
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.normalize().match(/\.(png|jpeg|jpg)$/)) {
    return callback(new Error('Only image files are allowed for the cover!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  let name = file.originalname.normalize().split('.')[0];
  name = name.replace(/\s/g, "");
  const fileExtName = extname(file.originalname);
  const randomName = Array(8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

function editImageName(filename){
  const randomName = Array(8)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
    filename=filename.replace(/[/?%*:|"<>]/g, '');
    return (filename+'-'+randomName+".jpg");
};

var path = require('path');
var fs = require('fs');
export const decode_base64 = (base64str , filename) =>  {
  var buf = Buffer.from(base64str,'base64');
  filename = filename.replace(/\s/g, '');
  filename = filename.replace('#', '');
  filename=filename.replace(/[/?%*:|"<>]/g, '');
  filename = editImageName(filename);
  fs.writeFile(path.join('./files','/image/',filename), buf, function(error){
    if(error){
      throw error;
    }
    return filename;
  });
  return filename;
}
export const audioFormats = ["mp3", "wav", "ogg"];
export const imageFormats = ["jpeg", "png", "jpg"];
export const defaultImage = "defaultApplicationLogo.jpg";