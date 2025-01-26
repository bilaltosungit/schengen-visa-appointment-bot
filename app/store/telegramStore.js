import { create } from 'zustand';

const useTelegramStore = create((set, get) => ({
  botToken: '',
  chatId: '',
  useTelegram: false,
  
  setBotToken: (token) => set({ botToken: token }),
  setChatId: (id) => set({ chatId: id }),
  setUseTelegram: (use) => set({ useTelegram: use }),

  sendTelegramMessage: async (message) => {
    const { botToken, chatId, useTelegram } = get();
    if (!useTelegram) return;

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Telegram hatası: ${error.description || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      throw error;
    }
  }
}));

export default useTelegramStore; 