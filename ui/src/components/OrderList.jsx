import React from 'react'
import './OrderList.css'

function OrderList({ orders, onUpdateOrderStatus }) {
    const getStatusButton = (order) => {
        switch (order.status) {
            case 'pending':
                return (
                    <button
                        className="status-btn pending"
                        onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                    >
                        주문 접수
                    </button>
                )
            case 'preparing':
                return (
                    <button
                        className="status-btn preparing"
                        onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                    >
                        제조 시작
                    </button>
                )
            case 'completed':
                return (
                    <span className="status-completed">제조 완료</span>
                )
            default:
                return null
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return '대기 중'
            case 'preparing': return '제조 중'
            case 'completed': return '완료'
            default: return '알 수 없음'
        }
    }

    const formatOrderItems = (items) => {
        if (!items || items.length === 0) return '주문 항목 없음'
        return items.map(item => {
            if (!item.options || Object.keys(item.options).length === 0) {
                return `${item.menu_name} x ${item.quantity}`
            }

            const optionNames = []
            if (item.options.extraShot) optionNames.push('샷 추가')
            if (item.options.syrup) optionNames.push('시럽 추가')

            const optionsText = optionNames.length > 0 ? ` (${optionNames.join(', ')})` : ''
            return `${item.menu_name}${optionsText} x ${item.quantity}`
        }).join(', ')
    }

    const formatOrderTime = (createdAt) => {
        const date = new Date(createdAt)
        return date.toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="order-list">
            <h3 className="order-list-title">주문 현황</h3>
            {orders.length === 0 ? (
                <div className="empty-orders">
                    주문이 없습니다.
                </div>
            ) : (
                <div className="orders">
                    {orders.map(order => (
                        <div key={order.id} className="order-item">
                            <div className="order-info">
                                <div className="order-time">{formatOrderTime(order.created_at)}</div>
                                <div className="order-items">
                                    {formatOrderItems(order.items)}
                                </div>
                                <div className="order-total">{order.total_amount.toLocaleString()}원</div>
                            </div>
                            <div className="order-actions">
                                <div className="order-status">
                                    상태: {getStatusText(order.status)}
                                </div>
                                {getStatusButton(order)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrderList
