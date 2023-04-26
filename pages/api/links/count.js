import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  try {
    const count = await prisma.link.count({
      where: {
        userId: req.user.id,
      },
    });
    res.status(200).json({ data: { count }, status: 'success' });
  } catch (err) {
    console.log('ERROR IN LINKS COUNT', err);
    res.status(401).json({
      status: 'error',
      code: 'api-links-count-by-user-error',
      message: err.message,
      data: null,
    });
  }
};

export default requireAuth(handler);
