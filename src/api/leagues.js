import apiClient from './config';


export async function getLeagues() {
  try {
    const data = await apiClient('/competitions');
    return {
      leagues: data.competitions || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error('Ошибка при загрузке лиг:', error);
    throw error;
  }
}

export async function getLeagueMatches(leagueId, dateFrom, dateTo) {
  try {
    let endpoint = `/competitions/${leagueId}/matches`;
    
    if (dateFrom && dateTo) {
      endpoint += `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    }
    
    const data = await apiClient(endpoint);
    return {
      competition: data.competition,
      matches: data.matches || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error(`Ошибка при загрузке матчей лиги ${leagueId}:`, error);
    throw error;
  }
}

export async function getLeagueById(leagueId) {
  try {
    const data = await apiClient(`/competitions/${leagueId}`);
    return data;
  } catch (error) {
    console.error(`Ошибка при загрузке лиги ${leagueId}:`, error);
    throw error;
  }
}