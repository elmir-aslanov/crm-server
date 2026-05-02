import jwt from 'jsonwebtoken';
const generateToken = (id) => {
<<<<<<< HEAD
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
}
=======
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};
>>>>>>> 72da21a860da6e2fc8ea7d57c6763f03c1f3e5be
export default generateToken;