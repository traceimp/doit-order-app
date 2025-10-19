import React from 'react'
import './Inventory.css'

function Inventory({ inventory, onUpdateInventory }) {
    const menuItems = [
        { id: 1, name: '아메리카노 (ICE)' },
        { id: 2, name: '아메리카노 (HOT)' },
        { id: 3, name: '카페라떼' }
    ]

    const handleQuantityChange = (menuId, change) => {
        onUpdateInventory(menuId, change)
    }

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { text: '품절', className: 'status-out' }
        if (quantity < 5) return { text: '주의', className: 'status-warning' }
        return { text: '정상', className: 'status-normal' }
    }

    return (
        <div className="inventory">
            <h3 className="inventory-title">재고 현황</h3>
            <div className="inventory-grid">
                {menuItems.map(item => {
                    const stockStatus = getStockStatus(inventory[item.id])
                    return (
                        <div key={item.id} className="inventory-card">
                            <div className="menu-name">{item.name}</div>
                            <div className="stock-info">
                                <div className="stock-quantity-section">
                                    <span className="stock-quantity">{inventory[item.id]}개</span>
                                    <span className={`stock-status ${stockStatus.className}`}>
                                        {stockStatus.text}
                                    </span>
                                </div>
                                <div className="stock-controls">
                                    <button
                                        className="stock-btn decrease"
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                        disabled={inventory[item.id] <= 0}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="stock-btn increase"
                                        onClick={() => handleQuantityChange(item.id, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Inventory
