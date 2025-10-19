import React from 'react'
import './Header.css'

function Header({ currentPage, onPageChange }) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <h1>COZY</h1>
                </div>
                <nav className="navigation">
                    <button
                        className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
                        onClick={() => onPageChange('order')}
                    >
                        주문하기
                    </button>
                    <button
                        className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
                        onClick={() => onPageChange('admin')}
                    >
                        관리자
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header
