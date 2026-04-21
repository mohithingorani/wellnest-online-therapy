import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Route, BrowserRouter,Routes } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    <Routes>
      <Route index element={<App/>}/>
    </Routes>
    </BrowserRouter>
)
