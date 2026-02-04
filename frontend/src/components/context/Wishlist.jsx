import { createContext, useState } from "react";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistData, setWishlistData] = useState(
        JSON.parse(localStorage.getItem("wishlist")) || []
    );

    const addToWishlist = (product) => {
        let updatedWishlist = [...wishlistData];

        // Check if product already exists
        const isProductExist = updatedWishlist.find(
            item => item.product_id === product.id
        );

        if (!isProductExist) {
            updatedWishlist.push({
                id: product.id,               
                product_id: product.id,
                title: product.title,
                image_url: product.image_url
            });

            setWishlistData(updatedWishlist);
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        }
    };

    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlistData.filter(
            item => item.product_id !== productId
        );

        setWishlistData(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const isInWishlist = (productId) => {
        return wishlistData.some(item => item.product_id === productId);
    };

    const getWishlistCount = () => {
        return wishlistData.length;
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistData,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                getWishlistCount
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
