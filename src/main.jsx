import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import MicroLab from './micro_lab.jsx'
import ScientificBlog from './scientific_blog.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MicroLab />} />
        <Route path="/blog" element={<ScientificBlog />} />
        <Route path="/blog/:chapterId" element={<ScientificBlog />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
