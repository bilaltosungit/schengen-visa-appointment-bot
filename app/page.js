"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { playNotification } from "../public/notification";
import { months, countryTr, countries, citiesTR } from "./store/enums";

export default function Home() {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [country, setCountry] = useState("France");
  const [city, setCity] = useState("Ankara");
  const [frequency, setFrequency] = useState(5);
  const [isChecking, setIsChecking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Program bekleme durumunda...");
  const [useTelegram, setUseTelegram] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Mesaj alanı için ref oluşturuyoruz
  const messageHistoryRef = useRef(null);

  // Mesajlar değiştiğinde otomatik scroll
  useEffect(() => {
    if (messageHistoryRef.current) {
      messageHistoryRef.current.scrollTop =
        messageHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage].slice(-100));
  }, []);

  const stopChecking = useCallback(() => {
    setIsChecking(false);
    setStatus("Program bekleme durumunda...");
  }, []);

  const sendTelegramMessage = useCallback(
    async (message) => {
      if (!useTelegram || message === null) return;

      try {
        const response = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: "HTML",
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            `Telegram hatası: ${error.description || "Bilinmeyen hata"}`
          );
        }
      } catch (error) {
        addMessage("error", `Telegram hatası: ${error.message}`);

        if (error.message.includes("Telegram hatası")) {
          stopChecking();
          addMessage(
            "error",
            "Telegram hatası nedeniyle kontroller durduruldu. Lütfen bot token ve chat ID'nizi kontrol edin."
          );
        }
      }
    },
    [botToken, chatId, addMessage, stopChecking, useTelegram]
  );

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) {
      return "Tarih bilgisi mevcut değil";
    }

    try {
      const [year, month, day] = dateStr.split("-");
      if (!year || !month || !day || !months[month]) {
        throw new Error("Geçersiz tarih formatı");
      }
      return `${day} ${months[month]} ${year}`;
    } catch (error) {
      return "Geçersiz tarih formatı";
    }
  }, []);

  const formatAppointmentMessage = useCallback(
    (appointments) => {
      // Tarihi geçerli olan randevuları filtrele
      const validAppointments = appointments.filter((appt) => {
        if (!appt.appointment_date) return false;
        try {
          const [year, month, day] = appt.appointment_date.split("-");
          return (
            year && month && day && !isNaN(Date.parse(appt.appointment_date))
          );
        } catch {
          return false;
        }
      });

      if (validAppointments.length === 0) return null;

      let message = `🎉 ${
        countryTr[country] || country
      } için randevu bulundu!\n\n`;
      validAppointments.forEach((appt, index) => {
        if (index > 0) message += "\n----------------------------\n\n";
        message += `📅 RANDEVU TARİHİ: ${formatDate(appt.appointment_date)}\n`;
        message += `🏢 Merkez: ${appt.center_name || "Belirtilmemiş"}\n`;
        message += `📋 Kategori: ${appt.visa_category || "Belirtilmemiş"}\n`;
        if (appt.visa_subcategory) {
          message += `📝 Alt Kategori: ${appt.visa_subcategory}\n`;
        }
        const link = appt.book_now_link || "Link mevcut değil";
        message += `\n🔗 <a href="${link}" target="_blank" rel="noopener noreferrer">Randevu almak için tıklayın</a>\n`;
      });
      return message;
    },
    [country, formatDate]
  );

  const showWebNotification = useCallback((message, type = "success") => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  }, []);

  const checkAppointments = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.schengenvisaappointments.com/api/visa-list/?format=json",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok || response?.length <= 0) {
        throw new Error(
          `API yanıt vermedi (${response.status}): ${response.statusText}`
        );
      }

      const appointments = await response.json();

      if (!Array.isArray(appointments)) {
        throw new Error("API yanıtı beklenen formatta değil");
      }

      const availableAppointments = appointments.filter((appointment) => {
        if (
          !appointment.source_country ||
          !appointment.mission_country ||
          !appointment.center_name
        ) {
          return false;
        }

        return (
          appointment.source_country === "Turkiye" &&
          appointment.mission_country.toLowerCase() === country.toLowerCase() &&
          appointment.center_name.toLowerCase().includes(city.toLowerCase())
        );
      });

      if (availableAppointments.length > 0) {
        const message = formatAppointmentMessage(availableAppointments);
        if (useTelegram) {
          await sendTelegramMessage(message);
        }
        addMessage("appointment", message);
        showWebNotification(message);

        try {
          await playNotification();
        } catch (error) {
          addMessage("error", "Ses bildirimi çalınamadı");
        }
      } else {
        const statusMessage = `Kontrol edildi: ${
          countryTr[country] || country
        } - ${city} (Randevu bulunamadı)`;
        addMessage("status", statusMessage);
        showWebNotification(statusMessage, "info");
      }
    } catch (error) {
      addMessage("error", `Hata: ${error.message}`);
      showWebNotification(error.message, "error");

      if (error.message.includes("API yanıt vermedi")) {
        stopChecking();
        addMessage(
          "error",
          "API hatası nedeniyle kontroller durduruldu. Lütfen daha sonra tekrar deneyin."
        );
      }
    }
  }, [
    country,
    city,
    formatAppointmentMessage,
    sendTelegramMessage,
    addMessage,
    stopChecking,
    useTelegram,
    showWebNotification,
  ]);

  const startChecking = useCallback(() => {
    if (useTelegram && (!botToken || !chatId)) {
      addMessage(
        "error",
        "Telegram bildirimleri açıkken bot token ve chat ID zorunludur!"
      );
      return;
    }

    if (frequency < 1 || frequency > 60) {
      addMessage("error", "Kontrol sıklığı 1-60 dakika arasında olmalıdır!");
      return;
    }

    setIsChecking(true);
    setStatus(`${country} - ${city} için randevu kontrolü başlatıldı`);
    checkAppointments();
  }, [
    botToken,
    chatId,
    country,
    city,
    frequency,
    checkAppointments,
    addMessage,
    useTelegram,
  ]);

  useEffect(() => {
    let interval;
    if (isChecking) {
      interval = setInterval(checkAppointments, frequency * 60 * 1000);
    }
    return () => clearInterval(interval);
  }, [isChecking, frequency, checkAppointments]);

  return (
    <div className="container">
      <h1 className="title">
        <i className="fas fa-passport"></i>
        Schengen Vizesi Randevu Arama
        <span className="version-badge">v2.0.0</span>
      </h1>

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
                style={{backgroundColor: "lightgray"}}
                onChange={(e) => {
                  setUseTelegram(e.target.checked);
                  if (!e.target.checked && isChecking) {
                    stopChecking();
                    addMessage(
                      "status",
                      "Telegram bildirimleri kapatıldığı için kontrol durduruldu."
                    );
                  }
                }}
              />
              <label
                htmlFor="telegram-toggle"
                className="toggle-slider"
              ></label>
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

      <div className="card">
        <div className="card-body">
          <h2 className="card-title">
            <div className="card-title-text">
              <i className="fas fa-cog"></i>
              Randevu Ayarları
            </div>
          </h2>
          <div className="settings-inputs">
            <div className="form-group">
              <label>
                <i className="fas fa-globe"></i>
                Ülke
              </label>
              <select
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  if (isChecking) {
                    stopChecking();
                    addMessage(
                      "status",
                      "Ülke değiştirildiği için kontrol durduruldu."
                    );
                  }
                }}
              >
                {countries.map((item, index) => {
                  return (
                    <option key={index} value={item?.value}>
                      {item?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-city"></i>
                Şehir
              </label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (isChecking) {
                    stopChecking();
                    addMessage(
                      "status",
                      "Şehir değiştirildiği için kontrol durduruldu."
                    );
                  }
                }}
              >
                {citiesTR.map((item, index) => {
                  return (
                    <option key={index} value={item?.value}>
                      {item?.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-clock"></i>
                Kontrol Sıklığı (dakika)
              </label>
              <input
                type="number"
                value={frequency}
                onChange={(e) => {
                  setFrequency(parseInt(e.target.value));
                  if (isChecking) {
                    stopChecking();
                    addMessage(
                      "status",
                      "Kontrol sıklığı değiştirildiği için kontrol durduruldu."
                    );
                  }
                }}
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="control-section">
        <div className="button-group">
          <button
            className={`btn ${isChecking ? "btn-danger" : "btn-primary"} ${
              isChecking ? "" : "btn-disabled"
            }`}
            onClick={isChecking ? stopChecking : startChecking}
          >
            <i className={`fas ${isChecking ? "fa-stop" : "fa-play"}`}></i>
            {isChecking ? "Kontrolü Durdur" : "Kontrolü Başlat"}
          </button>
        </div>

        <div
          className={`status ${isChecking ? "running" : "stopped"}`}
          id="status-container"
        >
          <i className="fas fa-info-circle" id="status-icon"></i>
          <p id="status-text">{status}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title">
            <div className="card-title-text">
              <i className="fas fa-history"></i>
              {useTelegram ? "Telegram Mesaj Geçmişi" : "Bulunan Randevular"}
            </div>
          </h2>
          <div className="message-history" ref={messageHistoryRef}>
            {messages.slice().map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-time">
                  <i className="fas fa-clock"></i>
                  {message.timestamp}
                </div>
                <div
                  className="message-content"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <div className="notification-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <div className="notification-message">{notificationMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
}
