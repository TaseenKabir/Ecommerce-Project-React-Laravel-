import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "./context/Wishlist";
import Layout from "./common/Layout";

const Wishlist = () => {
    const { wishlistData, removeFromWishlist } = useContext(WishlistContext);

    // if (wishlistData.length === 0) {
    //     return <p>Your wishlist is empty.</p>;
    // }

    return (
        <Layout>
            <div className="container">
                <div className="d-flex justify-content-between mt-5 pb-3">
                    <h3>Wishlist</h3>
                    <Link to="/shop" className='btn btn-primary'>Shop</Link>
                </div>

            <div className="row">
                <table className="table">
                    <tbody>
                {
                    wishlistData.length == 0 &&
                    <tr>
                        <td align='center' colSpan={4} valign='middle' style={{height: 200}}>Your wishlist is empty.</td>
                    </tr>
                }
                    </tbody>
                </table>
                {
                    wishlistData.map(item => (
                        <div className="col-md-3" key={item.product_id}>
                            <div className="card">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="card-img-top"
                                />

                                <div className="card-body text-center">
                                    <h6>{item.title}</h6>

                                    <Link
                                        to={`/product/${item.product_id}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        View
                                    </Link>

                                    <button
                                        onClick={() => removeFromWishlist(item.product_id)}
                                        className="btn btn-sm btn-danger ms-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </Layout>
    );
};

export default Wishlist;
