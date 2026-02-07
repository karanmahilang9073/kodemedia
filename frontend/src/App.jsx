import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/' element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
            }
          />
        </Routes>
    </div>
  )
}

export default App
