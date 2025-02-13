import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Filters from './components/vehicles/filters.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Filters />
  </StrictMode>,
)
