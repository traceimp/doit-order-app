import { pool } from '../config/database.js'

// 재고 현황 조회
export const getInventory = async (req, res) => {
    try {
        const query = `
            SELECT 
                id,
                name,
                stock_quantity,
                is_available,
                CASE 
                    WHEN stock_quantity = 0 THEN 'sold_out'
                    WHEN stock_quantity < 5 THEN 'caution'
                    ELSE 'normal'
                END as stock_status
            FROM menus
            ORDER BY id
        `
        
        const result = await pool.query(query)
        
        res.json({
            success: true,
            data: result.rows
        })
    } catch (error) {
        console.error('재고 조회 오류:', error)
        res.status(500).json({
            success: false,
            message: '재고 정보를 불러오는데 실패했습니다.',
            error: error.message
        })
    }
}

// 재고 수량 업데이트
export const updateInventory = async (req, res) => {
    try {
        const { id } = req.params
        const { stock_quantity } = req.body
        
        if (stock_quantity === undefined || stock_quantity < 0) {
            return res.status(400).json({
                success: false,
                message: '올바른 재고 수량이 필요합니다.'
            })
        }
        
        const query = `
            UPDATE menus 
            SET stock_quantity = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, name, stock_quantity, is_available
        `
        
        const result = await pool.query(query, [stock_quantity, id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '메뉴를 찾을 수 없습니다.'
            })
        }
        
        const updatedMenu = result.rows[0]
        const stockStatus = updatedMenu.stock_quantity === 0 ? 'sold_out' : 
                           updatedMenu.stock_quantity < 5 ? 'caution' : 'normal'
        
        res.json({
            success: true,
            message: '재고가 업데이트되었습니다.',
            data: {
                ...updatedMenu,
                stock_status: stockStatus
            }
        })
    } catch (error) {
        console.error('재고 업데이트 오류:', error)
        res.status(500).json({
            success: false,
            message: '재고 업데이트에 실패했습니다.',
            error: error.message
        })
    }
}
