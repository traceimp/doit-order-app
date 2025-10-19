import pkg from 'pg'
const { Pool } = pkg

// 데이터베이스 연결 설정
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'cozy_coffee',
  user: process.env.DB_USER || 'mj',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
  connectionTimeoutMillis: 2000, // 연결 타임아웃
})

// 연결 테스트
pool.on('connect', () => {
  console.log('✅ 데이터베이스에 연결되었습니다.')
})

pool.on('error', (err) => {
  console.error('❌ 데이터베이스 연결 오류:', err)
})

// 데이터베이스 초기화 함수
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect()

    // 테이블 생성 쿼리
    const createTables = `
      -- menus 테이블
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image_url VARCHAR(500),
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        is_available BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- options 테이블
      CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        menu_id INTEGER NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL DEFAULT 0,
        is_available BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- orders 테이블
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        total_amount INTEGER NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'completed', 'cancelled')),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- order_items 테이블
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        menu_id INTEGER NOT NULL REFERENCES menus(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        options JSONB,
        price INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- 인덱스 생성
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS idx_menus_available ON menus(is_available);
    `

    await client.query(createTables)

    // 기존 데이터 삭제 (새로운 메뉴로 교체하기 위해)
    await client.query('DELETE FROM order_items')
    await client.query('DELETE FROM orders')
    await client.query('DELETE FROM options')
    await client.query('DELETE FROM menus')

    // 초기 데이터 삽입
    const insertInitialData = `
      -- 메뉴 초기 데이터
      INSERT INTO menus (name, description, price, stock_quantity) VALUES
      ('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, 10),
      ('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, 10),
      ('카페라떼', '부드러운 우유와 에스프레소의 조화', 5000, 10),
      ('카푸치노', '진한 에스프레소와 거품 우유의 완벽한 조화', 5000, 10),
      ('바닐라 라떼', '부드러운 바닐라 향이 가득한 라떼', 5500, 10),
      ('콜드브루', '12시간 저온 추출로 만든 부드러운 콜드브루', 4500, 10)
      ON CONFLICT DO NOTHING;

      -- 옵션 초기 데이터
      INSERT INTO options (menu_id, name, price) VALUES
      (1, '샷 추가', 500), (1, '시럽 추가', 0),
      (2, '샷 추가', 500), (2, '시럽 추가', 0),
      (3, '샷 추가', 500), (3, '시럽 추가', 0),
      (4, '샷 추가', 500), (4, '시럽 추가', 0),
      (5, '샷 추가', 500), (5, '시럽 추가', 0),
      (6, '샷 추가', 500), (6, '시럽 추가', 0)
      ON CONFLICT DO NOTHING;
    `

    await client.query(insertInitialData)

    client.release()
    console.log('✅ 데이터베이스 초기화가 완료되었습니다.')
  } catch (err) {
    console.error('❌ 데이터베이스 초기화 오류:', err)
    throw err
  }
}

export { pool }
export default pool
