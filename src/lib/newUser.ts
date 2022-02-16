import { Message } from 'node-telegram-bot-api';
import { User as MongoUser } from '../mongo/models';

export default (receivedMsg: Message) => {
  new MongoUser({
    tg_id: receivedMsg.from?.id,
    first_name: receivedMsg.from?.first_name,
  }).save();
};
