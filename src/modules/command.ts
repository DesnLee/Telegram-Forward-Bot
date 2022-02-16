import { Message } from 'node-telegram-bot-api';
import processCustomerCmd from '../lib/processCustomerCmd';
import processSystemCmd from '../lib/processSystemCmd';

export default async (receivedMsg: Message) => {
  const pre = receivedMsg.text?.[0];
  switch (pre) {
    case '/':
      processSystemCmd(receivedMsg);
      break;
    case '!':
      await processCustomerCmd(receivedMsg);
      break;
    default:
      break;
  }
};
