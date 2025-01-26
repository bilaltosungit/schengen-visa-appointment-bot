import { create } from 'zustand';
import { formatAppointmentMessage } from '../lib/utils';
import useTelegramStore from './telegramStore';
import { playNotification } from '../lib/notification';

const useAppointmentStore = create((set, get) => ({
  country: 'France',
  city: 'Ankara',
  frequency: 5,
  isChecking: false,
  messages: [],
  status: 'Program bekleme durumunda...',

  setCountry: (country) => set({ country }),
  setCity: (city) => set({ city }),
  setFrequency: (frequency) => set({ frequency }),
  setIsChecking: (isChecking) => set({ isChecking }),
  setStatus: (status) => set({ status }),

  addMessage: (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    set((state) => ({
      messages: [...state.messages, newMessage].slice(-100)
    }));
  },

  startChecking: async () => {
    const { frequency, setIsChecking, setStatus, country, city, addMessage } = get();
    const { useTelegram, botToken, chatId } = useTelegramStore.getState();
    
    if (useTelegram && (!botToken || !chatId)) {
      addMessage('error', 'Telegram bildirimleri açıkken bot token ve chat ID zorunludur!');
      return;
    }
    
    if (frequency < 1 || frequency > 60) {
      addMessage('error', 'Kontrol sıklığı 1-60 dakika arasında olmalıdır!');
      return;
    }

    setIsChecking(true);
    setStatus(`${country} - ${city} için randevu kontrolü başlatıldı`);
    await get().checkAppointments();
  },

  stopChecking: () => {
    set({ 
      isChecking: false,
      status: 'Program bekleme durumunda...'
    });
  },

  checkAppointments: async () => {
    const { country, city, addMessage } = get();
    const { useTelegram, sendTelegramMessage } = useTelegramStore.getState();

    try {
      const response = await fetch('https://api.schengenvisaappointments.com/api/visa-list/?format=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API yanıt vermedi (${response.status}): ${response.statusText}`);
      }

      const appointments = await response.json();
      
      const availableAppointments = appointments.filter(appointment => {
        return appointment.source_country === 'Turkiye' &&
               appointment.mission_country.toLowerCase() === country.toLowerCase() &&
               appointment.center_name.toLowerCase().includes(city.toLowerCase());
      });

      if (availableAppointments.length > 0) {
        const message = formatAppointmentMessage(availableAppointments);
        if (useTelegram) {
          await sendTelegramMessage(message);
        }
        addMessage('appointment', message);
        
        try {
          await playNotification();
        } catch (error) {
          addMessage('error', 'Ses bildirimi çalınamadı');
        }
      } else {
        const statusMessage = `Kontrol edildi: ${country} - ${city} (Randevu bulunamadı)`;
        addMessage('status', statusMessage);
      }
    } catch (error) {
      addMessage('error', `Hata: ${error.message}`);
      
      if (error.message.includes('API yanıt vermedi')) {
        get().stopChecking();
        addMessage('error', 'API hatası nedeniyle kontroller durduruldu. Lütfen daha sonra tekrar deneyin.');
      }
    }
  }
}));

export default useAppointmentStore; 