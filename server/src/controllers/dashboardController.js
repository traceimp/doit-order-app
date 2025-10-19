import { pool } from '../config/database.js'

// 대시보드 통계 조회
export const getDashboardStats = async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) as total_orders,
                COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
                COUNT(*) FILTER (WHERE status = 'preparing') as preparing_orders,
                COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
                COALESCE(SUM(total_amount), 0) as total_revenue
            FROM orders
        `
        
        const result = await pool.query(query)
        const stats = result.rows[0]
        
        res.json({
            success: true,
            data: {
                total_orders: parseInt(stats.total_orders),
                pending_orders: parseInt(stats.pending_orders),
                preparing_orders: parseInt(stats.preparing_orders),
                completed_orders: parseInt(stats.completed_orders),
                total_revenue: parseFloat(stats.total_revenue)
            }
        })
    } catch (error) {
        console.error('대시보드 통계 조회 오류:', error)
        res.status(500).json({
            success: false,
            message: '대시보드 통계를 불러오는데 실패했습니다.',
            error: error.message
        })
    }
}
