import { Message } from 'node-telegram-bot-api';
import { User as MongoUser } from '../mongo/models';

export default async (receivedMsg: Message) => {
  /**
   * 拦截黑名单用户消息，未入库用户录入数据库
   */
  const user = await MongoUser.findOne({ tg_id: receivedMsg.from?.id });

  if (!user) return 1000;

  if (user.is_banned) return 1001;

  return 1;
};
