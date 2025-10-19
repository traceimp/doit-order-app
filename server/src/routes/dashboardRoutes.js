import express from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'

const router = express.Router()

// GET /api/dashboard/stats - 대시보드 통계 조회
router.get('/stats', getDashboardStats)

export default router
