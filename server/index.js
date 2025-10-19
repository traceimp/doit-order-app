// Render 배포용 진입점
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './src/middleware/errorHandler.js'
import { notFound } from './src/middleware/notFound.js'
import { initializeDatabase } from './src/config/database.js'
import menuRoutes from './src/routes/menuRoutes.js'
import orderRoutes from './src/routes/orderRoutes.js'
import inventoryRoutes from './src/routes/inventoryRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js'

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// 미들웨어 설정
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// 라우트 설정
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'COZY 커피 주문 앱 API 서버가 실행 중입니다.',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    })
})

// API 라우트
app.use('/api/menus', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/dashboard', dashboardRoutes)

// 에러 핸들링 미들웨어
app.use(notFound)
app.use(errorHandler)

// 서버 시작
const startServer = async () => {
    try {
        // 데이터베이스 초기화
        await initializeDatabase()

        app.listen(PORT, () => {
            console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`)
            console.log(`📱 프론트엔드: http://localhost:3000`)
            console.log(`🔧 API 서버: http://localhost:${PORT}`)
            console.log(`📊 API 문서: http://localhost:${PORT}/api`)
            console.log(`🗄️  데이터베이스: PostgreSQL (cozy_coffee)`)
        })
    } catch (error) {
        console.error('❌ 서버 시작 실패:', error)
        process.exit(1)
    }
}

startServer()
