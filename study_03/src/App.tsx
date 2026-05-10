import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { useDarkMode } from './hooks/useDarkMode';
import DarkModeToggle from './components/DarkModeToggle';
import StartPage from './pages/StartPage';
import ModePage from './pages/ModePage';
import CategoryIntroPage from './pages/CategoryIntroPage';
import QuestionPage from './pages/QuestionPage';
import CategoryEndPage from './pages/CategoryEndPage';
import ResultPage from './pages/ResultPage';
import RankingPage from './pages/RankingPage';

export default function App() {
  const [dark, setDark] = useDarkMode();

  return (
    <GameProvider>
      <HashRouter>
        <div className="fixed top-4 right-4 z-50">
          <DarkModeToggle dark={dark} onToggle={() => setDark(!dark)} />
        </div>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/mode" element={<ModePage />} />
          <Route path="/category-intro" element={<CategoryIntroPage />} />
          <Route path="/quiz" element={<QuestionPage />} />
          <Route path="/category-end" element={<CategoryEndPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}
