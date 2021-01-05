const mongoose  = require("mongoose"),
      CONFIG    = require("../config/config");

const passwordResetLinkSchema = new mongoose.Schema({
    key: { 
        type: String, 
        required: true,
        unique: true
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
        default: new Date() 
    },
    updated_at: { 
        type: Date, 
        default: Date.now,
        expires: CONFIG.RESET_LINK.LENGTH
    }
});

module.exports = mongoose.model("PasswordResetLink", passwordResetLinkSchema);