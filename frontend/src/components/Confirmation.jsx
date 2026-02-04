import React, { useEffect, useState } from 'react'
import Layout from './common/Layout'
import { apiUrl, userToken } from './common/http';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './common/Loader';

const Confirmation = () => {

    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const params = useParams();

    const fetchOrder = () => {
        fetch(`${apiUrl}/get-order-details/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
            setLoading(false)
            if (result.status == 200) {
                setOrder(result.data)
                setItems(result.data.items)
            } else {
                toast.error(result.message)
            }
        })
    }

    useEffect(() => {
        fetchOrder();
    },[])

  return (
    <Layout>
        <div className='container py-5'>
            {
                loading === true && <Loader />
            }
            { 
                loading === false && order &&
                <div>
                    <div className='row'>
                        <h1 className='text-center fw-bold text-success'>Thank You!</h1>
                        <p className='text-muted text-center'>Your Order has been successfully placed.</p>
                    </div>
                
                    <div className='card shadow'>
                        <div className='card-body'>
                            <h3 className='fw-bold'>Order Summary</h3>
                            <hr />
                            <div className='row'>
                                <div className='col-6'>
                                    <p><strong>Order ID: </strong># {order.id}</p>
                                    <p><strong>Date: </strong>{order.created_at}</p>
                                    <p><strong>Status </strong>
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
                                    </p>
                                    <p><strong>Payment Method: </strong>COD</p>
                                </div>
                                <div className='col-6'>
                                    <p><strong>Customer: </strong>{order.name}</p>
                                    <p><strong>Address: </strong>{order.address}, 
                                        {order.city}, {order.district}, {order.zip}</p>
                                    <p><strong>Contact: </strong>{order.mobile}</p>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <table className="table-striped table-bordered table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items.map((item) => (
                                                         <tr key={item.id}>
                                                            <td>{item.name}</td>
                                                            <td>{item.qty}</td>
                                                            <td>{item.unit_price}</td>
                                                            <td>{item.price}</td>
                                                        </tr>
                                                    ))
                                                }
                                               
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td className='text-end fw-bold' colSpan={3}>Subtotal</td>
                                                    <td>{order.subtotal} ৳</td>
                                                </tr>
                                                <tr>
                                                    <td className='text-end fw-bold' colSpan={3}>Shipping</td>
                                                    <td>{order.shipping} ৳</td>
                                                </tr>
                                                <tr>
                                                    <td className='text-end fw-bold' colSpan={3}>Total</td>
                                                    <td>{order.total} ৳</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className='text-center'>
                                        <button className='btn btn-primary'>View Order Details</button>
                                        <Link to={'/shop'} className='btn btn-outline-secondary ms-2'>Continue Shopping</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }   
            {
                loading == false && !order&&
                <div className='row'>
                    <h1 className='text-center fw-bold text-muted'>Order not found.</h1>
                    <div className='text-center'>
                        <Link to={'/shop'} className='btn btn-outline-secondary mt-4'>Go to Shop</Link>
                    </div>
                </div>
            }    
        </div>
    </Layout>
  )
}

export default Confirmation