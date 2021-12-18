const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    received_message_id: Number,
    forwarded_message_id: Number,
    from_id: Number,
    first_name: String,
    content: Object,
})

const UserSchema = new mongoose.Schema({
    tg_id: Number,
    first_name: String,
    is_banned: {type: Boolean, default: false},
})

// 使用模式“编译”模型
const Message = mongoose.model('Message', MessageSchema)
const User = mongoose.model('User', UserSchema)

module.exports =  mongo = {
    Message,
    User
}
