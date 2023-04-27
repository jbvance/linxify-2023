import requireAuth from '../../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({
        status: 'error',
        code: 'api-links-error',
        message: 'No Category Id was provided',
        data: null,
      });
    }
    // Get links by categoryId
    const user = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        links: {
          where: {
            categoryId,
          },
          orderBy: {
            title: 'asc',
          },
        },
      },
    });
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    console.log('ERROR', err);
    res.status(500).json({
      status: 'error',
      code: 'api-links-error',
      message: err.message,
      data: null,
    });
  }
};

export default requireAuth(handler);
