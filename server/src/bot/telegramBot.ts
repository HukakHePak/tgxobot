import { Bot } from 'grammy';

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN not set in environment!');
}

export const bot = new Bot(BOT_TOKEN);
bot.command('start', ctx => ctx.reply("Hi! I'm here to help you play — open the app to get bonuses and a little happiness 🌸"));
bot.start();
