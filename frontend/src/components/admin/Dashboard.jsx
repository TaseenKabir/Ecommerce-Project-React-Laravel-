import React, { useContext } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'

const Dashboard = () => {
  return (
    <Layout>
        {/* <h1>Dashboard</h1>
        <button className='btn btn-danger' onClick={logout}>Logout</button> */}

        <div className='container'>
          <div className='row'> 
            <div className='d-flex justify-content-between mt-5 pb-3'>
              <h4>Dashboard</h4>
            </div>

            <div className='col-md-3'>
              <Sidebar/>
            </div>
            <div className='col-md-9'>
              <div className='row'>
                <div className='col-md-4'>
                  <div className='card shadow'>
                    <div className='card-body'>
                      <h2>1</h2>
                      <span>Users</span>
                    </div>
                    <div className='card-footer'>
                      <a href="#">View Users</a>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card shadow'>
                    <div className='card-body'>
                      <h2>1</h2>
                      <span>Orders</span>
                    </div>
                    <div className='card-footer'>
                      <a href="#">View Orders</a>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card shadow'>
                    <div className='card-body'>
                      <h2>1</h2>
                      <span>Products</span>
                    </div>
                    <div className='card-footer'>
                      <a href="#">View Orders</a>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
    </Layout>
  )
}

export default Dashboard