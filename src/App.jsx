import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import reactLogo from './assets/react.svg'
import './App.css'

// pages
import Home from './pages/Home'
import Create from './pages/Create'
import Party from './pages/Event'
import NotFound from './pages/NotFound'

// components
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <ToastContainer
        position='bottom-right'
        transition={Slide}
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
      />
      <Helmet titleTemplate='EVE-ENT-UAL - %s' defaultTitle='EVE'>
      </Helmet>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/'>
            <Route index element={<Home />} />
            <Route path='/create' element={<Create />} />
            <Route path='/event/:id' element={<Party />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
