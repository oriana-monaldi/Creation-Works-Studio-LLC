import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/immersive.css'
import './styles/refinement.css'
import './styles/kinetic.css'
import './styles/black-gold.css'
import './styles/viewport.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



