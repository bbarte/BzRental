import { Route, Routes } from 'react-router-dom'
import './App.css'
import Main from './Routes/Main'
import NotFound from './Routes/NotFound'
import Login from './Routes/Login'
import Register from './Routes/Register'
import ProtectedAdminRoute from './Routes/ProtectedAdminRoute'
import Users from './Routes/Admin/Users'
import ProductCategories from './Routes/Admin/ProductCategories'
import Products from './Routes/Admin/Products'
import ProtectedRoute from './Routes/ProtectedRoute'
import BrowseCategories from './Routes/BrowseCategories'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main/>}/>

        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>

        <Route element={<ProtectedAdminRoute/>}>
          <Route path='/admin/users' element={<Users/>}/>
          <Route path='/admin/product-categories' element={<ProductCategories/>}/>
          <Route path='/admin/products' element={<Products/>}/>
        </Route>

        <Route element={<ProtectedRoute/>}>
          <Route path='/browse-categories' element={<BrowseCategories/>}/>
        </Route>

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
