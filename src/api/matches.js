import apiClient from './config';


export function formatMatchStatus(status) {
  const statusMap = {
    'SCHEDULED': 'Запланирован',
    'LIVE': 'В прямом эфире',
    'IN_PLAY': 'В игре',
    'PAUSED': 'Пауза',
    'FINISHED': 'Завершен',
    'POSTPONED': 'Отложен',
    'SUSPENDED': 'Приостановлен',
    'CANCELED': 'Отменен'
  };
  
  return statusMap[status] || status;
}


export function formatMatchScore(score) {
  const parts = [];
  
  if (score.fullTime?.homeTeam !== null && score.fullTime?.awayTeam !== null) {
    parts.push(`${score.fullTime.homeTeam}:${score.fullTime.awayTeam}`);
  }
  
  if (score.extraTime?.homeTeam !== null && score.extraTime?.awayTeam !== null) {
    parts.push(`(${score.extraTime.homeTeam}:${score.extraTime.awayTeam})`);
  }
  
  if (score.penalties?.homeTeam !== null && score.penalties?.awayTeam !== null) {
    parts.push(`(${score.penalties.homeTeam}:${score.penalties.awayTeam})`);
  }
  
  return parts.join(' ') || '– : –';
}


export async function getMatches(type, id, dateFrom, dateTo) {
  try {
    let endpoint = `/${type}/${id}/matches`;
    
    if (dateFrom && dateTo) {
      endpoint += `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    }
    
    const data = await apiClient(endpoint);
    return {
      entity: data[type.slice(0, -1)], 
      matches: data.matches || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error(`Ошибка при загрузке матчей:`, error);
    throw error;
  }
}