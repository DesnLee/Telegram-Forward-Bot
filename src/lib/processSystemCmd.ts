import { Message } from 'node-telegram-bot-api';
import { configMsg, parse } from '../getConfig';
import bot from './bot';

export default async (receivedMsg: Message) => {
  const text = receivedMsg.text;
  let message:string

  switch (text) {
    case '/start':
      if (!configMsg.start) return;
      message = configMsg.start
      break;

    default:
      message = '未找到命令'
  }

  await bot
  .sendMessage(receivedMsg.chat.id, message, parse.mark2)
  .catch((e) => console.log('Reply system command ERROR:\n', e));
};
