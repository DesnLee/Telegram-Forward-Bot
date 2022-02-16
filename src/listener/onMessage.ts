import { Message } from 'node-telegram-bot-api';
import { me } from '../getConfig';
import newUser from '../lib/newUser';
import auth from '../lib/auth';
import bot from '../lib/bot';
import command from '../modules/command';
import forward from '../modules/forward';
import reply from '../modules/reply';

export default async (receivedMsg: Message) => {
  /**
   * 忽略非私聊消息
   */
  if (receivedMsg.chat.type !== 'private') return;

  /**
   * 处理命令
   */
  if (['/', '!'].indexOf(receivedMsg.text?.[0] as string) !== -1) {
    await command(receivedMsg);
    return;
  }

  /**
   * 转发我回复的消息给对应用户
   */
  if (receivedMsg.from?.id === me && receivedMsg.reply_to_message) {
    await reply(receivedMsg);
    return;
  }

  /**
   * 检查用户权限进行不同操作
   */
  const authCode = await auth(receivedMsg);
  switch (authCode) {
    case 1000:
      newUser(receivedMsg);
      break;

    case 1001:
      await bot.sendMessage(receivedMsg.chat.id, '你已被封禁');
      break;

    case 1:
      if (receivedMsg.from?.id !== me) {
        await forward(receivedMsg);
      }
      break;

    default:
      await bot.sendMessage(me, '用户权限验证错误');
  }
};
