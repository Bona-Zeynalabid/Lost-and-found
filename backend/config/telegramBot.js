const TelegramBot = require('node-telegram-bot-api');
const User = require('../models/User');

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is not set in .env');
}

let bot;

try {
  bot = new TelegramBot(token, { polling: true });
  console.log('Telegram bot started successfully');
} catch (err) {
  console.error('Failed to start Telegram bot:', err.message);
}

// Handle /start command
if (bot) {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id.toString();
    const userId = msg.text.split(' ')[1];

    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.telegramChatId = chatId;
          user.telegramConnected = true;
          await user.save();
          bot.sendMessage(chatId, `✅ Successfully connected to FoundIt!\n\nYou will now receive notifications when matches are found for your lost/found reports.\n\nYour account: ${user.firstName} ${user.lastName}\nEmail: ${user.email}`);
        } else {
          bot.sendMessage(chatId, '❌ User not found. Please copy the correct connection code from your profile page.');
        }
      } catch (err) {
        bot.sendMessage(chatId, '❌ Connection failed. Please try again.');
      }
    } else {
      bot.sendMessage(chatId, `👋 Welcome to FoundIt Bot!\n\nTo connect your account:\n1. Go to your Profile page on FoundIt\n2. Copy your Connection Code\n3. Send it here: /start YOUR_CODE\n\nExample: /start 507f1f77bcf86cd799439011`);
    }
  });

  // Handle text messages (for direct ID paste)
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id.toString();
    const text = msg.text;

    if (!text || text.startsWith('/')) return;

    if (/^[a-f\d]{24}$/i.test(text)) {
      try {
        const user = await User.findById(text);
        if (user) {
          user.telegramChatId = chatId;
          user.telegramConnected = true;
          await user.save();
          bot.sendMessage(chatId, `✅ Successfully connected to FoundIt!\n\nAccount: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\n\nYou will now receive match notifications.`);
        } else {
          bot.sendMessage(chatId, '❌ Invalid connection code.');
        }
      } catch (err) {
        bot.sendMessage(chatId, '❌ Connection failed. Please try again.');
      }
    }
  });
}

// Function to send notification
async function sendTelegramNotification(userId, message, replyMarkup = null) {
  try {
    const user = await User.findById(userId);
    if (user && user.telegramConnected && user.telegramChatId) {
      const options = {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      };

      if (replyMarkup) {
        options.reply_markup = replyMarkup;
      }

      await bot.sendMessage(user.telegramChatId, message, options);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Telegram notification error:', err);
    return false;
  }
}

module.exports = { bot, sendTelegramNotification };