import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

// Get categories for a user
const handler = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.status(200).json({ status: 'success', data: categories });
  } catch (err) {
    console.log('ERROR', err);
    res.status(401).json({
      status: 'error',
      code: 'api-categories-error',
      message: err.message,
      data: null,
    });
  }
};

export default requireAuth(handler);
