import React, { useState } from 'react'
import Layout from './common/Layout'
import { Link } from 'react-router-dom'
import Sidebar from './common/Sidebar'
import UserSidebar from './UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, userToken } from './common/http'
import { toast } from 'react-toastify'
import Loader from './common/Loader'

const Profile = () => {

  const [loader, setLoader] = useState(true);

  const {
      register,
      handleSubmit,
      watch,
      reset,
      setError,
      formState: { errors },
    } = useForm({
      defaultValues: async () => {
        await fetch(`${apiUrl}/get-account-details`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken()}`
          }
        })
        .then(res => res.json())
        .then(result => {
          setLoader(false)
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

    const updateAccount = async (data) => {
      fetch(`${apiUrl}/update-profile`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken()}`
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
          if (result.status == 200) {
            toast.success(result.message)
          } else {
            const formErrors = result.errors;
            Object.keys(formErrors).forEach((field) => {
              setError(field, { message: formErrors[field][0]})
            })
          }
        });
    }

  return (
    <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4>Profile</h4>
            {/* <Link to="" className='btn btn-primary'>Create</Link> */}
          </div>

          <div className="col-md-3">
            <UserSidebar />
          </div>
          <div className="col-md-9">
              {
                  loader == true && <Loader />
              }
              {
                loader == false &&
              
                <form onSubmit={handleSubmit(updateAccount)}>
                  <div className='card shadow'>
                    <div className='card-body p-4'>
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
                    
                  </div>
                  <button className='btn btn-primary mt-4 mb-4'>Update</button>
                </form>
              }
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile