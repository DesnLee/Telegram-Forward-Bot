import { Message } from 'node-telegram-bot-api';
import { me } from '../getConfig';
import commandToMe from './commandToMe';
import commandToOther from './commandToOther';
import bot from './bot';

export default async (receivedMsg: Message) => {
  /**
   * 处理非本人消息
   */
  if (receivedMsg.from?.id !== me) {
    await bot
      .sendMessage(receivedMsg.chat.id, '你不是 Bot 的主人哦～')
      .catch((e) => console.log('send command("/") warn ERROR:\n', e));
    return;
  }

  /**
   * 处理错误
   */
  if (!receivedMsg.reply_to_message) {
    bot
      .sendMessage(receivedMsg.chat.id, '请回复一条消息以指定操作对象')
      .catch((e) => console.log('send command warn ERROR:\n', e));
    return;
  }

  if (receivedMsg.reply_to_message.from?.id === me) {
    await commandToMe(receivedMsg);
  } else {
    if (receivedMsg.text?.startsWith('!del')) {
      await bot.sendMessage(me, '此命令仅支持自己发送的消息');
      return;
    }
    await commandToOther(receivedMsg);
  }
};
