import React, { useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'

const Edit = () => {

  const [disable, setDisable] = useState(false);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors },
    } = useForm({
      defaultValues: async () => {
          const res = await fetch(`${apiUrl}/categories/${params.id}`, {
            method: "GET",
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${adminToken()}`,
            },
          })
            .then(res => res.json())
            .then(result => {
              console.log(result);
              if (result.status == 200) {
                setCategory(result.data);
                reset ({
                  category_name: result.data.category_name
              });
              } else {
                console.log("Something went wrong...")
              }
            });
        }
    });

    const updateCategory = async (data) => {
      const res = await fetch(`${apiUrl}/categories/${params.id}`, {
            method: "PUT",
            headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${adminToken()}`,
            },
            body: JSON.stringify(data)
          })
            .then(res => res.json())
            .then(result => {
              console.log(result);
              if (result.status == 200) {
                toast.success(result.message);
                navigate('/admin/categories')
              } else {
                console.log("Something went wrong...")
              }
            });
    }

    
  return (
    <Layout>
        <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4>Category / Edit</h4>
            <Link to="/admin/categories" className='btn btn-primary'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
            </svg>Back to Categories</Link>
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(updateCategory)}>
            <div className='card shadow'>
                <div className='card-body p-4'>
                    <div className='mb-3'>
                        <label htmlFor="" className='form-label'>Category Name</label>
                        <input 
                        {
                            ...register('category_name',{
                                required : 'Category name is required.'
                            })
                        }
                        type="text" 
                        className={`form-control ${errors.category_name ? 'is-invalid' : ''}`}
                        placeholder='Enter Category Name'/>
                        {
                            errors.category_name && <p className='invalid-feedback'>{errors.category_name?.message}</p>
                        }
                    </div>
                </div>
            </div>
            <button disabled={disable} type="submit" className='btn btn-primary mt-3'>Update</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit