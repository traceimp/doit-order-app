import { pool } from '../config/database.js'

// 모든 메뉴 조회
export const getMenus = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.id,
                m.name,
                m.description,
                m.price,
                m.image_url,
                m.stock_quantity,
                m.is_available,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', o.id,
                            'name', o.name,
                            'price', o.price
                        )
                    ) FILTER (WHERE o.id IS NOT NULL),
                    '[]'
                ) as options
            FROM menus m
            LEFT JOIN options o ON m.id = o.menu_id
            WHERE m.is_available = true
            GROUP BY m.id, m.name, m.description, m.price, m.image_url, m.stock_quantity, m.is_available
            ORDER BY m.id
        `
        
        const result = await pool.query(query)
        
        res.json({
            success: true,
            data: result.rows
        })
    } catch (error) {
        console.error('메뉴 조회 오류:', error)
        res.status(500).json({
            success: false,
            message: '메뉴를 불러오는데 실패했습니다.',
            error: error.message
        })
    }
}

// 특정 메뉴 조회
export const getMenuById = async (req, res) => {
    try {
        const { id } = req.params
        
        const query = `
            SELECT 
                m.id,
                m.name,
                m.description,
                m.price,
                m.image_url,
                m.stock_quantity,
                m.is_available,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', o.id,
                            'name', o.name,
                            'price', o.price
                        )
                    ) FILTER (WHERE o.id IS NOT NULL),
                    '[]'
                ) as options
            FROM menus m
            LEFT JOIN options o ON m.id = o.menu_id
            WHERE m.id = $1
            GROUP BY m.id, m.name, m.description, m.price, m.image_url, m.stock_quantity, m.is_available
        `
        
        const result = await pool.query(query, [id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '메뉴를 찾을 수 없습니다.'
            })
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        })
    } catch (error) {
        console.error('메뉴 조회 오류:', error)
        res.status(500).json({
            success: false,
            message: '메뉴를 불러오는데 실패했습니다.',
            error: error.message
        })
    }
}
