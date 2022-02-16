import { Message } from 'node-telegram-bot-api';
import { me } from '../getConfig';
import bot from '../lib/bot';
import { Message as MongoMessage } from '../mongo/models';

export default async (receivedMsg: Message) => {
  const forwardedMsg = await bot
    .forwardMessage(me, receivedMsg.chat.id, receivedMsg.message_id)
    .catch(async (e) => {
      await bot.sendMessage(me, `转发消息出错\n${e}`);
    });

  new MongoMessage({
    received_message_id: receivedMsg.message_id,
    forwarded_message_id: forwardedMsg?.message_id,
    from_id: receivedMsg.from?.id,
    first_name: receivedMsg.from?.first_name,
    content: receivedMsg,
  }).save();
};
