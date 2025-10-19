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

    const handleAddToCart = () => {
        onAddToCart(menuItem, options)
    }

    return (
        <div className="menu-card">
            <div className="menu-image">
                {menuItem.image ? (
                    <img src={menuItem.image} alt={menuItem.name} />
                ) : (
                    <div className="image-placeholder">
                        <span>이미지</span>
                    </div>
                )}
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
                        />
                        <span>샷 추가 (+500원)</span>
                    </label>

                    <label className="option-item">
                        <input
                            type="checkbox"
                            checked={options.syrup}
                            onChange={() => handleOptionChange('syrup')}
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
