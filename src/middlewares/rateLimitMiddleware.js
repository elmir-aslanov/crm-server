const hits = new Map();

const rateLimitMiddleware = (req, res, next) => {
    const windowMs = 15 * 60 * 1000;
    const maxRequests = Number(process.env.RATE_LIMIT_MAX || 100);
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();
    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
        entry.count = 0;
        entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > maxRequests) {
        return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }

    next();
};

export default rateLimitMiddleware;