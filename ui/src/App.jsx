import React, { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './styles/App.css'

function App() {
    const [currentPage, setCurrentPage] = useState('order')
    const [newOrder, setNewOrder] = useState(null)

    const handleOrderComplete = (orderData) => {
        setNewOrder(orderData)
        setCurrentPage('admin')
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'order':
                return <OrderPage onOrderComplete={handleOrderComplete} />
            case 'admin':
                return <AdminPage newOrder={newOrder} onOrderProcessed={() => setNewOrder(null)} />
            default:
                return <OrderPage onOrderComplete={handleOrderComplete} />
        }
    }

    return (
        <div className="app">
            <Header currentPage={currentPage} onPageChange={setCurrentPage} />
            <main className="main-content">
                {renderPage()}
            </main>
        </div>
    )
}

export default App
