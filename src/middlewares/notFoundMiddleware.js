const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.orginalUrl}`);
    res.status(404);
    next(error);
};

export default notFound;