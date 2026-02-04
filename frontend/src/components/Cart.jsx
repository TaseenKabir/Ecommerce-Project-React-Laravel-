import React, { useContext, useState } from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router'
import ProductImg from '../assets/images/8.jpg'
import { CartContext } from './context/Cart'

const Cart = () => {
    const { cartData, total, subTotal, shipping, updateCartItem, deleteCartItem } = useContext(CartContext);
    const [qty, setQty] = useState({})

    const handleQty = (e, itemId) => {
        const neqQty = e.target.value;
        setQty(prev => ({...prev, [itemId]: neqQty}))
        updateCartItem(itemId, neqQty)
    }
    return (
        <Layout>
            <div className='container pb-5'>
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active"
                                    aria-current="page">Cart</li>
                            </ol>
                        </nav>
                    </div>
                    <div className='col-md-12'>
                        <h3 className='border-bottom pb-3'>Cart</h3>

                        <table className='table'>
                            <tbody>
                                {
                                    cartData.length == 0 &&
                                    <tr>
                                        <td align='center' colSpan={4} valign='middle' style={{height: 200}}>Your cart is empty.</td>
                                    </tr>
                                }
                                {
                                    cartData && cartData.map(item => {
                                        return (
                                            <tr key={`${item.id}`}>
                                                <td>
                                                    <img src={item.image_url} alt="" width={80} />
                                                </td>
                                                <td width={600}>
                                                    <h4>{item.title}</h4>
                                                    <div className='d-flex align-items-center'>
                                                        <span>{item.price} ৳</span>
                                                        <div className='ps-3'>
                                                            {
                                                                item.size && <button className='btn btn-size'>{item.size}</button>
                                                            }
                                                            
                                                        </div>
                                                    </div>
                                                </td>
                                                <td valign='middle'>
                                                    <input 
                                                    style={{ width: '100px' }} 
                                                    min={1}
                                                    max={10}
                                                    type="number" 
                                                    value={qty[item.id] || item.quantity} 
                                                    className='form-control'
                                                    onChange={(e) => handleQty(e, item.id)} />
                                                </td>
                                                <td valign='middle'>
                                                    <a href="#" onClick={() => deleteCartItem(item.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                        </svg>
                                                    </a>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            {
                cartData.length > 0 &&
            
                <div className='row justify-content-end me-2'>
                    <div className='col-md-3'>
                        <div className='d-flex justify-content-between border-bottom pb-3'>
                            <div><strong>Subtotal</strong></div>
                            <div>{subTotal()} ৳</div>
                        </div>
                        <div className='d-flex justify-content-between border-bottom py-3'>
                            <div><strong>Shipping</strong></div>
                            <div>{shipping()} ৳</div>
                        </div>
                        <div className='d-flex justify-content-between py-3'>
                            <div><strong>Total</strong></div>
                            <div>{total()} ৳</div>
                        </div>

                        <div className='d-flex justify-content-end py-3'>
                            <Link to={'/checkout'} className='btn btn-primary'>Proceed to Checkout</Link>
                        </div>
                    </div>
                </div>
            }
            </div>
            
        </Layout>
    )
}

export default Cart