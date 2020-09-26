const mongoose  = require("mongoose");
const config    = require("../config/config");

Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
};

const sessionSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'User',
        required: true
    },
    created_at: { 
        type: Date, 
        default: new Date() 
    },
    expire_at: { 
        type: Date, 
        default: new Date().addHours(config.sessionLengthInHours) 
    },
    updated_at: { 
        type: Date, 
        default: Date.now,
        expires: 86400
    }
});

module.exports = mongoose.model("Session", sessionSchema);