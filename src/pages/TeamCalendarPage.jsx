import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeamMatches, getTeamById } from '../api/teams';
import { formatMatchStatus, formatMatchScore } from '../utils/formatters';

function TeamCalendarPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchMatchesWithFilter();
    } else {
      fetchTeamData();
    }
  }, [dateFrom, dateTo, teamId]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [teamData, matchesData] = await Promise.all([
        getTeamById(teamId),
        getTeamMatches(teamId)
      ]);
      setTeam(teamData);
      setMatches(matchesData.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchesWithFilter = async () => {
    try {
      setLoading(true);
      const matchesData = await getTeamMatches(teamId, dateFrom, dateTo);
      setMatches(matchesData.matches || []);
      
      if (!team) {
        const teamData = await getTeamById(teamId);
        setTeam(teamData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupedMatches = matches.reduce((groups, match) => {
    const date = formatDate(match.utcDate);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(match);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('.').map(Number);
    const [dayB, monthB, yearB] = b.split('.').map(Number);
    return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
  });

  if (loading && !team) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка календаря команды...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p className="mb-2">Ошибка: {error}</p>
        <button onClick={fetchTeamData} className="btn btn-primary">
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/teams" className="text-decoration-none">Команды</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {team?.name || 'Загрузка...'}
          </li>
        </ol>
      </nav>

      <div className="mb-4 d-flex align-items-center gap-3">
        {team?.crestUrl && (
          <img 
            src={team.crestUrl} 
            alt={team.name}
            style={{ height: '50px', width: '50px', objectFit: 'contain' }}
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <div>
          <h1 className="h2 mb-1">{team?.name || 'Календарь команды'}</h1>
          {team?.area && (
            <p className="text-secondary mb-0">{team.area.name}</p>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Фильтр по дате</h5>
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label htmlFor="dateFrom" className="form-label">С</label>
              <input
                type="date"
                className="form-control"
                id="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="dateTo" className="form-label">По</label>
              <input
                type="date"
                className="form-control"
                id="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
              >
                Сбросить фильтр
              </button>
            </div>
          </div>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="matches-list">
          {sortedDates.map(date => (
            <div key={date} className="mb-4">
              <h5 className="border-bottom pb-2 mb-3">{date}</h5>
              <div className="list-group">
                {groupedMatches[date].map(match => (
                  <div key={match.id} className="list-group-item list-group-item-action">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-md-center mb-2 mb-md-0">
                        <div className="fw-bold">{formatTime(match.utcDate)}</div>
                        <div className="small text-secondary">
                          {formatMatchStatus(match.status)}
                        </div>
                      </div>

                      <div className="col-md-10">
                        <div className="row align-items-center">
                          <div className="col-5 text-end">
                            <span className={`fw-bold ${match.homeTeam?.id === team?.id ? 'text-primary' : ''}`}>
                              {match.homeTeam?.name}
                            </span>
                          </div>

                          <div className="col-2 text-center">
                            <span className="badge bg-light text-dark fs-6 p-2">
                              {match.status === 'FINISHED' || match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'PAUSED'
                                ? formatMatchScore(match.score) 
                                : '- :-'
                              }
                            </span>
                          </div>

                          <div className="col-5 text-start">
                            <span className={`fw-bold ${match.awayTeam?.id === team?.id ? 'text-primary' : ''}`}>
                              {match.awayTeam?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          <p className="mb-0">Матчи не найдены</p>
          {(dateFrom || dateTo) && (
            <p className="small mt-2">
              Попробуйте изменить диапазон дат
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TeamCalendarPage;