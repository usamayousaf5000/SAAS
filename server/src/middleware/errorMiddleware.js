export const errorHandler = (err, req, res, next) => {
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(status).json({
        message: err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

export const notFound = (req, res, next) => {
    res.status(404);
    next(new Error(`Not found: ${req.originalUrl}`));
};
