import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProviders } from './store/index.tsx'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
)
