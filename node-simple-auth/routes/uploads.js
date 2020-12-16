const express     = require("express"),
      router      = express.Router(),
      db          = require("../models"),
      middleware  = require("../middleware"),
      path        = require('path'),
      formidable  = require('formidable'),
      helpers     = require('../helpers');

router.get("/image/:name", async (req, res) => {
    try {
        const imagePath = path.resolve('./uploads/image/' + req.params.name);
        await res.sendFile(imagePath);    
    } 
    catch (err) {
        console.log("[ERROR] An error occured while sending the file:");
        console.log(err);
        return res.status(400).send("An error occured while sending the file");
    }
});

router.post("/image", middleware.isLoggedIn, (req, res) => {
    let filename = "";
    let denied = false;

    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        let extension = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
        if (!["jpg", "png", "webp", "gif", "svg", "jpeg", "ico"].includes(extension)) {
            denied = true;
            return res.status(400).send("File extension not allowed");
        }        

        filename = helpers.generateFileName("./uploads/image", extension);
        file.path = `./uploads/image/${filename}`;
    })
    .on('file', async (name, file) => {
        if (!denied) {
            try {
                let upload = new db.Upload({user: req.user.id, file_name: filename, type: "image", date: new Date()});
                await upload.save(); 

                req.user.uploads.push(upload._id);
                await req.user.save();
                
                res.json({url: `http://localhost:4000/api/upload/image/${filename}`, upload: upload});
            }
            catch (err) {
                return res.status(400).send("An error occured while saving file");
            }
            
        }
    })
    .on('error', err => {
        if (!denied) {
            res.status(400).send("An error occured while saving file");
        }
    }); 
});

module.exports = router;