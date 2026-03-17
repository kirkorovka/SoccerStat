import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import LeaguesPage from './pages/LeaguesPage';
import TeamsPage from './pages/TeamsPage';
import LeagueCalendarPage from './pages/LeagueCalendarPage';
import TeamCalendarPage from './pages/TeamCalendarPage';

function App() {
  return (
    <BrowserRouter basename="/SoccerStat">
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 py-4">
          <div className="container">
            <Routes>
              <Route path="/" element={<LeaguesPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/leagues/:leagueId" element={<LeagueCalendarPage />} />
              <Route path="/teams/:teamId" element={<TeamCalendarPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;