# 🌍 Schengen Vizesi Randevu Takip Uygulaması

 ⚠️ ⚠️ ⚠️ BOT BU ARALAR KULLANIM DIŞIDIR ⚠️ ⚠️ ⚠️
 🔊🔊🔊   Bot'un kullandığı ücretsiz vfs global servisi dönem dönem yanıt vermemektedir bu yüzden de bot çalışmamaktadır.
            Servis kullanıma açıldığında buradan güncelleme yaparım.

Modern web arayüzlü ve terminal tabanlı, gerçek zamanlı bildirim sistemine sahip Schengen vize randevu kontrol uygulaması.

## 🚀 Özellikler

- 17 Schengen ülkesi için randevu kontrolü:
  - Fransa 🇫🇷
  - Hollanda 🇳🇱
  - İrlanda 🇮🇪
  - Malta 🇲🇹
  - İsveç 🇸🇪
  - Çekya 🇨🇿
  - Hırvatistan 🇭🇷
  - Bulgaristan 🇧🇬
  - Finlandiya 🇫🇮
  - Slovenya 🇸🇮
  - Danimarka 🇩🇰
  - Norveç 🇳🇴
  - Estonya 🇪🇪
  - Litvanya 🇱🇹
  - Lüksemburg 🇱🇺
  - Ukrayna 🇺🇦
  - Letonya 🇱🇻

- İki farklı kullanım seçeneği:
  1. 🖥️ Modern Web Arayüzü (Next.js)
  2. ⌨️ Terminal Uygulaması (Python)

- Bildirim seçenekleri:
  - 🤖 Telegram bildirimleri
  - 🔔 Web bildirimleri (sadece web arayüzünde)
  - 🔊 Sesli bildirimler
  - 📝 Mesaj geçmişi

## 💻 Sistem Gereksinimleri

### Web Arayüzü için:
- Node.js 18.0.0 veya üzeri
- npm (Node.js ile birlikte gelir)
- Modern bir web tarayıcısı

### Terminal Uygulaması için:
- Python 3.8 veya üzeri
- pip (Python paket yöneticisi)

## 🛠️ Kurulum

### Web Arayüzü Kurulumu:

1. Node.js'i yükleyin:
   - Windows için: [nodejs.org](https://nodejs.org)
   - macOS için: `brew install node`
   - Linux için: `sudo apt install nodejs npm`

2. Projeyi indirin ve web arayüzünü başlatın:
   ```bash
   git clone https://github.com/bilaltosungit/schengen-visa-appointment-bot.git
   cd schengen-visa-appointment-bot
   npm install
   npm run dev
   ```

3. Tarayıcınızda açın:
   ```
   http://localhost:3000
   ```

### Terminal Uygulaması Kurulumu:

1. Python'u yükleyin:
   - Windows için: [python.org](https://python.org)
   - macOS için: `brew install python`
   - Linux için: `sudo apt install python3 python3-pip`

2. Gerekli paketleri yükleyin:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Uygulamayı başlatın:
   ```bash
   python check_appointment.py
   ```

## 🤖 Telegram Bot Kurulumu

1. [@BotFather](https://t.me/botfather) ile konuşma başlatın
2. `/newbot` komutu ile bot oluşturun
3. Bot token'ı kaydedin
4. Bot ile konuşma başlatın
5. Chat ID'nizi alın:
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```

### Web Arayüzü için:
- Telegram ayarları bölümünden token ve chat ID'yi girin

### Terminal Uygulaması için:
- `.env` dosyası oluşturun:
  ```
  TELEGRAM_BOT_TOKEN=your_bot_token
  TELEGRAM_CHAT_ID=your_chat_id
  ```

## 🔧 Sorun Giderme

### Web Arayüzü Sorunları:
1. "npm not found":
   - Node.js'i yeniden yükleyin
2. Port 3000 hatası:
   - Portu değiştirin: `PORT=3001 npm run dev`

### Terminal Uygulaması Sorunları:
1. "python/pip not found":
   - Python'u PATH'e ekleyin
2. ModuleNotFoundError:
   - `pip install -r requirements.txt` komutunu tekrar çalıştırın

## 🔒 Güvenlik

- Bot token'ınızı gizli tutun
- .env dosyasını asla paylaşmayın
- Düzenli güvenlik güncellemelerini takip edin

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun
