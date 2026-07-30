import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Using standard React 18 rendering
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
