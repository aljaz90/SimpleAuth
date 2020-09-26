const helpers = {},
      fs      = require("fs");

helpers.generateID = length => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};

helpers.generateFileName = (path, extension) => {
    let filename = helpers.generateID(9);
    while (fs.existsSync(`${path}/${filename}.${extension}`)) {
        filename = helpers.generateID(9);
    }
    
    return `${filename}.${extension}`;
};
 
module.exports = helpers;