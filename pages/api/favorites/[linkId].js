import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  const { linkId } = req.query;
  if (!linkId) {
    return res.status(400).json({
      status: 'error',
      message: 'No Link ID was provided',
      data: undefined,
      code: 'api-favorite-handle-error',
    });
  }
  if (req.method === 'DELETE') {
    try {
      const deletedFavorite = await prisma.favorite.delete({
        where: {
          userId_linkId: { userId: req.user.id, linkId },
        },
      });
      return res.status(200).json({
        status: 'success',
        message: 'Favorite deleted successfully',
        data: deletedFavorite,
        code: 'api-favorite-delete-success',
      });
    } catch (err) {
      console.log('ERROR', err);
      res.status(500).json({
        status: 'error',
        code: 'api-favorite-delete-error',
        message: err.message,
        data: null,
      });
    }
  } else {
    // This is a GET request
    // Get the link by ID
    try {
      const favorite = await prisma.favorite.findUnique({
        where: {
          AND: [{ linkId }, { userId: req.user.id }],
        },
        include: {
          link: true,
        },
      });
      if (!favorite) {
        return res.status(404).json({
          status: 'error',
          data: null,
          message: `No favorite was found with link id ${linkId} of userId of ${req.user.id}`,
        });
      }
      console.log('FAVORITE', JSON.stringify(favorite));
      res.status(200).json({ status: 'success', data: favorite });
    } catch (err) {
      console.log('ERROR', err);
      res.status(500).json({
        status: 'error',
        code: 'api-favorites-get-error',
        message: err.message,
        data: null,
      });
    }
  }
};

export default requireAuth(handler);
