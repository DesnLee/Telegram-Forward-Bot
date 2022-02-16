import TelegramBot from 'node-telegram-bot-api';
import { botToken } from '../getConfig';

export default new TelegramBot(botToken, { polling: true });
