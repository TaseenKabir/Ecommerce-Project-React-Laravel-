import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from '../common/Sidebar'
import { adminToken, apiUrl } from '../common/http'
import Loader from '../common/Loader'
import Nostate from '../common/Nostate'

const ShowOrders = () => {

    const [orders, setOrders] = useState([]);
    const [loader, setLoader] = useState(false);

    const fetchOrders = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result);
            setLoader(false)
            if (result.status == 200){
                setOrders(result.data)
            } else {
                console.log("Something went wrong...")
            }
        })
    }

    useEffect(() => {
        fetchOrders();
    },[])

  return (
    <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4>Orders</h4>
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <div className='card shadow'>
              <div className='card-body p-4'>
                {
                    loader == true && <Loader />
                }
                {
                    loader == false && orders.length == 0 && <Nostate text='Order not found.'/>
                }
                {
                    orders && orders.length > 0 && 
                    <div>
                        <table className="table-striped table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Payment Status</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map(order => {
                                        return (
                                            <tr key={`order-${order.id}`}>
                                                <td>
                                                    <Link to={`/admin/order/${order.id}`}>{order.id}</Link>
                                                </td>
                                                <td>{order.name}</td>
                                                <td>{order.email}</td>
                                                <td>{order.total}</td>
                                                <td>{order.created_at}</td>
                                                <td>
                                                    {
                                                        order.payment_status == 'paid' ?
                                                        <span className='badge bg-success'>Paid</span> :
                                                        <span className='badge bg-danger'>Not Paid</span> 
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        order.status == 'pending' && <span className='badge bg-warning'>Pending</span>
                                                    }
                                                    {
                                                        order.status == 'shipped' && <span className='badge bg-secondary'>Shipped</span>
                                                    }
                                                    {
                                                        order.status == 'delivered' && <span className='badge bg-success'>Delivered</span>
                                                    }
                                                    {
                                                        order.status == 'cancelled' && <span className='badge bg-danger'>Cancelled</span>
                                                    }
                                                </td>
                                            </tr> 
                                        )
                                    })
                                }
                            
                            </tbody>
                        </table>
                    </div>
                }
                    
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShowOrders