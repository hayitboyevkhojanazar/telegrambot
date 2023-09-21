const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')
const token = '6600394754:AAE_yuosRSA40vb1U3tuTZGpqW2LVN88A6I';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
   await bot.sendMessage(chatId, "Endi men 0 dan 9 gacha raqamni taxmin qilaman va siz buni taxmin qilishingiz kerak!");
   const randomNumber = Math.floor(Math.random() * 10);
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, "Taxmin qiling!", gameOptions)
}

const start = () => {
   bot.setMyCommands([
      {
         command: '/start',
         description: 'Dastlabki salomlashish'
      },
      {
         command: '/info',
         description: "Foydalanuvchi haqida ma'lumot"
      },
      {
         command: '/game',
         description: "Taxminiy raqamlar o'yini"
      }
   ])
   
   bot.on('message', async msg =>{
      const text = msg.text;
      const chatId = msg.chat.id;
   
      if (text === '/start'){
         await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/256/7.webp');
         return bot.sendMessage(chatId, `Salom! Telegram botimizga xush kelibsiz!`);
      }
      if (text === '/info') {
         return bot.sendMessage(chatId, `Sizning ismingiz: ${msg.from.first_name} ${msg.from.last_name}`)
      }

      if(text === '/game'){
         return startGame(chatId);
      }
      return bot.sendMessage(chatId, "Men sizni tushunmadim, qayta urinib ko'ring!)")
   })
}

bot.on('callback_query', msg => {
   const data = msg.data;
   const chatId = msg.message.chat.id;
   if (data === '/again'){
      return startGame(chatId)
   }
   if (data === chats[chatId]){
      return bot.sendMessage(chatId, `Tabriklayman, siz raqamni to'g'ri taxmin qildingiz ${chats[chatId]}`, againOptions)
   } else {
      return bot.sendMessage(chatId, `Afsuski, siz noto'g'ri taxmin qildingiz, bot raqamni taxmin qildi ${chats[chatId]}`, againOptions)
   }
})

start()