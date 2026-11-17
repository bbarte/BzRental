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
import BrowseProducts from './Routes/BrowseProducts'
import Product from './Routes/Product'
import ManageProductRentings from './Routes/Admin/ManageProductRentings'

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
          <Route path='/admin/rentings' element={<ManageProductRentings/>}/>
        </Route>

        <Route element={<ProtectedRoute/>}>
          <Route path='/browse-categories' element={<BrowseCategories/>}/>
          <Route path='/browse-products' element={<BrowseProducts/>}/>
          <Route path='/products/:id' element={<Product/>}/>
        </Route>

        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
