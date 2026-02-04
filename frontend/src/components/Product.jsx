import React, { useContext, useEffect, useState } from 'react'
import Layout from './common/Layout'
import { Link, useNavigate, useParams } from 'react-router'
import { Rating } from 'react-simple-star-rating'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs, FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { apiUrl } from './common/http';
import { CartContext } from './context/Cart';
import { toast } from 'react-toastify';
import { WishlistContext } from './context/Wishlist';

const Product = () => {

    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [rating, setRating] = useState(4.5);
    const [product, setProduct] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [productSizes, setProductSizes] = useState([]);
    const [sizeSelected, setSizeSelected] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext)
    const {
        addToWishlist,
        removeFromWishlist,
        isInWishlist
    } = useContext(WishlistContext);

    const inWishlist = isInWishlist(product.id);

    const handleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const fetchProduct = () => {
        fetch(`${apiUrl}/get-product/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                setProduct(result.data)
                setProductImages(result.data.product_images)
                setProductSizes(result.data.product_sizes)
            } else {
                console.log("Something went wrong...")
            }
        })
    }

    const handleAddToCart = () => {
        if (productSizes.length > 0) {
            if (sizeSelected == null) {
                toast.error("Please select a size.")
            } else {
                addToCart(product, sizeSelected)
                toast.success("Product successfully added to cart!")
            }
        } else {
            addToCart(product, null)
            toast.success("Product successfully added to cart!")
        }
        
    }

    const handleBuyNow = () => {
        if (productSizes.length > 0) {
            if (sizeSelected == null) {
                toast.error("Please select a size.")
            } else {
                addToCart(product, sizeSelected)
                navigate('/checkout')
            }
        } else {
            addToCart(product, null)
            navigate('/checkout')
        }
    }

    useEffect(() => {
        fetchProduct();
    },[]);
    
    return (
        <Layout>
            <div className='container product-detail'>
                
                <div className='row'>
                    <div className='col-md-12'>
                        <nav aria-label="breadcrumb" className='py-4'>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item"
                                    aria-current="page"><Link to="/shop">Shop</Link></li>
                                <li className="breadcrumb-item active"
                                    aria-current="page">{product.title}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className='row mb-5'>
                    <div className='col-md-5'>
                        <div className='row'>
                            <div className='col-2'>
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    onSwiper={setThumbsSwiper}
                                    loop={true}
                                    direction={`vertical`}
                                    spaceBetween={10}
                                    slidesPerView={6}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper mt-2"
                                >
                                    {
                                        productImages && productImages.map(item => {
                                            return (
                                                <SwiperSlide key={`image-sm-${item.id}`}>
                                                    <div className='content'>
                                                        <img
                                                            src={item.image_url}
                                                            alt=""
                                                            height={100}
                                                            className='w-100' />
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                    
                                </Swiper>
                            </div>
                            <div className='col-10'>
                                <Swiper
                                    style={{
                                        '--swiper-navigation-color': '#000',
                                        '--swiper-pagination-color': '#000',
                                    }}
                                    loop={true}
                                    spaceBetween={0}
                                    navigation={true}
                                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="mySwiper2"
                                >
                                    {
                                        productImages && productImages.map(item => {
                                            return (
                                                <SwiperSlide key={`image-${item.id}`}>
                                                    <div className='content'>
                                                        <img
                                                            src={item.image_url}
                                                            alt=""
                                                            className='w-100' />
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        })
                                    }
                                    
                                </Swiper>


                            </div>
                        </div>
                    </div>
                    <div className='col-md-7'>
                        
                        <h2>{product.title}</h2>
                        <div className='d-flex'>
                            <Rating
                                size={20}
                                readonly
                                initialValue={rating}
                            /* Available Props */
                            />
                            <span className='pt-1 ps-2'>10 reviews</span>
                        </div>
                        <div className='price h3 py-3'>
                            {product.price} ৳ 
                            {product.compare_price && (
                                <span className='text-decoration-line-through ms-2'>{product.compare_price} ৳</span>
                            )}
                        </div>
                        <div>
                            {product.short_description}
                        </div>
                        <div className='pt-3'>
                            <strong>Select Size</strong>
                            <div className='sizes pt-2'>
                                {
                                    productSizes && productSizes.map(item => {
                                        return (
                                            <button 
                                            key={`psize-${item.id}`}
                                            onClick={() => {
                                                setSizeSelected(item.size.name)
                                            }}
                                            className={`btn btn-size ms-1 me-2 ${sizeSelected === item.size.name ? 'active' : ''}`}>
                                                {item.size.name}
                                            </button>
                                        )
                                    })
                                }
                                
                            </div>
                        </div>
                        <div className='add-to-cart my-4'>
                            <button 
                            onClick={() => handleAddToCart()}
                            className='btn btn-primary text-uppercase me-2'>
                                Add To Cart
                            </button>
                            <button 
                            onClick={() => handleBuyNow()}
                            className='btn btn-primary text-uppercase'>Buy Now</button>
                        </div>
                        <button onClick={handleWishlist} className='btn btn-primary text-uppercase'>
                            {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        </button>

                        <hr />

                        <div>
                            <strong>SKU: </strong>
                            {product.sku}
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <Tabs
                            defaultActiveKey="description"
                            id="uncontrolled-tab-example"
                            className="mb-3"
                        >
                            <Tab eventKey="description" title="Description">
                                <div dangerouslySetInnerHTML={{__html:product.description}}>

                                </div>
                            </Tab>
                            <Tab eventKey="reviews" title="Reviews(10)">
                                Reviews
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product