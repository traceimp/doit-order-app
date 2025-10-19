import React, { useState, useCallback, useEffect } from 'react'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'
import { api } from '../utils/api'
import './OrderPage.css'

function OrderPage({ onOrderComplete }) {
    const [cartItems, setCartItems] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // API에서 메뉴 데이터 가져오기
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true)
                const response = await api.getMenus()
                setMenuItems(response.data)
            } catch (err) {
                setError(err.message)
                console.error('메뉴 로딩 오류:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchMenus()
    }, [])

    const addToCart = useCallback((menuItem, options) => {
        const cartItem = {
            id: `${menuItem.id}-${JSON.stringify(options)}`,
            menuId: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            options: options,
            quantity: 1
        }

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === cartItem.id)
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === cartItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            } else {
                return [...prevItems, cartItem]
            }
        })
    }, [])

    const updateCartItemQuantity = (itemId, change) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change
                    return newQuantity <= 0 ? null : { ...item, quantity: newQuantity }
                }
                return item
            }).filter(Boolean)
        )
    }

    const removeFromCart = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
    }

    const getItemDisplayName = (item) => {
        let name = item.name
        const options = []
        if (item.options.extraShot) options.push('샷 추가')
        if (item.options.syrup) options.push('시럽 추가')

        if (options.length > 0) {
            name += ` (${options.join(', ')})`
        }
        return name
    }

    const getItemPrice = (item) => {
        return item.price + (item.options.extraShot ? 500 : 0)
    }

    const handleOrder = async () => {
        if (cartItems.length === 0) {
            alert('장바구니가 비어있습니다.')
            return
        }

        const totalAmount = cartItems.reduce((total, item) => {
            const itemPrice = item.price + (item.options.extraShot ? 500 : 0)
            return total + (itemPrice * item.quantity)
        }, 0)

        const confirmMessage = `총 ${totalAmount.toLocaleString()}원을 결제하시겠습니까?`
        if (window.confirm(confirmMessage)) {
            try {
                const orderData = {
                    items: cartItems.map(item => ({
                        menu_id: item.menuId,
                        quantity: item.quantity,
                        options: item.options,
                        price: getItemPrice(item)
                    })),
                    total_amount: totalAmount
                }

                const response = await api.createOrder(orderData)

                const orderResult = {
                    id: response.data.id,
                    items: cartItems.map(item => ({
                        name: getItemDisplayName(item),
                        quantity: item.quantity,
                        price: getItemPrice(item)
                    })),
                    total: totalAmount,
                    timestamp: response.data.created_at
                }

                if (onOrderComplete) {
                    onOrderComplete(orderResult)
                }

                setCartItems([])
                alert('주문이 완료되었습니다!')
            } catch (err) {
                console.error('주문 오류:', err)
                alert('주문 처리 중 오류가 발생했습니다.')
            }
        }
    }

    if (loading) {
        return (
            <div className="order-page">
                <div className="loading">메뉴를 불러오는 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="order-page">
                <div className="error">오류: {error}</div>
            </div>
        )
    }

    return (
        <div className="order-page">
            <div className="menu-section">
                <h2 className="section-title">메뉴</h2>
                <div className="menu-grid">
                    {menuItems.map(item => (
                        <MenuCard
                            key={item.id}
                            menuItem={item}
                            onAddToCart={addToCart}
                        />
                    ))}
                </div>
            </div>

            <Cart
                items={cartItems}
                onUpdateQuantity={updateCartItemQuantity}
                onRemoveItem={removeFromCart}
                onOrder={handleOrder}
            />
        </div>
    )
}

export default OrderPage
