'use client';

import useTelegramStore from '../../store/telegramStore';
import useAppointmentStore from '../../store/appointmentStore';

export default function TelegramSettings() {
  const { 
    botToken, 
    chatId, 
    useTelegram, 
    setBotToken, 
    setChatId, 
    setUseTelegram 
  } = useTelegramStore();
  
  const { isChecking, stopChecking, addMessage } = useAppointmentStore();

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">
          <div className="card-title-text">
            <i className="fas fa-robot"></i>
            Telegram Bildirimleri
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="telegram-toggle"
              checked={useTelegram}
              onChange={(e) => {
                setUseTelegram(e.target.checked);
                if (!e.target.checked && isChecking) {
                  stopChecking();
                  addMessage('status', 'Telegram bildirimleri kapatıldığı için kontrol durduruldu.');
                }
              }}
            />
            <label htmlFor="telegram-toggle" className="toggle-slider"></label>
          </div>
        </h2>

        {useTelegram && (
          <div className="telegram-inputs">
            <div className="form-group">
              <label>
                <i className="fas fa-key"></i>
                Bot Token
              </label>
              <input
                type="text"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Bot Father'dan aldığınız token"
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-id-card"></i>
                Chat ID
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Telegram chat ID'niz"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 