import { createContext, useEffect, useState } from "react";
import { apiUrl } from "../common/http";

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const [shippingCost, setShippingCost] = useState(0);

    const addToCart = (product, size = null) => {
        let updateCart = [...cartData];

        // If cart is empty
        if (cartData.length == 0) {
            updateCart.push({
                id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                product_id: product.id,
                size: size,
                title: product.title,
                price: product.price,
                quantity: 1,
                image_url: product.image_url
            })
        } else {
            // If size is not empty
            if (size != null) {
                const isProductExist = updateCart.find(item => 
                    item.product_id == product.id && item.size == size
                )

                // If product and size combination exist then increase quantity
                if (isProductExist) {
                    updateCart = updateCart.map(item =>
                        (item.product_id == product.id && item.size == size)
                        ? { ...item, quantity: item.quantity+1}
                        : item
                    )
                } else {
                    // If product and size combination does not exist then add new item
                    updateCart.push({
                    id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                    product_id: product.id,
                    size: size,
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image_url
                })
                }
            } else {
                // When size is null
                const isProductExist = updateCart.find(item => 
                    item.product_id == product.id && item.size == size
                )

                if (isProductExist) {
                    // When product found in cart then increase quantity
                    updateCart = updateCart.map(item =>
                        (item.product_id == product.id)
                        ? { ...item, quantity: item.quantity+1}
                        : item
                    )
                } else {
                    // If product does not exist then add new item
                    updateCart.push({
                    id: `${product.id}-${Math.floor(Math.random() * 10000000)}`,
                    product_id: product.id,
                    size: size,
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image_url
                })
                }
            }
        }

        setCartData(updateCart)
        localStorage.setItem('cart', JSON.stringify(updateCart))
    }

    const shipping = () => {
            let shippingAmount = 0;
            cartData.map(item => {
                shippingAmount += item.quantity * shippingCost;
            })

            return shippingAmount;
        }

    const subTotal = () => {
        let subtotal = 0;
        cartData.map(item => {
            subtotal += item.quantity * item.price;
        })

        return subtotal;
    }

    const total = () => {
        return subTotal() + shipping();
    }

    const updateCartItem = (itemId, newQty) => {
        let updateCart = [...cartData];
        updateCart = updateCart.map(item =>
        (item.id == itemId) ? {...item, quantity: newQty} : item
        )
        setCartData(updateCart)
        localStorage.setItem('cart', JSON.stringify(updateCart))
    }

    const deleteCartItem = (itemId) => {
        const newCartData = cartData.filter(item => item.id != itemId)
        setCartData(newCartData)
        localStorage.setItem('cart', JSON.stringify(newCartData))
    }

    const getQty = () => {
        let qty = 0;
        cartData.map(item => {
            qty += parseInt(item.quantity)
        });
        
        return qty;
    }

    useEffect(() => {
            fetch(`${apiUrl}/get-shipping-front`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
            .then(result => {
                if (result.status == 200){
                    setShippingCost(result.data.shipping_charge);
                } else {
                    setShippingCost(0);
                    console.log("Something went wrong...")
                }
            })
    })

    return (
        <CartContext.Provider value={{ addToCart, cartData, total, subTotal, shipping, updateCartItem, deleteCartItem, getQty }}>
            {children}
        </CartContext.Provider>
    )
}