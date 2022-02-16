// eslint-disable-next-line import/extensions,import/no-unresolved
import { MyReplyDoc, UserDoc } from '../env';
import { MyReply as MongoMyReply } from '../mongo/models';
import { me } from '../getConfig';
import bot from './bot';

export default async (
  targetMsg: MyReplyDoc,
  user: UserDoc,
  param = 'single'
) => {
  if (param === 'single') {
    try {
      await bot.deleteMessage(me, targetMsg.from_message_id.toString());
      await bot.deleteMessage(
        targetMsg.to_id,
        targetMsg.to_message_id.toString()
      );
      await targetMsg.updateOne({ is_del: true });
    } catch {
      return '操作失败！';
    }
  } else if (param === 'all') {
    const msgList: MyReplyDoc[] = await MongoMyReply.find({
      to_id: user.tg_id,
      is_del: false,
    });

    for (const msg of msgList) {
      await bot.deleteMessage(me, msg.from_message_id.toString());
      await bot.deleteMessage(msg.to_id, msg.to_message_id.toString());
      await msg.updateOne({ is_del: true });
    }
  } else {
    return '参数错误！\n`all` - 全部删除\n不带参数单条删除';
  }
  return '操作成功！';
};
