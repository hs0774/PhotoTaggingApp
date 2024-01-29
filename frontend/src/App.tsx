import { Routes,Route,Navigate } from 'react-router-dom'
import Game from './components/Game'
import Home from './components/Home'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className='app'>
        <Navbar />
        <div className='pages'>
          <Routes>
              <Route
                path='/'
                element={<Navigate to="/api/v1" />}
              />
              <Route
                path='/api/v1'
                element={<Home/>}
              />   
              <Route
                path='/api/v1/game/:id'
                element= {<Game/>}
              />  
          </Routes>
        </div>
    </div>
  );
}

export default App;
