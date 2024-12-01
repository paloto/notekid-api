const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isGroupChat: { type: Boolean, default: false },
    groupName: String,
    groupImage: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);
