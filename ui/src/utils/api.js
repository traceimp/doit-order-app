const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://doit-order-app.onrender.com/api'

export const api = {
    // 메뉴 관련 API
    async getMenus() {
        const response = await fetch(`${API_BASE_URL}/menus`)
        if (!response.ok) {
            throw new Error('메뉴를 불러오는데 실패했습니다.')
        }
        return response.json()
    },

    // 주문 관련 API
    async createOrder(orderData) {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
        if (!response.ok) {
            throw new Error('주문 생성에 실패했습니다.')
        }
        return response.json()
    },

    async getOrders() {
        const response = await fetch(`${API_BASE_URL}/orders`)
        if (!response.ok) {
            throw new Error('주문 목록을 불러오는데 실패했습니다.')
        }
        return response.json()
    },

    async updateOrderStatus(orderId, status) {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })
        if (!response.ok) {
            throw new Error('주문 상태 업데이트에 실패했습니다.')
        }
        return response.json()
    },

    // 재고 관련 API
    async getInventory() {
        const response = await fetch(`${API_BASE_URL}/inventory`)
        if (!response.ok) {
            throw new Error('재고 정보를 불러오는데 실패했습니다.')
        }
        return response.json()
    },

    async updateInventory(menuId, stockQuantity) {
        const response = await fetch(`${API_BASE_URL}/inventory/${menuId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stock_quantity: stockQuantity }),
        })
        if (!response.ok) {
            throw new Error('재고 업데이트에 실패했습니다.')
        }
        return response.json()
    },

    // 통계 API
    async getDashboardStats() {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`)
        if (!response.ok) {
            throw new Error('대시보드 통계를 불러오는데 실패했습니다.')
        }
        return response.json()
    }
}
