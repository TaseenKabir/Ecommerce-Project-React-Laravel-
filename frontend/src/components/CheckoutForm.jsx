import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { CartContext } from './context/Cart';
import { apiUrl, userToken } from './common/http';
import { toast } from 'react-toastify';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

const CheckoutForm = () => {

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState("");

    const {cartData, total, subTotal, shipping} = useContext(CartContext);
    const navigate = useNavigate();

    const handlePyamentMethod = (e) => {
        setPaymentMethod(e.target.value)
    }

    const processOrder = async (data) => {
        if (paymentMethod == 'cod') {
            saveOrder(data, 'not paid')
        } else {
            // Fetch the client secret from the server
            const response = await fetch(`${apiUrl}/create-payment-intent`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${userToken()}`
                },
                body: JSON.stringify({ amount: total()*100 }), 
            });

            const result = await response.json();

            if (!result.clientSecret) {
                setPaymentStatus("Unable to process payment. Please try again.");
                setLoading(false);
                return;
            }

            // Ensure Stripe and Elements are loaded
            if (!stripe || !elements) {
                setPaymentStatus("Stripe is not ready. Please try again later.");
                setLoading(false);
                return;
            }

            const clientSecret = result.clientSecret;
            const cardElement = elements.getElement(CardElement);

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: data.name,
                        email: data.email,
                        address: {
                            line1: data.address,
                            city: data.city,
                            district: data.district,
                            postal_code: data.zip,
                        },
                    },
                },
            });

            if (paymentResult.error) {
                setPaymentStatus(`Payment failed: ${paymentResult.error.message}`);
            } else if (paymentResult.paymentIntent.status === "succeeded") {
                saveOrder(data,'paid');
                setPaymentStatus("Payment successful!");
            }

        }
    }

    const saveOrder = (formData, paymentStatus) => {
        const newFormData = {
            ...formData,
            total: total(),
            subtotal: subTotal(),
            shipping: shipping(),
            discount: 0,
            payment_status: paymentStatus,
            status: 'pending',
            cart: cartData
        }
        fetch(`${apiUrl}/save-order`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${userToken()}`
            },
            body: JSON.stringify(newFormData)
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                localStorage.removeItem('cart');
                navigate(`/order/confirmation/${result.id}`);
            } else {
                toast.error(result.message)
            }
        })
    }

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors },
      } = useForm({
            defaultValues: async () => {
              fetch(`${apiUrl}/get-account-details`, {
                method: 'GET',
                headers: {
                  'Content-type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${userToken()}`
                }
              })
              .then(res => res.json())
              .then(result => {
                reset ({
                  name: result.data.name,
                  email: result.data.email,
                  address: result.data.address,
                  city: result.data.city,
                  district: result.data.district,
                  zip: result.data.zip,
                  mobile: result.data.mobile
                })
              })
            }
          });

  return (
    <div className='container'>
        <div className='row'>
            <div className='col-md-12'>
                <nav aria-label="breadcrumb" className='py-4'>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li class="breadcrumb-item active"
                            aria-current="page">Checkout</li>
                    </ol>
                </nav>
            </div>
        </div>
        <form onSubmit={handleSubmit(processOrder)}>
            <div className='row pt-3'>
                
                    <div className='col-md-7'>
                        <h3 className='border-bottom pb-3'>Billing Details</h3>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('name', {
                                                required : "The name field is required."
                                            })
                                        }
                                        type="text" 
                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                        placeholder='Name' />
                                        {
                                            errors.name && <p className='invalid-feedback'>{errors.name?.message}</p>
                                        }
                                    </div>

                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('email', {
                                                required : "The email field is required.",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                } 
                                            })
                                        }
                                        type="text" 
                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                        placeholder='Email' />
                                        {
                                            errors.email && <p className='invalid-feedback'>{errors.email?.message}</p>
                                        }
                                    </div>

                                </div>
                                <div className='mb-3'>
                                    <textarea 
                                        {
                                            ...register('address', {
                                                required : "The address field is required."
                                            })
                                        }
                                        className={`form-control ${errors.address && 'is-invalid'}`}
                                        rows={3} 
                                        placeholder='Address' >                            
                                    </textarea>
                                    {
                                        errors.address && <p className='invalid-feedback'>{errors.address?.message}</p>
                                    }
                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('city', {
                                                required : "The city field is required."
                                            })
                                        }
                                        type="text" 
                                        className={`form-control ${errors.city && 'is-invalid'}`}
                                        placeholder='City' />
                                        {
                                            errors.city && <p className='invalid-feedback'>{errors.city?.message}</p>
                                        }
                                    </div>

                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('district', {
                                                required : "The district field is required."
                                            })
                                        }
                                        type="text" 
                                        className={`form-control ${errors.district && 'is-invalid'}`}
                                        placeholder='District' />
                                        {
                                            errors.district && <p className='invalid-feedback'>{errors.district?.message}</p>
                                        }
                                    </div>

                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('zip', {
                                                required : "The zip field is required."
                                            })
                                        }
                                        type="text" 
                                        className={`form-control ${errors.zip && 'is-invalid'}`}
                                        placeholder='Zip' />
                                        {
                                            errors.zip && <p className='invalid-feedback'>{errors.zip?.message}</p>
                                        }
                                    </div>

                                </div>
                                <div className='col-md-6'>
                                    <div className='mb-3'>
                                        <input 
                                        {
                                            ...register('mobile', {
                                                required : "The mobile field is required."
                                            })
                                        }
                                        type="text" 
                                        className={`form-control ${errors.mobile && 'is-invalid'}`}
                                        placeholder='Mobile' />
                                        {
                                            errors.mobile && <p className='invalid-feedback'>{errors.mobile?.message}</p>
                                        }
                                    </div>

                                </div>
                            </div>
                        
                    </div>
                    <div className='col-md-5'>
                        <h3 className='border-bottom pb-3'>Items</h3>
                        <table className='table'>
                            <tbody>
                                {
                                    cartData && cartData.map(item => {
                                        return (
                                            <tr key={`cart-${item.id}`}>
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
                                                        <div className='ps-3'>x {item.quantity}</div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                                
                            </tbody>
                        </table>
                        
                        <div className='row pb-3'>
                            <div className='col-md-12'>
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
                            </div>
                        </div>

                        <h3 className='border-bottom pb-3 pt-4'><strong>Payment Method</strong></h3>
                        <div>
                            <input type="radio"
                            onChange={handlePyamentMethod}
                            checked={paymentMethod == 'stripe'} value={'stripe'} />
                            <label htmlFor="" className='form-label ps-2'>Stripe</label>
        
                            <input type="radio"
                            onChange={handlePyamentMethod}
                            checked={paymentMethod == 'cod'} value={'cod'} className='ms-3' />
                            <label htmlFor="" className='form-label ps-2'>COD</label>
                        </div>
                        {
                            paymentMethod == "stripe" && <div className='border p-3'>
                                                            <CardElement />
                                                        </div>
                        }
                        <div className='d-flex py-3'>
                            <button className='btn btn-primary'>Place Order</button>
                        </div>
                    </div>
                
            </div>
        </form>
    </div>
  )
}

export default CheckoutForm