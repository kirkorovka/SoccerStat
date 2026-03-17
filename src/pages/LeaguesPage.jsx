import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeagues } from '../api/leagues';

function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await getLeagues();
      setLeagues(data.leagues);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeagues = leagues.filter(league => {
    const leagueName = league.name?.toLowerCase() || '';
    const countryName = league.area?.name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return leagueName.includes(query) || countryName.includes(query);
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка лиг...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        <p className="mb-2">Ошибка: {error}</p>
        <button onClick={fetchLeagues} className="btn btn-primary">
          Повторить попытку
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="h2">Лиги и соревнования</h1>
        <p className="text-secondary">
          {filteredLeagues.length} {filteredLeagues.length === 1 ? 'лига' : 
            filteredLeagues.length > 1 && filteredLeagues.length < 5 ? 'лиги' : 'лиг'}
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '400px' }}
          placeholder="Поиск по названию лиги или стране..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>


      {filteredLeagues.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredLeagues.map(league => (
            <div key={league.id} className="col">
              <Link 
                to={`/leagues/${league.id}`} 
                className="text-decoration-none"
              >
                <div className="card h-100 shadow-sm hover-shadow transition">
                  <div className="card-body">
                    <h5 className="card-title text-dark">{league.name}</h5>
                    <p className="card-text text-secondary">
                      {league.area?.name || 'Неизвестная страна'}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
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

export default LeaguesPage;