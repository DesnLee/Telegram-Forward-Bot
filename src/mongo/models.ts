import { Schema, model } from 'mongoose';

const MessageSchema = new Schema({
  received_message_id: Number,
  forwarded_message_id: Number,
  from_id: Number,
  first_name: String,
  is_del: { type: Boolean, default: false },
  content: Object,
});

const UserSchema = new Schema({
  tg_id: Number,
  first_name: String,
  is_banned: {
    type: Boolean,
    default: false,
  },
});

const MyReplySchema = new Schema({
  from_message_id: Number,
  to_message_id: Number,
  to_id: Number,
  is_del: { type: Boolean, default: false },
});

// 使用模式“编译”模型
const Message = model('Message', MessageSchema);
const User = model('User', UserSchema);
const MyReply = model('MyReply', MyReplySchema);

export { Message, User, MyReply };
