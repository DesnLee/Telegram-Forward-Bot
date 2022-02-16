import { Message } from 'node-telegram-bot-api';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { UserDoc, MyReplyDoc } from '../env';
import { me, parse } from '../getConfig';
import { User as MongoUser, MyReply as MongoMyReply } from '../mongo/models';
import deleteMsg from './deleteMsg';
import bot from './bot';

export default async (receivedMsg: Message) => {
  /**
   * 查找目标消息
   */
  const targetMsg: MyReplyDoc | null = await MongoMyReply.findOne({
    from_message_id: receivedMsg.reply_to_message?.message_id,
  });

  /**
   * 未找到记录
   */
  if (!targetMsg) {
    await bot.sendMessage(me, `未找到操作对象，请检查回复对象是否正确`);
    return;
  }

  /**
   * 通过被回复消息查询操作对象id
   */
  const user: UserDoc | null = await MongoUser.findOne({
    tg_id: targetMsg.to_id,
  });

  if (!user) {
    await bot.sendMessage(me, `未找到操作用户`);
    return;
  }

  let message: string;

  /**
   * 处理命令
   */
  switch (receivedMsg.text?.split(' ')[0]) {
    /**
     * 删除我的消息
     */
    case '!del':
      message = await deleteMsg(
        targetMsg,
        user,
        receivedMsg.text?.split(' ')[1]
      );
      break;

    default:
      message = '未找到命令';
  }

  await bot.sendMessage(me, message, parse.mark);
};
