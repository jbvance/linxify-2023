import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const getUserLinksPaginated = async (userId, page, pageSize) => {
  try {
    const results = await prisma.link.findMany({
      where: {
        userId,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return results;
  } catch (err) {
    console.log('Error getting paginated links', err.message);
    throw new Error(`Error getting paginated links => ${err.message}`);
  }
};

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const pageSize = 5;
    const page = parseInt(req.query.page);
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
      let links = [];
      if (user.links && user.links.length > 0) {
        links = await getUserLinksPaginated(user.id, page, pageSize);
      }

      res
        .status(200)
        .json({ status: 'success', data: { ...user, links: [...links] } });
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
