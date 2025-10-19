import React, { useState, useCallback } from 'react'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'
import './OrderPage.css'

function OrderPage({ onOrderComplete }) {
    const [cartItems, setCartItems] = useState([])

    // 메뉴 데이터 (나중에 API에서 가져올 예정)
    const menuItems = [
        {
            id: 1,
            name: '아메리카노(ICE)',
            price: 4000,
            description: '시원하고 깔끔한 아이스 아메리카노',
            image: null
        },
        {
            id: 2,
            name: '아메리카노(HOT)',
            price: 4000,
            description: '따뜻하고 진한 핫 아메리카노',
            image: null
        },
        {
            id: 3,
            name: '카페라떼',
            price: 5000,
            description: '부드러운 우유와 에스프레소의 조화',
            image: null
        },
        {
            id: 4,
            name: '카푸치노',
            price: 5000,
            description: '진한 에스프레소와 거품 우유의 완벽한 조화',
            image: null
        },
        {
            id: 5,
            name: '카라멜 마키아토',
            price: 5500,
            description: '달콤한 카라멜과 에스프레소의 만남',
            image: null
        },
        {
            id: 6,
            name: '바닐라 라떼',
            price: 5500,
            description: '부드러운 바닐라 향이 가득한 라떼',
            image: null
        },
        {
            id: 7,
            name: '모카',
            price: 5500,
            description: '진한 초콜릿과 에스프레소의 달콤한 조화',
            image: null
        },
        {
            id: 8,
            name: '콜드브루',
            price: 4500,
            description: '12시간 저온 추출로 만든 부드러운 콜드브루',
            image: null
        }
    ]

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

    const handleOrder = () => {
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
            alert('주문이 완료되었습니다!')

            // 주문 데이터를 관리자 페이지로 전달
            const orderData = {
                items: cartItems.map(item => ({
                    name: getItemDisplayName(item),
                    quantity: item.quantity,
                    price: getItemPrice(item)
                })),
                total: totalAmount
            }

            if (onOrderComplete) {
                onOrderComplete(orderData)
            }

            setCartItems([])
        }
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
