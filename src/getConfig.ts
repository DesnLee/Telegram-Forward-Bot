import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import { SendMessageOptions, } from 'node-telegram-bot-api';

interface Config {
  database_url: string;
  bot_token: string;
  me: number;
  notice: boolean;
  msg: {
    [key:string]:string
  };
  parse: {
    html: SendMessageOptions;
    mark: SendMessageOptions;
    mark2: SendMessageOptions;
  };
}

/**
 * 读取配置文件为config
 */
const input = readFileSync(resolve('./env/config.yaml')).toString();
const config = load(input) as Config;

const {
  database_url: databaseUrl,
  bot_token: botToken,
  me,
  notice,
  msg: configMsg,
  parse,
} = config;

export { databaseUrl, botToken, me, notice, configMsg, parse };
