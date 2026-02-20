import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div>
        <Routes>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />

          <Route element={<ProtectedRoute />} >
            <Route path='/' element={<Home />} /> 
            <Route path='profile' element={<UserProfile />} /> 
          </Route>
        </Routes>
    </div>
  )
}

export default App
