export const notFound = (req, res, next) => {
  const error = new Error(`요청한 경로를 찾을 수 없습니다: ${req.originalUrl}`)
  error.statusCode = 404
  error.code = 'NOT_FOUND'
  next(error)
}
