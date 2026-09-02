import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCart as getCartApi, addToCart as addToCartApi,
         removeCartItem, updateCartItem } from '../api/cart'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart]         = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading]   = useState(false)

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const res = await getCartApi()
      setCart(res.data)
      setCartCount(res.data.itemCount || 0)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) fetchCart()
    else {
      setCart(null)
      setCartCount(0)
    }
  }, [isAuthenticated, fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    await addToCartApi({ productId, quantity })
    await fetchCart()
  }

  const removeFromCart = async (cartItemId) => {
    await removeCartItem(cartItemId)
    await fetchCart()
  }

  const updateQuantity = async (cartItemId, quantity) => {
    await updateCartItem(cartItemId, { quantity })
    await fetchCart()
  }

  const clearCartLocal = () => {
    setCart(null)
    setCartCount(0)
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, fetchCart, addToCart, removeFromCart, updateQuantity, clearCartLocal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
