import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      // TEST GET USER WITH LINKS AND CATEGORIES
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        include: {
          links: {
            include: {
              category: true,
            },
          },
        },
      });
      //console.log('USER', user);
      res.status(200).json({ status: 'success', data: user });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-links-error',
        message: err.message,
        data: null,
      });
    }
  } else if (req.method === 'POST') {
    try {
      // verify url and title are both present
      const { url, title, description, categoryId } = req.body;
      if (!url || !title) {
        throw new Error('Must provide both url and title');
      }
      const link = await prisma.link.create({
        data: {
          url,
          title,
          userId: req.user.id,
          description,
          categoryId: categoryId ? categoryId : null,
        },
      });
      console.log('LINK CREATED', link);
      res.status(201).json({ status: 'success', data: link });
    } catch (err) {
      console.log('ERROR', err);
      res.status(400).json({
        status: 'error',
        code: 'api-links-error',
        message: err.message,
        data: null,
      });
    }
  }
};

export default requireAuth(handler);
