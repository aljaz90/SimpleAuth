const mongoose  = require("mongoose"),
      CONFIG    = require("../config/config");

Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
};

const sessionSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    ip: {
        type: String,
        required: true
    },
    user_agent: {
        type: String
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
        default: new Date().addHours(CONFIG.SESSION.LENGTH) 
    },
    updated_at: { 
        type: Date, 
        default: Date.now,
        expires: CONFIG.SESSION.LENGTH*60*60
    }
});

module.exports = mongoose.model("Session", sessionSchema);