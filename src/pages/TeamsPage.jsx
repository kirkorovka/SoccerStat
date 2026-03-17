import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../api/teams';

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);
  const teamsPerPage = 20;

  useEffect(() => {
    fetchTeams();
  }, [currentPage]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * teamsPerPage;
      const data = await getTeams(teamsPerPage, offset);
      setTeams(data.teams);
      setTotalTeams(data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => {
    const teamName = team.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return teamName.includes(query);
  });

  const totalPages = Math.ceil(totalTeams / teamsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка команд...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p className="mb-2">Ошибка: {error}</p>
        <button onClick={fetchTeams} className="btn btn-primary">
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="h2">Команды</h1>
        <p className="text-secondary">
          {filteredTeams.length} из {totalTeams} команд
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '400px' }}
          placeholder="Поиск по названию команды"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTeams.length > 0 ? (
        <>
          <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3">
            {filteredTeams.map(team => (
              <div key={team.id} className="col">
                <Link 
                  to={`/teams/${team.id}`} 
                  className="text-decoration-none"
                >
                  <div className="card h-100 text-center p-3 hover-shadow transition">
                    {team.crestUrl ? (
                      <img 
                        src={team.crestUrl} 
                        alt={team.name}
                        className="img-fluid mb-2"
                        style={{ height: '60px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="bg-light rounded-circle mx-auto mb-2" 
                           style={{ width: '60px', height: '60px' }}></div>
                    )}
                    <h6 className="card-title text-dark small mb-0">
                      {team.name}
                    </h6>
                  </div>
                </Link>
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
                
                <li className="page-item disabled">
                  <span className="page-link">
                    {currentPage} из {totalPages}
                  </span>
                </li>
                
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
        <div className="alert alert-info text-center" role="alert">
          <p className="mb-2">По вашему запросу ничего не найдено</p>
          {searchQuery && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => setSearchQuery('')}
            >
              Очистить поиск
            </button>
          )}
        </div>
      )}

    </div>
  );
}

export default TeamsPage;