import { Message } from 'node-telegram-bot-api';
import { configMsg, parse } from '../getConfig';
import bot from './bot';

export default (receivedMsg: Message) => {
  const text = receivedMsg.text || undefined;

  switch (text) {
    case '/start':
      if (!configMsg.start) return;
      bot
        .sendMessage(receivedMsg.chat.id, configMsg.start, parse.mark2)
        .catch((e) => console.log('send start message ERROR:\n', e));
      break;
    case '/help':
      if (!configMsg.help) return;
      bot
        .sendMessage(receivedMsg.chat.id, configMsg.help, parse.help)
        .catch((e) => console.log('send help message ERROR:\n', e));
      break;
    default:
      bot
        .sendMessage(receivedMsg.chat.id, '未找到命令')
        .catch((e) => console.log('send command warn ERROR:\n', e));
  }
};
