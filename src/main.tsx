import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RDANA from './RDANA.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RDANA />
  </StrictMode>,
)
