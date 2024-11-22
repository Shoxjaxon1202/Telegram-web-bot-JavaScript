const TelegramBot = require("node-telegram-bot-api");

const token = "7908074163:AAE8PKJ7OFmCSyA6jY9lbuZg002p7zSoRaQ";

// Botni ishga tushirish
const bot = new TelegramBot(token, { polling: true });

// Bot komandalarini o'rnatish
const bootstrap = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Botni ishga tushirish va foydalanishni boshlash",
    },
  ]);

  // Xabarlar uchun asosiy eshituvchi
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id; // Chat ID
    const text = msg.text; // Foydalanuvchi tomonidan yuborilgan xabar

    console.log(`Yangi xabar [Chat ID: ${chatId}]:`, text);

    try {
      if (text === "/start") {
        await bot.sendMessage(
          chatId,
          "Assalomu alaykum! Ustozlar hisoboti bo'limiga xush kelibsiz!\n\n" +
            "Quyidagi tugmani bosib hisobotni to'ldirishingiz mumkin:",
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "Ustozlar hisoboti",
                    web_app: {
                      url: "https://telegram-web-bot-java-script-bjvb.vercel.app/", // Web App uchun URL
                    },
                  },
                ],
              ],
              resize_keyboard: true, // Klaviatura moslashuvchan bo'lsin
              one_time_keyboard: false, // Tugmalar doimiy ko'rinsin
            },
          }
        );
      } else {
        // Agar notanish xabar kelgan bo'lsa
        await bot.sendMessage(
          chatId,
          "Kechirasiz, men faqat quyidagi komandalarga javob bera olaman:\n\n" +
            "1. /start - Botni boshlash\n" +
            "2. Tugmani bosing: Ustozlar hisoboti"
        );
      }
    } catch (err) {
      console.error("Xato yuz berdi:", err);

      // Xatolik yuz berganda foydalanuvchini xabardor qilish
      await bot.sendMessage(chatId, "Kechirasiz, tizimda xato yuz berdi!");
    }
  });
};

// Botni ishga tushirish
bootstrap();
