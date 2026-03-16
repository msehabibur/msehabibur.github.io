import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MaterialsLab from './materials_lab.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MaterialsLab />
  </StrictMode>
)
