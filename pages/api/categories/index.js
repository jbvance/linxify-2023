import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        where: {
          userId: req.user.id,
        },
      });
      res.status(200).json({ status: 'success', data: categories });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-categories-error',
        message: err.message,
        data: null,
      });
    }
  } else if (req.method === 'POST') {
    try {
      // verify url and title are both present
      const { title, description } = req.body;
      if (!title || !description) {
        throw new Error('Must provide both title and description');
      }
      const category = await prisma.category.create({
        data: {
          title,
          userId: req.user.id,
          description,
        },
      });
      res.status(201).json({ status: 'success', data: category });
    } catch (err) {
      console.log('ERROR', err);
      res.status(400).json({
        status: 'error',
        code: 'api-categories-error',
        message: err.message,
        data: null,
      });
    }
  }
};

export default requireAuth(handler);
