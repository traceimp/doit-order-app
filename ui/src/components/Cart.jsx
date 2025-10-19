import React from 'react'
import './Cart.css'

function Cart({ items, onUpdateQuantity, onRemoveItem, onOrder }) {
    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const itemPrice = item.price + (item.options.extraShot ? 500 : 0)
            return total + (itemPrice * item.quantity)
        }, 0)
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

    return (
        <div className="cart">
            <div className="cart-header">
                <h3>장바구니</h3>
            </div>

            <div className="cart-content">
                {items.length === 0 ? (
                    <div className="empty-cart">
                        장바구니가 비어있습니다.
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-section">
                            <div className="cart-items">
                                {items.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-info">
                                            <div className="item-name-section">
                                                <div className="item-name">
                                                    {getItemDisplayName(item)}
                                                </div>
                                                <div className="quantity-controls">
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="quantity">{item.quantity}</span>
                                                    <button
                                                        className="quantity-btn"
                                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="item-price">
                                                {getItemPrice(item).toLocaleString()}원
                                            </div>
                                        </div>

                                        <div className="item-controls">
                                            <button
                                                className="remove-btn"
                                                onClick={() => onRemoveItem(item.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cart-summary-section">
                            <div className="total-price">
                                총 금액: <span className="total-amount">{calculateTotal().toLocaleString()}원</span>
                            </div>
                            <button className="order-btn" onClick={onOrder}>
                                주문하기
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart
