import { Message } from 'node-telegram-bot-api';
import { configMsg, parse } from '../getConfig';
import bot from './bot';

export default async (receivedMsg: Message) => {
  const command = receivedMsg.text?.slice(1);
  const message = command ? configMsg[command] : '未找到命令';

  await bot
    .sendMessage(receivedMsg.chat.id, message, parse.mark2)
    .catch((e) => console.log('Reply system command ERROR:\n', e));
};
