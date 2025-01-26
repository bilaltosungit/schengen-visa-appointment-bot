export const formatAppointmentMessage = (appointments) => {
  const countryTr = {
    'France': 'Fransa',
    'Netherlands': 'Hollanda',
    'Ireland': 'İrlanda',
    'Malta': 'Malta',
    'Sweden': 'İsveç',
    'Czechia': 'Çekya',
    'Croatia': 'Hırvatistan',
    'Bulgaria': 'Bulgaristan',
    'Finland': 'Finlandiya',
    'Slovenia': 'Slovenya',
    'Denmark': 'Danimarka',
    'Norway': 'Norveç',
    'Estonia': 'Estonya',
    'Lithuania': 'Litvanya',
    'Luxembourg': 'Lüksemburg',
    'Ukraine': 'Ukrayna',
    'Latvia': 'Letonya'
  };

  const validAppointments = appointments.filter(appt => {
    if (!appt.appointment_date) return false;
    try {
      const [year, month, day] = appt.appointment_date.split('-');
      return year && month && day && !isNaN(Date.parse(appt.appointment_date));
    } catch {
      return false;
    }
  });

  if (validAppointments.length === 0) return null;

  let message = `🎉 ${countryTr[appointments[0].mission_country] || appointments[0].mission_country} için randevu bulundu!\n\n`;
  validAppointments.forEach((appt, index) => {
    if (index > 0) message += '\n----------------------------\n\n';
    message += `📅 RANDEVU TARİHİ: ${formatDate(appt.appointment_date)}\n`;
    message += `🏢 Merkez: ${appt.center_name || 'Belirtilmemiş'}\n`;
    message += `📋 Kategori: ${appt.visa_category || 'Belirtilmemiş'}\n`;
    if (appt.visa_subcategory) {
      message += `📝 Alt Kategori: ${appt.visa_subcategory}\n`;
    }
    const link = appt.book_now_link || 'Link mevcut değil';
    message += `\n🔗 <a href="${link}" target="_blank" rel="noopener noreferrer">Randevu almak için tıklayın</a>\n`;
  });
  return message;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'Tarih bilgisi mevcut değil';

  const months = {
    '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
    '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
    '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
  };

  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day || !months[month]) {
      throw new Error('Geçersiz tarih formatı');
    }
    return `${day} ${months[month]} ${year}`;
  } catch (error) {
    return 'Geçersiz tarih formatı';
  }
}; 