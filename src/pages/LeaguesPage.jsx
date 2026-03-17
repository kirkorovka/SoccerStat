import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeagues } from '../api/leagues';

function LeaguesPage() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); 

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const data = await getLeagues();
      setLeagues(data.leagues || []);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeagues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeagues.length / itemsPerPage);

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
          {filteredLeagues.length} лиг • Страница {currentPage} из {totalPages || 1}
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '400px' }}
          placeholder="Поиск по названию лиги или стране..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); 
          }}
        />
      </div>

      {currentItems.length > 0 ? (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
            {currentItems.map(league => (
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
        <div className="alert alert-info text-center" role="alert">
          <p className="mb-2">По вашему запросу ничего не найдено</p>
          {searchQuery && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
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