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
        }
    ])

    const [inventory, setInventory] = useState({
        1: 10, // 아메리카노(ICE)
        2: 10, // 아메리카노(HOT)
        3: 10  // 카페라떼
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
