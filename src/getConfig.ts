import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { resolve } from 'path';
import {
  InlineKeyboardButton,
  SendMessageOptions,
  ParseMode,
  InlineKeyboardMarkup,
} from 'node-telegram-bot-api';

interface Config {
  database_url: string;
  bot_token: string;
  me: number;
  notice: boolean;
  msg: { start: string; help: string };
  button: {
    getUserInfo: InlineKeyboardButton[][];
    sentence: InlineKeyboardButton[][];
  };
  parse: {
    html: SendMessageOptions;
    mark: SendMessageOptions;
    mark2: SendMessageOptions;
    help: { parse_mode: ParseMode; reply_markup: InlineKeyboardMarkup };
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
