import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Sidebar from '../common/Sidebar'
import { data, Link, useParams } from 'react-router-dom'
import { adminToken, apiUrl } from '../common/http'
import Loader from '../common/Loader'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const OrderDetails = () => {

    const [order, setOrder] = useState([]);
    const [items, setItems] = useState([]);
    const [loader, setLoader] = useState(false);
    const params = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const fetchOrderDetails = async () => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/order/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            }
        }).then(res => res.json())
        .then(result => {
            setLoader(false)
            if (result.status == 200){
                setOrder(result.data)
                setItems(result.data.items)
                reset ({
                    status: result.data.status,
                    payment_status: result.data.payment_status,
                });
            } else {
                console.log("Something went wrong...")
            }
        })
    }

    const updateOrder = async (data) => {
        setLoader(true)
        const res = await fetch(`${apiUrl}/update-order/${params.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${adminToken()}`
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(result => {
            setLoader(false)
            if (result.status == 200){
                setOrder(result.data)
                reset ({
                    status: result.data.status,
                    payment_status: result.data.payment_status,
                });
                toast.success(result.message)
            } else {
                console.log("Something went wrong...")
            }
        })
    }
    

    useEffect(() => {
        fetchOrderDetails();
    },[])

  return (
    <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4>Orders / Details</h4>
            <Link to="/admin/orders" className='btn btn-primary'>Back</Link>
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <div className='row'>
                <div className='col-md-9'>
                    <div className='card shadow mb-5'>
                        <div className='card-body p-4'>
                            {
                                loader == true && <Loader />
                            }
                            {
                                loader == false &&
                                <div>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <h4><strong>Order ID: {order.id}</strong></h4>
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
                                        </div>
                                        <div className='col-md-4'>
                                            <h4 className='text-secondary'>
                                                Date
                                            </h4>
                                            <p className='pt-2'>{order.created_at}</p>
                                        </div>
                                        <div className='col-md-4'>
                                            <h4 className='text-secondary'>
                                                Payment Status
                                            </h4>
                                            {
                                                order.payment_status == 'paid' ?
                                                <span className='badge bg-success'>Paid</span> :
                                                <span className='badge bg-danger'>Not Paid</span> 
                                            }
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className='py-5'>
                                                <strong>{order.name}</strong>
                                                <div>{order.email}</div>
                                                <div>{order.mobile}</div>
                                                <div>{order.address}, {order.district}, {order.zip}</div>
                                            </div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className='text-secondary pt-5'>
                                                Payment method
                                            </div>
                                            <p>COD</p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <h3 class="pb-2 "><strong>Items</strong></h3>
                                        {
                                            items.map(item => {
                                                return (
                                                    <div key={`${item.id}`} class="row justify-content-end">
                                                        <div class="col-lg-12">
                                                            <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                                                <div class="d-flex">
                                                                {
                                                                    item.product.image &&
                                                                    <img width="70" class="me-3" src={item.product.image_url} alt="" />
                                                                }
                                                                <div class="d-flex flex-column">
                                                                    <div class="mb-2"><span>{item.name}</span></div>
                                                                    <div><button class="btn btn-size">{item.size}</button></div>
                                                                </div>
                                                                </div>
                                                                <div class="d-flex">
                                                                <div>X {item.qty}</div>
                                                                <div class="ps-3">{item.price} ৳</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                        <div class="row justify-content-end">
                                            <div class="col-lg-12">
                                                <div class="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                    <div>Subtotal</div>
                                                    <div>{order.subtotal} ৳</div>
                                                </div>
                                                <div class="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                    <div>Shipping</div>
                                                    <div>{order.shipping} ৳</div>
                                                </div>
                                                <div class="d-flex  justify-content-between border-bottom pb-2 mb-2">
                                                    <div><strong>Total</strong></div>
                                                    <div>{order.total} ৳</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            

                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='card shadow'>
                        <div className='card-body p-4'>
                            <form onSubmit={handleSubmit(updateOrder)}>
                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="status">Status</label>
                                    <select 
                                    {
                                        ...register('status', {required: true})
                                    }
                                    id="status" 
                                    className="form-select">
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="payment-status">Payment Status</label>
                                    <select 
                                    {
                                        ...register('payment_status', {required: true})
                                    }
                                    id="payment-status" 
                                    className="form-select">
                                        <option value="paid">Paid</option>
                                        <option value="not paid">Not Paid</option>
                                    </select>
                                </div>
                                <button type='submit' className='btn btn-primary'>Update</button>
                            </form>
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

export default OrderDetails