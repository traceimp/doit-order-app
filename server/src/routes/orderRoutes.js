import express from 'express'
import { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrderStatus 
} from '../controllers/orderController.js'

const router = express.Router()

// POST /api/orders - 주문 생성
router.post('/', createOrder)

// GET /api/orders - 모든 주문 조회
router.get('/', getOrders)

// GET /api/orders/:id - 특정 주문 조회
router.get('/:id', getOrderById)

// PUT /api/orders/:id/status - 주문 상태 업데이트
router.put('/:id/status', updateOrderStatus)

export default router
