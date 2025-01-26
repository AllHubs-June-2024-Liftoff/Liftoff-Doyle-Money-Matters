import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import About from './pages/about/About'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import NavHeader from './components/navHeader/NavHeader'
import Footer from './components/footer/Footer'
import Profile from './pages/profile/Profile'
import Expense from './Components/Expense/Expense'
import IncomeSplit from './Components/IncomeSplit/IncomeSplit'
import Budget from './Components/Budget/Budget'

function App() {
                            
  return (
    <>
      <Router>
        {/* <NavHeader /> */}
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/about' element={<About />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/expense' element={<Expense />}/>
          <Route path='/incomeSplit' element={<IncomeSplit />}/>
          <Route path='/budget' element={<Budget />}/>
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
