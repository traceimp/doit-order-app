import React, { useState, useEffect } from 'react'
import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import OrderList from '../components/OrderList'
import { api } from '../utils/api'
import './AdminPage.css'

function AdminPage({ newOrder, onOrderProcessed }) {
    const [orders, setOrders] = useState([])
    const [inventory, setInventory] = useState([])
    const [dashboardStats, setDashboardStats] = useState({
        total_orders: 0,
        pending_orders: 0,
        preparing_orders: 0,
        completed_orders: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // 데이터 로딩
    const loadData = async () => {
        try {
            setLoading(true)
            const [ordersResponse, inventoryResponse, statsResponse] = await Promise.all([
                api.getOrders(),
                api.getInventory(),
                api.getDashboardStats()
            ])
            
            setOrders(ordersResponse.data)
            setInventory(inventoryResponse.data)
            setDashboardStats(statsResponse.data)
        } catch (err) {
            setError(err.message)
            console.error('데이터 로딩 오류:', err)
        } finally {
            setLoading(false)
        }
    }

    const updateInventory = async (menuId, change) => {
        try {
            const currentItem = inventory.find(item => item.id === menuId)
            if (!currentItem) return
            
            const newQuantity = Math.max(0, currentItem.stock_quantity + change)
            await api.updateInventory(menuId, newQuantity)
            
            // 로컬 상태 업데이트
            setInventory(prev => 
                prev.map(item => 
                    item.id === menuId 
                        ? { ...item, stock_quantity: newQuantity }
                        : item
                )
            )
        } catch (err) {
            console.error('재고 업데이트 오류:', err)
            alert('재고 업데이트에 실패했습니다.')
        }
    }

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.updateOrderStatus(orderId, newStatus)
            
            // 로컬 상태 업데이트
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            )
            
            // 대시보드 통계 업데이트
            await loadData()
        } catch (err) {
            console.error('주문 상태 업데이트 오류:', err)
            alert('주문 상태 업데이트에 실패했습니다.')
        }
    }

    const addNewOrder = (orderData) => {
        // 새 주문은 이미 API를 통해 생성되었으므로 데이터를 다시 로드
        loadData()
    }

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        loadData()
    }, [])

    // 새 주문이 들어오면 추가
    useEffect(() => {
        if (newOrder) {
            addNewOrder(newOrder)
            if (onOrderProcessed) {
                onOrderProcessed()
            }
        }
    }, [newOrder, onOrderProcessed])

    if (loading) {
        return (
            <div className="admin-page">
                <div className="loading">데이터를 불러오는 중...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="admin-page">
                <div className="error">오류: {error}</div>
            </div>
        )
    }

    return (
        <div className="admin-page">
            <Dashboard stats={dashboardStats} />
            <Inventory inventory={inventory} onUpdateInventory={updateInventory} />
            <OrderList
                orders={orders}
                onUpdateOrderStatus={updateOrderStatus}
            />
        </div>
    )
}

export default AdminPage
