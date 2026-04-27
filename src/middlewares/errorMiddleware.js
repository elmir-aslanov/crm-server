export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.details || null,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
