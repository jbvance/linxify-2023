import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const favorites = await prisma.favorite.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          link: true,
        },
      });
      return res.status(200).json({ status: 'success', data: favorites });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-favroties-get-error',
        message: err.message,
        data: null,
      });
    }
  } else if (req.method === 'POST') {
    try {
      // verify linkId is present
      const { linkId } = req.body;
      if (!linkId) {
        return res.status(400).json({
          status: 'error',
          code: 'api-favroties-post-error',
          message: 'No Link Id was provided',
          data: null,
        });
      }
      const favorite = await prisma.favorite.create({
        data: {
          userId: req.user.id,
          linkId,
        },
      });
      return res.status(201).json({ status: 'success', data: favorite });
    } catch (err) {
      console.log('ERROR', err);
      res.status(400).json({
        status: 'error',
        code: 'api-favorites-post-error',
        message: err.message,
        data: null,
      });
    }
  }
};

export default requireAuth(handler);
