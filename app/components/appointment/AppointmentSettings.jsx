'use client';

import useAppointmentStore from '../../store/appointmentStore';
import { countries } from '../../constants/countries';
import { cities } from '../../constants/cities';

export default function AppointmentSettings() {
  const { 
    country, 
    city, 
    frequency, 
    isChecking,
    setCountry, 
    setCity, 
    setFrequency,
    stopChecking,
    addMessage 
  } = useAppointmentStore();

  return (
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
                  addMessage('status', 'Ülke değiştirildiği için kontrol durduruldu.');
                }
              }}
            >
              {countries.map(({ value, label, flag }) => (
                <option key={value} value={value}>
                  {label} {flag}
                </option>
              ))}
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
                  addMessage('status', 'Şehir değiştirildiği için kontrol durduruldu.');
                }
              }}
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
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
                  addMessage('status', 'Kontrol sıklığı değiştirildiği için kontrol durduruldu.');
                }
              }}
              min="1"
              max="60"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 