import { Routes,Route,Navigate } from 'react-router-dom'
import Game from './components/Game'
import Home from './components/Home'
import Navbar from './components/Navbar'
import Leaderboard from './components/Leaderboard'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className='app'>
      <div className='content'>      
        <Navbar />
        <div className='pages'>
          <Routes>
              <Route
                path='/'
                element={<Home/>}
              />   
              <Route
                path='/game/:id'
                element= {<Game/>}
              />  
              <Route
                path='/scores'
                element={<Leaderboard/>}
              />
          </Routes>
          </div>
        </div>
        <Footer />
    </div>
  );
}

export default App;
