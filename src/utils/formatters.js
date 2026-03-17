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
  if (!score?.fullTime?.homeTeam) return '– : –';
  
  const parts = [`${score.fullTime.homeTeam}:${score.fullTime.awayTeam}`];
  
  if (score.extraTime?.homeTeam != null) {
    parts.push(`(${score.extraTime.homeTeam}:${score.extraTime.awayTeam})`);
  }
  if (score.penalties?.homeTeam != null) {
    parts.push(`(${score.penalties.homeTeam}:${score.penalties.awayTeam})`);
  }
  
  return parts.join(' ');
};