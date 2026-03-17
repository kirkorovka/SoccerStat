import apiClient from './config';


export async function getTeams() {
  try {
    const data = await apiClient('/teams');
    return {
      teams: data.teams || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error('Ошибка при загрузке команд:', error);
    throw error;
  }
}


export async function getTeamById(teamId) {
  try {
    const data = await apiClient(`/teams/${teamId}`);
    return data;
  } catch (error) {
    console.error(`Ошибка при загрузке команды ${teamId}:`, error);
    throw error;
  }
}


export async function getTeamMatches(teamId, dateFrom, dateTo) {
  try {
    let endpoint = `/teams/${teamId}/matches`;
    
    if (dateFrom && dateTo) {
      endpoint += `?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    }
    
    const data = await apiClient(endpoint);
    return {
      team: data.team,
      matches: data.matches || [],
      count: data.count || 0
    };
  } catch (error) {
    console.error(`Ошибка при загрузке матчей команды ${teamId}:`, error);
    throw error;
  }
}