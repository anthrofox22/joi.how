import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '../home';
import { GamePage } from '../game';

export const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/play' element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
};
