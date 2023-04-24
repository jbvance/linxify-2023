import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

// Middleware for requiring authentication and getting user
const requireAuth = (fn) => async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    //console.log('SESSION', session);
    if (!session || !session.user) {
      throw new Error('No user found');
    }
    req.user = session.user;
    // Call route function passed into this middleware
    return fn(req, res);
  } catch (error) {
    console.log('_require-auth error', error);

    // If there's an error assume token is expired and return
    // auth/invalid-user-token error (handled by apiRequest in util.js)
    res.status(401).send({
      status: 'error',
      code: 'auth/invalid-user-token',
      message: 'Your login has expired. Please login again.',
    });
  }
};

export default requireAuth;
