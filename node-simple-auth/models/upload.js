const mongoose = require("mongoose"),
      db       = require("."),
      fs       = require('fs');

const uploadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId, 
        ref: 'User'
    },
    file_name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
});

uploadSchema.pre('deleteOne', async function(next) {
    try {
        const id = this.getFilter()["_id"];
        let doc = await db.Upload.findById(id);

        if (!doc) {
            throw "Document not found";
        }

        let path = `../uploads/image/${doc.file_name}`;
        fs.unlinkSync(path)
    } 
    catch (err) {
        console.log("[ERROR] An error occured while deleting upload (cascade)");
        console.log(err);
    }
    
    next();
});

module.exports = mongoose.model("Upload", uploadSchema);