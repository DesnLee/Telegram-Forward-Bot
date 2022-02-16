import { Message } from 'node-telegram-bot-api';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { MessageDoc, UserDoc } from '../env';
import { me, parse } from '../getConfig';
import { Message as MongoMessage, User as MongoUser } from '../mongo/models';
import bot from './bot';

export default async (receivedMsg: Message) => {
  /**
   * 查找目标消息
   */
  const targetMsg: MessageDoc | null = await MongoMessage.findOne({
    forwarded_message_id: receivedMsg.reply_to_message?.message_id,
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
    tg_id: targetMsg.from_id,
  });

  if (!user) {
    await bot.sendMessage(me, `未找到操作用户`);
    return;
  }

  const mention = `<a href = "tg://user?id=${targetMsg.content.from?.id.toString()}" >${
    targetMsg.content.from?.first_name
  }</a>
`;
  let message: string;

  /**
   * 处理命令
   */
  switch (receivedMsg.text?.split(' ')[0]) {
    /**
     * 加入黑名单
     */
    case '!ban': {
      await user.updateOne({ is_banned: true }).catch(async (e) => {
        await bot.sendMessage(me, `banning user Error:\n + ${e}`);
      });
      message = `不再转发 ${mention} 的消息`;
      break;
    }

    /**
     * 移出黑名单
     */
    case '!unban': {
      await user.updateOne({ is_banned: false }).catch(async (e) => {
        await bot.sendMessage(me, `unbanning user Error:\n + ${e}`);
      });
      message = `${mention} 已从黑名单移出`;
      break;
    }

    /**
     * 查询用户信息
     */
    case '!info': {
      if (!targetMsg.content.from) {
        message = '未找到对应消息';
        break;
      }

      const {
        id,
        username,
        first_name: firstName,
        last_name: lastName,
        language_code: lang,
      } = targetMsg.content.from;

      message = `用户 <a href="tg://user?id=${id.toString()}">${firstName}</a> 的信息如下：\n\n`;
      message += `ID: <code>${id}</code>\n`;
      message += `UserName: ${username ? '@' + username : '无'}\n`;
      message += `NickName: ${firstName + (lastName || '')}\n`;
      message += `Language: <code>${lang}</code>`;
      break;
    }

    default:
      message = '未找到命令';
  }

  await bot.sendMessage(me, message, parse.html);
};
