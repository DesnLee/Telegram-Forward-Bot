import bot from './lib/bot';
import onMessage from './listener/onMessage';
import connectDB from './mongo/connectDB';
import { me } from './getConfig';

/**
 * 连接 mongoDB
 */
connectDB().then(async () => {
  await bot.sendMessage(me, 'MongoDB 连接成功！');
});

/**
 * 创建 bot 错误
 */
bot.on('polling_error', console.log);

/**
 * 处理消息
 */
bot.on('message', onMessage);
