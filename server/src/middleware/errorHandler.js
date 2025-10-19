export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // 기본 에러 응답
  let error = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  }

  // Express 기본 에러 처리
  if (err.type === 'entity.parse.failed') {
    error.error = {
      code: 'INVALID_JSON',
      message: '잘못된 JSON 형식입니다.',
      details: err.message
    }
    return res.status(400).json(error)
  }

  // 커스텀 에러 처리
  if (err.code) {
    error.error.code = err.code
  }
  if (err.message) {
    error.error.message = err.message
  }
  if (err.details) {
    error.error.details = err.details
  }

  const statusCode = err.statusCode || 500
  res.status(statusCode).json(error)
}
