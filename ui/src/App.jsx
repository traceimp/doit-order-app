import React, { useState } from 'react'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import './styles/App.css'

function App() {
    const [currentPage, setCurrentPage] = useState('order')

    const renderPage = () => {
        switch (currentPage) {
            case 'order':
                return <OrderPage />
            case 'admin':
                return <AdminPage />
            default:
                return <OrderPage />
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
