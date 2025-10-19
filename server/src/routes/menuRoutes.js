import express from 'express'
import { getMenus, getMenuById } from '../controllers/menuController.js'

const router = express.Router()

// GET /api/menus - 모든 메뉴 조회
router.get('/', getMenus)

// GET /api/menus/:id - 특정 메뉴 조회
router.get('/:id', getMenuById)

export default router
