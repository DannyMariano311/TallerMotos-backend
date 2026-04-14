const errorHandler = (err, req, res, next) => {
  // En consola ves el error real para ti como desarrollador
  console.error(err.stack);
  
  // Si el error trae un status code lo usa, si no, es un error 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  // Respuesta formateada para el cliente
  res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;