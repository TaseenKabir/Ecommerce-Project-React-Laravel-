import React, { useEffect, useMemo, useRef, useState } from 'react'
import Layout from "../../common/Layout";
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import { adminToken, apiUrl } from '../../common/http';
import Swal from 'sweetalert2';

const Edit = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [disable, setDisable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [sizesChecked, setSizesChecked] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const params = useParams(); 
  const navigate = useNavigate();

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "",
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`${apiUrl}/products/${params.id}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${adminToken()}`,
        },
      })
        .then(res => res.json())
        .then(result => {
          setProductImages(result.data.product_images);
          setSizesChecked(result.productSizes);
          reset({
            title: result.data.title,
            category_id: result.data.category_id,
            status: result.data.status,
            is_featured: result.data.is_featured,
            short_description: result.data.short_description,
            description: result.data.description,
            price: result.data.price,
            compare_price: result.data.compare_price,
            sku: result.data.sku,
            quantity: result.data.quantity,
          })
          //console.log(result);
          //setCategories(result.data);
        });
    }
  });

  // Update the product
  const saveProduct = async (data) => {
    const formData = {...data, "description" : content}
    setDisable(true);
    const res = await fetch(`${apiUrl}/products/${params.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json",
        'Authorization': `Bearer ${adminToken()}`,
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(result => {
        setDisable(false);
        if (result.status == 200) {
          toast.success(result.message);
          navigate("/admin/products");
        } else {
          const formErrors = result.errors;
          Object.keys(formErrors).forEach((field) => {
            setError(field, { message: formErrors[field][0]})
          })
          // console.log("Something went wrong...");
        }
      });
  };

  const fetchCategories = async () => {
      const res = await fetch(`${apiUrl}/categories`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${adminToken()}`,
        },
      })
        .then(res => res.json())
        .then(result => {
          console.log(result);
          setCategories(result.data);
        });
    }

  const fetchSizes = async () => {
      const res = await fetch(`${apiUrl}/sizes`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${adminToken()}`,
        },
      })
        .then(res => res.json())
        .then(result => {
          console.log(result);
          setSizes(result.data);
        });
    }

    // Change product default image
    const changeImage = async (image) => {
      const res = await fetch(`${apiUrl}/change-product-default-image?product_id=${params.id}&image=${image}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${adminToken()}`,
        },
      })
        .then(res => res.json())
        .then(result => {
          
          if (result.status == 200) {
            toast.success(result.message);
          } else {
            console.log("Something went wrong...");
          }

        });
    }

// Upload Images
const handleFile = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);
    formData.append("product_id", params.id);
    setDisable(true);

    const res = await fetch(`${apiUrl}/save-product-image`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${adminToken()}`,
      },
      body: formData
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          productImages.push(result.data)
          setProductImages(productImages)
        } else {
          // Add checks for result.errors and result.errors.image
          const errorMessage = result.errors?.image?.[0] || result.message || "An unknown error occurred.";
          toast.error(errorMessage);
        }
        setDisable(false);
        e.target.value = ""
      });
  }

  // Delete Images
  const confirmDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Delete Image?',
    text: "This image will be permanently removed",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc3545',
  });

  if (result.isConfirmed) {
    deleteImage(id); // Call your existing delete function
  }
};

  const deleteImage = async (id) => {
      const res = await fetch(`${apiUrl}/delete-product-image/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${adminToken()}`,
        },
      })
        .then(res => res.json())
        .then(result => {
          if (result.status == 200 ) {
            const newProductImages = productImages.filter(productimage => productimage.id != id);
            setProductImages(newProductImages);
            toast.success(result.message)
          } else {
            toast.error(result.message)
          }
        });
    }

  useEffect(() => {
    fetchCategories();
    fetchSizes();

  },[])

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="d-flex justify-content-between mt-5 pb-3">
            <h4>Product / Edit</h4>
            <Link to="/admin/products" className="btn btn-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left-short"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
                />
              </svg>
              Back to Products
            </Link>
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <form onSubmit={handleSubmit(saveProduct)}>
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Product Title
                    </label>
                    <input
                      {...register("title", {
                        required: "Product title is required.",
                      })}
                      type="text"
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      placeholder="Enter Product Title"
                    />
                    {errors.title && (
                      <p className="invalid-feedback">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Category
                        </label>
                        <select
                          {
                            ...register("category_id", {
                            required: "Category is required.",
                          })
                        }
                          className={`form-control ${errors.category_id && "is-invalid"}`}>
                          <option value="">Select a Category</option>
                          {categories &&
                            categories.map((category) => {
                              return (
                                <option
                                  key={`category-${category.id}`}
                                  value={category.id}
                                >
                                  {category.category_name}
                                </option>
                              );
                            })}
                        </select>
                        {errors.category_id && (
                          <p className="invalid-feedback">
                            {errors.category_id?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="">Status</label>
                        <select
                          {
                              ...register("status", {
                              required: "Please select a status.",
                            })
                          }
                          className={`form-control ${
                            errors.status && "is-invalid"
                          }`}
                        >
                          <option value="">Select a Status</option>
                          <option value="1">Active</option>
                          <option value="0">Block</option>
                        </select>
                        {
                            errors.status && (
                            <p className="invalid-feedback">
                              {errors.status?.message}
                            </p>
                          )
                        }
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                        <label htmlFor="">Featured</label>
                        <select
                          {
                              ...register('is_featured', {
                              required: 'The field is required',
                            })
                          }
                          className={`form-control ${
                            errors.is_featured && "is-invalid"
                          }`}
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                        {
                            errors.is_featured && (
                            <p className="invalid-feedback">
                              {errors.is_featured?.message}
                            </p>
                          )
                        }
                      </div>

                  <div className="mb-3">
                    <label htmlFor="" className="form-lable">
                      Short Description
                    </label>

                    <textarea
                    {
                      ...register('short_description')
                    }
                      className="form-control"
                      placeholder="Short Description"
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Description
                    </label>
                    <JoditEditor
                      ref={editor}
                      value={content}
                      config={config}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                  </div>

                  <h3 className="py-3 border-bottom mb-3">Pricing</h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Price
                        </label>
                        <input
                        {
                            ...register("price", {
                            required: "Price is requried.",
                          })
                        }
                        className={`form-control ${errors.price && "is-invalid"}`}
                        type="number" placeholder="Price"/>
                        {
                            errors.price && (
                            <p className="invalid-feedback">{errors.price?.message}</p>
                          )
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Sale Price
                        </label>
                        <input
                        {
                          ...register('compare_price')
                        }
                          type="number"
                          className="form-control"
                          placeholder="Sale Price"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="py-3 border-bottom mb-3">Inventory</h3>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          SKU
                        </label>
                        <input
                        {
                            ...register("sku", {
                            required: "SKU is requried.",
                          })
                        }
                        className={`form-control ${errors.sku && "is-invalid"}`}
                        type="text"
                        placeholder="SKU"
                        />
                        {
                            errors.sku && (
                            <p className="invalid-feedback">
                              {errors.sku?.message}
                            </p>
                          )
                        }
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Qty
                        </label>
                        <input
                        {
                          ...register('quantity')
                        }
                          type="number"
                          className="form-control"
                          placeholder="Quantity"
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="py-3 border-bottom mb-3">Sizes</h3>

                  <div className='mb-3'>
                    {
                      sizes && sizes.map(size => {
                        return (
                           <div className="form-check-inline ps-3" key={`psize-${size.id}`}>
                            <input 
                            {
                              ...register("sizes")
                            }
                            checked={sizesChecked.includes(size.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSizesChecked([...sizesChecked,size.id])
                              } else {
                                setSizesChecked(sizesChecked.filter(sid => size.id != sid ))
                              }
                            }}
                            className="form-check-input" type="checkbox" value={size.id} id={`size-${size.id}`} />
                            <label className="form-check-label ps-2" htmlFor="{`size-${size.id}`}">
                              {size.name}
                            </label>
                          </div>
                          )
                      })
                    }
                     
                  </div>

                  <h3 className="py-3 border-bottom mb-3">Gallery</h3>

                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">
                      Image
                    </label>
                    <input 
                    onChange={handleFile}
                    type="file" id="formFile" className="form-control" />
                  </div>

                  <div className="mb-3">
                    <div className="row">
                        {
                          productImages && productImages.map((productImage, index) => {
                            return (
                              <div className="col-md-3" key={`image-${index}`}>
                                <div className="card shadow">
                                  <img src={productImage.image_url} alt="" className="w-100" />
                                  <button type='button' className="btn btn-danger mt-2 w-100" onClick={() => confirmDelete(productImage.id)}>Delete</button>
                                  <button type='button' className="btn btn-secondary mt-2 w-100" onClick={() => changeImage(productImage.image)}>Set as Default</button>
                                </div>
                              </div>
                            )
                          })
                        }
                    </div>
                  </div>

                </div>
              </div>
              <button
                disabled={disable}
                type="submit"
                className="btn btn-primary mt-3 mb-3"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Edit