import { Document } from 'mongoose';
import { Message } from 'node-telegram-bot-api';

interface MessageDoc extends Document {
  received_message_id: number;
  forwarded_message_id: number;
  from_id: number;
  first_name: string;
  content: Message;
}

interface UserDoc extends Document {
  tg_id: number;
  first_name: string;
  is_banned: boolean;
}

interface MyReplyDoc extends Document {
  from_message_id: number;
  to_message_id: number;
  to_id: number;
  is_del: boolean;
}
