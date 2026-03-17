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
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  useEffect(() => {
    if (dateFrom && dateTo) {
      fetchMatchesWithFilter();
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
      setCurrentPage(1);
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
      setCurrentPage(1);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = matches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <nav className="mb-3">
        <Link to="/teams" className="text-decoration-none">Команды</Link>
        <span className="mx-2">›</span>
        <span className="text-secondary">{team?.name || 'Загрузка...'}</span>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          {team?.crestUrl && (
            <img 
              src={team.crestUrl} 
              alt={team.name}
              style={{ height: '30px', width: '30px', objectFit: 'contain' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div>
            <h1 className="h3 mb-1">{team?.name}</h1>
            {team?.area && (
              <p className="text-secondary mb-0">{team.area.name}</p>
            )}
          </div>
        </div>
        <div className="text-secondary">
          {matches.length} матчей • Страница {currentPage} из {totalPages || 1}
        </div>
      </div>

      <div className="bg-light p-3 mb-4 rounded">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              placeholder="Дата с"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              placeholder="Дата по"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          
        </div>
      </div>

      {currentMatches.length > 0 ? (
        <>
          <div className="d-flex flex-column gap-2">
            {currentMatches.map(match => (
              <div key={match.id} className="border p-3 rounded bg-white hover-border-primary">
                <div className="d-block d-md-none">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <span className="fw-bold me-2">{formatDate(match.utcDate)}</span>
                      <span className="text-secondary">{formatTime(match.utcDate)}</span>
                    </div>
                    <span className="badge bg-secondary bg-opacity-10 text-dark">
                      {formatMatchStatus(match.status)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-end" style={{ width: '40%' }}>
                      <span className="fw-bold">{match.homeTeam?.name}</span>
                    </div>
                    <div style={{ width: '20%', textAlign: 'center' }}>
                      <span className="badge bg-light text-dark border px-2 py-1">
                        {match.status === 'FINISHED' || match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'PAUSED'
                          ? formatMatchScore(match.score) 
                          : '- :-'
                        }
                      </span>
                    </div>
                    <div className="text-start" style={{ width: '40%' }}>
                      <span className="fw-bold">{match.awayTeam?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="d-none d-md-block">
                  <div className="row align-items-center">
                    <div className="col-2">
                      <div className="fw-bold">{formatDate(match.utcDate)}</div>
                      <div className="small text-secondary">{formatTime(match.utcDate)}</div>
                    </div>
                    <div className="col-2">
                      <span className="badge bg-secondary bg-opacity-10 text-dark">
                        {formatMatchStatus(match.status)}
                      </span>
                    </div>
                    <div className="col-8">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-end" style={{ width: '45%' }}>
                          <span className="fw-bold">{match.homeTeam?.name}</span>
                        </div>
                        <div style={{ width: '10%', textAlign: 'center' }}>
                          <span className="badge bg-light text-dark border px-3 py-2">
                            {match.status === 'FINISHED' || match.status === 'IN_PLAY' || match.status === 'LIVE' || match.status === 'PAUSED'
                              ? formatMatchScore(match.score) 
                              : '- :-'
                            }
                          </span>
                        </div>
                        <div className="text-start" style={{ width: '45%' }}>
                          <span className="fw-bold">{match.awayTeam?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => goToPage(currentPage - 1)}
                  >
                    ←
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <li key={page} className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }
                  return null;
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => goToPage(currentPage + 1)}
                  >
                    →
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <div className="alert alert-info text-center">
          <p className="mb-0">Матчи не найдены</p>
          {(dateFrom || dateTo) && (
            <p className="small mt-2">
              Попробуйте изменить диапазон дат
            </p>
          )}
        </div>
      )}

        <style>{`
        .hover-border-primary {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .hover-border-primary:hover {
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 2px rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
}

export default TeamCalendarPage;