'use client';

import { useState, useEffect } from 'react';

const THEME_COLORS = {
  light: {
    background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
    text: '#2D3748',
    inputBg: '#ffffff',
    cardBg: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    border: '#E2E8F0',
    toggleBg: '#ffffff',
    toggleIcon: '#4C51BF',
    labelText: '#718096',
    primary: '#4F46E5',
    messageBg: 'linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%)',
    messageText: '#2D3748',
    messageTime: '#718096',
    messageLink: '#4F46E5',
    messageBorder: '#E2E8F0'
  },
  dark: {
    background: 'linear-gradient(120deg, #0B1120 0%, #111827 100%)',
    text: '#F7FAFC',
    inputBg: '#1F2937',
    cardBg: 'linear-gradient(135deg, #1E293B 0%, #1F2937 100%)',
    border: '#374151',
    toggleBg: '#1E293B',
    toggleIcon: '#818CF8',
    labelText: '#9CA3AF',
    primary: '#818CF8',
    messageBg: 'linear-gradient(135deg, #1E293B 0%, #1F2937 100%)',
    messageText: '#F7FAFC',
    messageTime: '#A0AEC0',
    messageLink: '#90CDF4',
    messageBorder: '#374151'
  }
};

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Telegram input'larını güncelle
  const updateTelegramInputs = (colors) => {
    const telegramInputs = document.querySelectorAll('.telegram-section input');
    telegramInputs.forEach(input => {
      input.style.setProperty('background-color', colors.inputBg, 'important');
      input.style.setProperty('color', colors.text, 'important');
      input.style.setProperty('border-color', colors.border, 'important');
    });
  };

  const applyTheme = (dark) => {
    const colors = dark ? THEME_COLORS.dark : THEME_COLORS.light;
    
    // Ana başlık
    document.querySelector('.title')?.style.setProperty('color', colors.text);
    
    // Tüm başlıklar
    document.querySelectorAll('h1, h2, h3, .card-title, .title-text')
      .forEach(el => el.style.setProperty('color', colors.text));
    
    // Label'lar
    document.querySelectorAll('.form-group label, .input-label')
      .forEach(el => el.style.setProperty('color', colors.labelText));
    
    // Normal input'lar
    document.querySelectorAll('.form-group input, .form-group select')
      .forEach(el => {
        el.style.setProperty('background-color', colors.inputBg);
        el.style.setProperty('color', colors.text);
        el.style.setProperty('border-color', colors.border);
        el.style.setProperty('box-shadow', dark ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)');
      });
    
    // Telegram input'larını güncelle
    updateTelegramInputs(colors);
    
    // Kartlar
    document.querySelectorAll('.card')
      .forEach(el => {
        el.style.setProperty('background-image', colors.cardBg);
        el.style.setProperty('border-color', colors.border);
        el.style.setProperty('box-shadow', dark ? '0 4px 6px rgba(0, 0, 0, 0.2)' : '0 4px 6px rgba(0, 0, 0, 0.1)');
      });
    
    // İkonlar
    document.querySelectorAll('.form-group i, .card-title i')
      .forEach(el => el.style.setProperty('color', colors.primary));
    
    // Telegram mesajları
    document.querySelectorAll('.message')
      .forEach(el => {
        el.style.setProperty('background-image', colors.messageBg);
        el.style.setProperty('border-color', colors.messageBorder);
        el.style.setProperty('color', colors.messageText, 'important');
        el.style.setProperty('box-shadow', dark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)');
        
        // Mesaj içeriğindeki tüm text elementleri için renk ayarı
        el.querySelectorAll('.message-content *')
          .forEach(child => {
            if (child.tagName !== 'A') { // Link olmayan elementler için
              child.style.setProperty('color', colors.messageText, 'important');
            }
          });
      });

    document.querySelectorAll('.message-time')
      .forEach(el => {
        el.style.setProperty('color', colors.messageTime, 'important');
      });

    document.querySelectorAll('.message-content a')
      .forEach(el => {
        el.style.setProperty('color', colors.messageLink, 'important');
      });
    
    // Arka plan
    document.body.style.setProperty('background-image', colors.background);
    document.body.style.setProperty('color', colors.text);

    // Yeni eklenen mesajları izle ve stilleri uygula
    const messageHistory = document.querySelector('.message-history');
    if (messageHistory) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.classList?.contains('message')) {
              // Yeni eklenen mesaja stilleri uygula
              node.style.setProperty('background-image', colors.messageBg);
              node.style.setProperty('border-color', colors.messageBorder);
              node.style.setProperty('color', colors.messageText, 'important');
              node.style.setProperty('box-shadow', dark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)');

              // Mesaj zamanı
              const timeElement = node.querySelector('.message-time');
              if (timeElement) {
                timeElement.style.setProperty('color', colors.messageTime);
              }

              // Mesaj içeriği ve linkler
              const contentElement = node.querySelector('.message-content');
              if (contentElement) {
                contentElement.style.setProperty('color', colors.messageText, 'important');
                contentElement.querySelectorAll('a').forEach(link => {
                  link.style.setProperty('color', colors.messageLink);
                });
              }
            }
          });
        });
      });

      observer.observe(messageHistory, {
        childList: true,
        subtree: true
      });
    }
  };

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(initialDarkMode);
    applyTheme(initialDarkMode);

    // Telegram toggle event listener'ı ekle - sadece görünürlük kontrolü
    const telegramToggle = document.querySelector('.telegram-toggle input');
    const telegramSection = document.querySelector('.telegram-section');
    
    if (telegramToggle && telegramSection) {
      telegramToggle.addEventListener('change', () => {
        const isVisible = telegramToggle.checked;
        telegramSection.style.display = isVisible ? 'block' : 'none';
        
        // Görünürlük değiştiğinde renkleri tekrar uygula
        if (isVisible) {
          const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;
          updateTelegramInputs(colors);
        }
      });
    }

    // System theme değişikliğini dinle
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        applyTheme(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    applyTheme(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const colors = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <button 
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: 'none',
        background: colors.toggleBg,
        boxShadow: isDarkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      {isDarkMode ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.toggleIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.toggleIcon}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
} 