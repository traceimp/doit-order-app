import React, { useState } from 'react'
import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import OrderList from '../components/OrderList'
import './AdminPage.css'

function AdminPage() {
    const [orders, setOrders] = useState([
        {
            id: 1,
            time: '7월 31일 13:00',
            items: [{ name: '아메리카노(ICE)', quantity: 1, price: 4000 }],
            total: 4000,
            status: 'pending'
        },
        {
            id: 2,
            time: '7월 31일 12:45',
            items: [
                { name: '카페라떼', quantity: 2, price: 5000 },
                { name: '바닐라 라떼', quantity: 1, price: 5500 }
            ],
            total: 15500,
            status: 'preparing'
        },
        {
            id: 3,
            time: '7월 31일 12:30',
            items: [{ name: '카푸치노', quantity: 1, price: 5000 }],
            total: 5000,
            status: 'completed'
        }
    ])

    const [inventory, setInventory] = useState({
        1: 3,  // 아메리카노(ICE) - 주의 상태
        2: 0,  // 아메리카노(HOT) - 품절 상태
        3: 8   // 카페라떼 - 정상 상태
    })

    const updateInventory = (menuId, change) => {
        setInventory(prev => ({
            ...prev,
            [menuId]: Math.max(0, prev[menuId] + change)
        }))
    }

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId
                    ? { ...order, status: newStatus }
                    : order
            )
        )
    }

    const getOrderStats = () => {
        const total = orders.length
        const pending = orders.filter(order => order.status === 'pending').length
        const preparing = orders.filter(order => order.status === 'preparing').length
        const completed = orders.filter(order => order.status === 'completed').length

        return { total, pending, preparing, completed }
    }

    return (
        <div className="admin-page">
            <Dashboard stats={getOrderStats()} />
            <Inventory inventory={inventory} onUpdateInventory={updateInventory} />
            <OrderList
                orders={orders}
                onUpdateOrderStatus={updateOrderStatus}
            />
        </div>
    )
}

export default AdminPage
