import React, { useState } from 'react'
import './MenuCard.css'

function MenuCard({ menuItem, onAddToCart }) {
    const [options, setOptions] = useState({
        extraShot: false,
        syrup: false
    })

    const handleOptionChange = (optionName) => {
        setOptions(prev => ({
            ...prev,
            [optionName]: !prev[optionName]
        }))
    }

    const calculatePrice = () => {
        let totalPrice = menuItem.price
        if (options.extraShot) totalPrice += 500
        return totalPrice
    }

    const getMenuImage = (menuName) => {
        const imageMap = {
            '아메리카노(HOT)': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
            '아메리카노(ICE)': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
            '카페라떼': 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=crop',
            '카푸치노': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop',
            '바닐라 라떼': '/images/americano-hot.jpg',
            '콜드브루': '/images/americano-ice.jpg'
        }
        return imageMap[menuName] || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop'
    }

    const handleAddToCart = () => {
        onAddToCart(menuItem, options)
    }

    return (
        <div className="menu-card">
            <div className="menu-image">
                <img src={getMenuImage(menuItem.name)} alt={menuItem.name} />
            </div>

            <div className="menu-info">
                <h3 className="menu-name">{menuItem.name}</h3>
                <p className="menu-price">{menuItem.price.toLocaleString()}원</p>
                <p className="menu-description">{menuItem.description}</p>

                <div className="menu-options">
                    <label className="option-item">
                        <input
                            type="checkbox"
                            checked={options.extraShot}
                            onChange={() => handleOptionChange('extraShot')}
                            aria-label="샷 추가 옵션"
                        />
                        <span>샷 추가 (+500원)</span>
                    </label>

                    <label className="option-item">
                        <input
                            type="checkbox"
                            checked={options.syrup}
                            onChange={() => handleOptionChange('syrup')}
                            aria-label="시럽 추가 옵션"
                        />
                        <span>시럽 추가 (+0원)</span>
                    </label>
                </div>

                <div className="menu-actions">
                    <div className="calculated-price">
                        총 가격: {calculatePrice().toLocaleString()}원
                    </div>
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        담기
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MenuCard
