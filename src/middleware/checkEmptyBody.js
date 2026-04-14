const checkEmptyBody = (req, res, next) => {

    if (!req.body) {
        return res.status(400).json({
            success: false,
            error: 'El cuerpo de la petición (body) no puede estar vacío'
        });
    }

    // Si tiene datos, dejamos que la petición continúe al siguiente paso
    next();
};

module.exports = checkEmptyBody;