'use client';

import { useRef, useEffect } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import useTelegramStore from '../../store/telegramStore';

export default function AppointmentHistory() {
  const { messages } = useAppointmentStore();
  const { useTelegram } = useTelegramStore();
  const messageHistoryRef = useRef(null);

  useEffect(() => {
    if (messageHistoryRef.current) {
      messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">
          <div className="card-title-text">
            <i className="fas fa-history"></i>
            {useTelegram ? 'Telegram Mesaj Geçmişi' : 'Bulunan Randevular'}
          </div>
        </h2>
        <div className="message-history" ref={messageHistoryRef}>
          {messages.map(message => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-time">
                <i className="fas fa-clock"></i>
                {message.timestamp}
              </div>
              <div 
                className="message-content" 
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 