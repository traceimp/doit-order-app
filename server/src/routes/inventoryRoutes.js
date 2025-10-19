import express from 'express'
import { getInventory, updateInventory } from '../controllers/inventoryController.js'

const router = express.Router()

// GET /api/inventory - 재고 현황 조회
router.get('/', getInventory)

// PUT /api/inventory/:id - 재고 수량 업데이트
router.put('/:id', updateInventory)

export default router
