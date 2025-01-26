'use client';

import useAppointmentStore from '../../store/appointmentStore';

export default function ControlSection() {
  const { 
    isChecking, 
    status,
    startChecking, 
    stopChecking 
  } = useAppointmentStore();

  return (
    <div className="control-section">
      <div className="button-group">
        <button
          className={`btn ${isChecking ? 'btn-danger' : 'btn-primary'} ${
            isChecking ? '' : 'btn-disabled'
          }`}
          onClick={isChecking ? stopChecking : startChecking}
        >
          <i className={`fas ${isChecking ? 'fa-stop' : 'fa-play'}`}></i>
          {isChecking ? 'Kontrolü Durdur' : 'Kontrolü Başlat'}
        </button>
      </div>

      <div className={`status ${isChecking ? 'running' : 'stopped'}`} id='status-container'>
        <i className="fas fa-info-circle" id='status-icon'></i>
        <p id='status-text'>{status}</p>
      </div>
    </div>
  );
} 