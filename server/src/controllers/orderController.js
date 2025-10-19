import { pool } from '../config/database.js'

// 주문 생성
export const createOrder = async (req, res) => {
    const client = await pool.connect()
    
    try {
        const { items, total_amount } = req.body
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: '주문 항목이 필요합니다.'
            })
        }
        
        if (!total_amount || total_amount <= 0) {
            return res.status(400).json({
                success: false,
                message: '올바른 총 금액이 필요합니다.'
            })
        }
        
        await client.query('BEGIN')
        
        // 주문 생성
        const orderQuery = `
            INSERT INTO orders (total_amount, status, created_at)
            VALUES ($1, 'pending', NOW())
            RETURNING id, created_at
        `
        const orderResult = await client.query(orderQuery, [total_amount])
        const orderId = orderResult.rows[0].id
        const createdAt = orderResult.rows[0].created_at
        
        // 주문 항목들 생성
        for (const item of items) {
            const { menu_id, quantity, options, price } = item
            
            // 재고 확인 및 차감
            const stockQuery = `
                SELECT stock_quantity FROM menus WHERE id = $1
            `
            const stockResult = await client.query(stockQuery, [menu_id])
            
            if (stockResult.rows.length === 0) {
                throw new Error(`메뉴 ID ${menu_id}를 찾을 수 없습니다.`)
            }
            
            const currentStock = stockResult.rows[0].stock_quantity
            if (currentStock < quantity) {
                throw new Error(`재고가 부족합니다. (요청: ${quantity}, 현재: ${currentStock})`)
            }
            
            // 재고 차감
            const updateStockQuery = `
                UPDATE menus 
                SET stock_quantity = stock_quantity - $1 
                WHERE id = $2
            `
            await client.query(updateStockQuery, [quantity, menu_id])
            
            // 주문 항목 추가
            const orderItemQuery = `
                INSERT INTO order_items (order_id, menu_id, quantity, options, price)
                VALUES ($1, $2, $3, $4, $5)
            `
            await client.query(orderItemQuery, [
                orderId, 
                menu_id, 
                quantity, 
                JSON.stringify(options || {}), 
                price
            ])
        }
        
        await client.query('COMMIT')
        
        res.status(201).json({
            success: true,
            message: '주문이 성공적으로 생성되었습니다.',
            data: {
                id: orderId,
                total_amount,
                status: 'pending',
                created_at: createdAt
            }
        })
        
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('주문 생성 오류:', error)
        res.status(500).json({
            success: false,
            message: '주문 생성에 실패했습니다.',
            error: error.message
        })
    } finally {
        client.release()
    }
}

// 모든 주문 조회
export const getOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id,
                o.total_amount,
                o.status,
                o.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', oi.id,
                            'menu_id', oi.menu_id,
                            'menu_name', m.name,
                            'quantity', oi.quantity,
                            'options', oi.options,
                            'price', oi.price
                        )
                    ) FILTER (WHERE oi.id IS NOT NULL),
                    '[]'
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menus m ON oi.menu_id = m.id
            GROUP BY o.id, o.total_amount, o.status, o.created_at
            ORDER BY o.created_at DESC
        `
        
        const result = await pool.query(query)
        
        res.json({
            success: true,
            data: result.rows
        })
    } catch (error) {
        console.error('주문 조회 오류:', error)
        res.status(500).json({
            success: false,
            message: '주문 목록을 불러오는데 실패했습니다.',
            error: error.message
        })
    }
}

// 특정 주문 조회
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params
        
        const query = `
            SELECT 
                o.id,
                o.total_amount,
                o.status,
                o.created_at,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', oi.id,
                            'menu_id', oi.menu_id,
                            'menu_name', m.name,
                            'quantity', oi.quantity,
                            'options', oi.options,
                            'price', oi.price
                        )
                    ) FILTER (WHERE oi.id IS NOT NULL),
                    '[]'
                ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menus m ON oi.menu_id = m.id
            WHERE o.id = $1
            GROUP BY o.id, o.total_amount, o.status, o.created_at
        `
        
        const result = await pool.query(query, [id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '주문을 찾을 수 없습니다.'
            })
        }
        
        res.json({
            success: true,
            data: result.rows[0]
        })
    } catch (error) {
        console.error('주문 조회 오류:', error)
        res.status(500).json({
            success: false,
            message: '주문을 불러오는데 실패했습니다.',
            error: error.message
        })
    }
}

// 주문 상태 업데이트
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        
        const validStatuses = ['pending', 'preparing', 'completed']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: '올바른 상태값이 필요합니다. (pending, preparing, completed)'
            })
        }
        
        const query = `
            UPDATE orders 
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id, status, updated_at
        `
        
        const result = await pool.query(query, [status, id])
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '주문을 찾을 수 없습니다.'
            })
        }
        
        res.json({
            success: true,
            message: '주문 상태가 업데이트되었습니다.',
            data: result.rows[0]
        })
    } catch (error) {
        console.error('주문 상태 업데이트 오류:', error)
        res.status(500).json({
            success: false,
            message: '주문 상태 업데이트에 실패했습니다.',
            error: error.message
        })
    }
}
