export const formatMatchStatus = (status) => {
  const statusMap = {
    'SCHEDULED': 'Запланирован',
    'TIMED': 'Запланирован',
    'LIVE': 'В прямом эфире',
    'IN_PLAY': 'В игре',
    'PAUSED': 'Пауза',
    'FINISHED': 'Завершен',
    'POSTPONED': 'Отложен',
    'SUSPENDED': 'Приостановлен',
    'CANCELED': 'Отменен'
  };
  return statusMap[status] || status || 'Неизвестно';
};

export const formatMatchScore = (score) => {
  if (!score) return '- :-';
  
  const parts = [];
  
  if (score.fullTime?.home !== null && score.fullTime?.home !== undefined) {
    parts.push(`${score.fullTime.home}:${score.fullTime.away}`);
  }
  
  if (score.extraTime?.home !== null && score.extraTime?.home !== undefined) {
    parts.push(`(${score.extraTime.home}:${score.extraTime.away})`);
  }
  
  if (score.penalties?.home !== null && score.penalties?.home !== undefined) {
    parts.push(`(${score.penalties.home}:${score.penalties.away})`);
  }
  
  return parts.join(' ') || '- :-';
};