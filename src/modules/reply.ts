import { Message } from 'node-telegram-bot-api';
import { me, notice } from '../getConfig';
import bot from '../lib/bot';
import {
  Message as MongoMessage,
  MyReply as MongoMyReply,
} from '../mongo/models';

export default async (receivedMsg: Message) => {
  const metaData = await MongoMessage.findOne({
    forwarded_message_id: receivedMsg.reply_to_message?.message_id,
  }).catch((e) => {
    console.log('find original message_id ERROR:\n', e);
    bot.sendMessage(me, `未找到回复对象，请检查回复对象是否正确`);
  });

  const chatId = metaData.from_id;
  let sendResult = {} as Message;

  try {
    if (receivedMsg.text) {
      sendResult = await bot.sendMessage(chatId, receivedMsg.text);
    }

    if (receivedMsg.sticker) {
      sendResult = await bot.sendSticker(chatId, receivedMsg.sticker.file_id);
    }

    if (receivedMsg.photo) {
      const caption = receivedMsg.caption || undefined;
      sendResult = await bot.sendPhoto(chatId, receivedMsg.photo[0].file_id, {
        caption,
      });
    }

    if (notice) await bot.sendMessage(me, '消息回复成功');

    new MongoMyReply({
      from_message_id: receivedMsg.message_id,
      to_message_id: sendResult.message_id,
      to_id: sendResult.chat.id,
    }).save();
  } catch {
    await bot.sendMessage(me, '消息回复失败，稍后再试');
  }
};
