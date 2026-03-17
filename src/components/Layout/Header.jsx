import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          SoccerStat
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Лиги
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/teams" 
                className={`nav-link ${isActive('/teams') ? 'active' : ''}`}
              >
                Команды
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;