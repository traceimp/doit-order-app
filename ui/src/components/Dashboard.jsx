import React from 'react'
import './Dashboard.css'

function Dashboard({ stats }) {
    return (
        <div className="dashboard">
            <h3 className="dashboard-title">관리자 대시보드</h3>
            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-label">총 주문</span>
                    <span className="stat-value">{stats.total}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">주문 접수</span>
                    <span className="stat-value">{stats.pending}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">제조 중</span>
                    <span className="stat-value">{stats.preparing}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">제조 완료</span>
                    <span className="stat-value">{stats.completed}</span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
