'use client';

import { useEffect } from 'react';
import TelegramSettings from './components/telegram/TelegramSettings';
import AppointmentSettings from './components/appointment/AppointmentSettings';
import ControlSection from './components/appointment/ControlSection';
import AppointmentHistory from './components/appointment/AppointmentHistory';
import useAppointmentStore from './store/appointmentStore';

export default function Home() {
  const { isChecking, frequency, checkAppointments } = useAppointmentStore();

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

      <TelegramSettings />
      <AppointmentSettings />
      <ControlSection />
      <AppointmentHistory />
    </div>
  );
} 