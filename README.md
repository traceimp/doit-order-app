# COZY 커피 주문 앱

React + Express.js + PostgreSQL를 사용한 커피 주문 및 관리 시스템입니다.

## 프로젝트 구조

```
doti-order-app/
├── ui/                 # React 프론트엔드
├── server/             # Express.js 백엔드
├── docs/               # 프로젝트 문서
└── README.md
```

## 기술 스택

### 프론트엔드
- React 18
- Vite
- HTML5, CSS3, JavaScript

### 백엔드
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL 클라이언트)

## 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd doti-order-app
```

### 2. PostgreSQL 설치 및 설정
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# 데이터베이스 생성
createdb cozy_coffee
```

### 3. 백엔드 설정
```bash
cd server
npm install

# 환경 변수 설정
cp env.example .env
# .env 파일을 편집하여 데이터베이스 정보 입력

# 서버 실행
npm run dev
```

### 4. 프론트엔드 설정
```bash
cd ui
npm install

# 개발 서버 실행
npm run dev
```

## 환경 변수 설정

`server/.env` 파일을 생성하고 다음 내용을 입력하세요:

```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cozy_coffee
DB_USER=your_username
DB_PASSWORD=your_password
CORS_ORIGIN=http://localhost:3000
```

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 조회

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:id` - 특정 주문 조회
- `PUT /api/orders/:id/status` - 주문 상태 업데이트

### 재고 관련
- `GET /api/inventory` - 재고 현황 조회
- `PUT /api/inventory/:id` - 재고 수량 업데이트

### 통계
- `GET /api/dashboard/stats` - 대시보드 통계

## 주요 기능

### 주문 화면
- 메뉴 목록 표시
- 장바구니 기능
- 주문 처리

### 관리자 화면
- 대시보드 통계
- 재고 관리
- 주문 상태 관리

## 개발 가이드

### 프론트엔드 개발
```bash
cd ui
npm run dev
```

### 백엔드 개발
```bash
cd server
npm run dev
```

### 데이터베이스 스키마
데이터베이스 스키마는 `server/src/config/database.js`에서 자동으로 생성됩니다.

## 라이선스

MIT License
