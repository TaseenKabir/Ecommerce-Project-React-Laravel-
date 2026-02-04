import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Cart from './components/Cart'
import Chekout from './components/Chekout'
import Login from './components/admin/Login'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'

import {default as ShowCategories} from './components/admin/categories/Show'
import {default as CreateCategory} from './components/admin/categories/Create'
import {default as EditCategory} from './components/admin/categories/Edit'

import {default as ShowProducts} from './components/admin/products/Show'
import {default as CreateProduct} from './components/admin/products/Create'
import {default as EditProduct} from './components/admin/products/Edit'
import Register from './components/Register'
import {default as UserLogin} from './components/Login'
import Profile from './components/Profile'
import { RequireAuth } from './components/RequireAuth'
import Confirmation from './components/Confirmation'
import ShowOrders from './components/orders/ShowOrders'
import OrderDetails from './components/orders/OrderDetails'
import Wishlist from './components/Wishlist'
import {default as UserOrderDetails} from './components/orders/user/OrderDetails'

import MyOrders from './components/orders/user/MyOrders'
import Shipping from './components/admin/shipping/Shipping'

function App() {

  return (
    <>
    
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path='/' element={<Home/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/product/:id' element={<Product />} />       
          <Route path='/cart' element={<Cart/>}/>
          {/* <Route path='/checkout' element={<Chekout/>}/> */}
          <Route path='/account/register' element={<Register/>}/>
          <Route path='/account/login' element={<UserLogin/>}/>     

          <Route path='/wishlist' element={
            <RequireAuth>
              <Wishlist/>
            </RequireAuth>
          }/>    

          <Route path='/account' element={
            <RequireAuth>
              <Profile/>
            </RequireAuth>
          }/>

          <Route path='/checkout' element={
            <RequireAuth>
              <Chekout/>
            </RequireAuth>
          }/>

          <Route path='/account/orders' element={
            <RequireAuth>
              <MyOrders/>
            </RequireAuth>
          }/>

          <Route path='/account/orders/details/:id' element={
            <RequireAuth>
              <UserOrderDetails/>
            </RequireAuth>
          }/>

          <Route path='/order/confirmation/:id' element={
            <RequireAuth>
              <Confirmation/>
            </RequireAuth>
          }/>

          {/* Admin Routes */}
          <Route path='/admin/login' element={<Login/>}/>

          <Route path='/admin/dashboard' element={
            <AdminRequireAuth>
              <Dashboard/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/categories' element={
            <AdminRequireAuth>
              <ShowCategories/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/categories/create' element={
            <AdminRequireAuth>
              <CreateCategory/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/categories/edit/:id' element={
            <AdminRequireAuth>
              <EditCategory/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/products' element={
            <AdminRequireAuth>
              <ShowProducts/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/products/create' element={
            <AdminRequireAuth>
              <CreateProduct/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/products/edit/:id' element={
            <AdminRequireAuth>
              <EditProduct/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/orders' element={
            <AdminRequireAuth>
              <ShowOrders/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/order/:id' element={
            <AdminRequireAuth>
              <OrderDetails/>
            </AdminRequireAuth>
          }/>

          <Route path='/admin/shipping' element={
            <AdminRequireAuth>
              <Shipping/>
            </AdminRequireAuth>
          }/>

        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
