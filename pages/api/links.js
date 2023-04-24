import requireAuth from './_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      where: {
        userId: req.user.id,
      },
    });
    //console.log('LINKS', links);
    res.status(200).json({ status: 'success', data: links });
  } catch (err) {
    console.log('ERROR', err);
    res.status(401).json({
      status: 'error',
      code: 'api-links-error',
      message: err.message,
      data: null,
    });
  }
};

export default requireAuth(handler);
