import { Route, Routes } from 'react-router-dom'
import './App.css'
import Main from './Routes/Main'
import NotFound from './Routes/NotFound'
import Login from './Routes/Login'
import Register from './Routes/Register'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main/>}/>

        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
