import { Bot } from 'grammy';

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN not set in environment!');
}

export const bot = new Bot(BOT_TOKEN);
bot.command('start', ctx => ctx.reply('Бот активен! Играйте на сайте.'));
bot.start();
