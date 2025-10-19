import React from 'react'
import './Inventory.css'

function Inventory({ inventory, onUpdateInventory }) {
    const handleQuantityChange = (menuId, change) => {
        onUpdateInventory(menuId, change)
    }

    const getStockStatus = (stockQuantity) => {
        if (stockQuantity === 0) {
            return { text: '품절', className: 'status-out' }
        } else if (stockQuantity < 5) {
            return { text: '재료 부족', className: 'status-warning' }
        } else {
            return { text: '정상', className: 'status-normal' }
        }
    }

    if (!inventory || inventory.length === 0) {
        return (
            <div className="inventory">
                <h3 className="inventory-title">재고 현황</h3>
                <div className="no-data">재고 정보가 없습니다.</div>
            </div>
        )
    }

    return (
        <div className="inventory">
            <h3 className="inventory-title">재고 현황</h3>
            <div className="inventory-grid">
                {inventory.map(item => {
                    const stockStatus = getStockStatus(item.stock_quantity)
                    return (
                        <div key={item.id} className="inventory-card">
                            <div className="menu-name">{item.name}</div>
                            <div className="stock-info">
                                <div className="stock-quantity-section">
                                    <span className="stock-quantity">{item.stock_quantity}개</span>
                                    <span className={`stock-status ${stockStatus.className}`}>
                                        {stockStatus.text}
                                    </span>
                                </div>
                                <div className="stock-controls">
                                    <button
                                        className="stock-btn decrease"
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                        disabled={item.stock_quantity <= 0}
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
