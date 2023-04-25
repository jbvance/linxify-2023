import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  const { linkId } = req.query;
  const { url, title, description } = req.body;
  if (!linkId) {
    throw new Error('No Link Id was provided');
  }
  if (req.method === 'PATCH') {
    // If no url or title provided, return error response
    if (!url || !title) {
      return res.status(404).json({
        status: 'error',
        data: null,
        message: `Missing url or title`,
      });
    }
    // Data provided, update here
    try {
      const updateLink = await prisma.link.update({
        where: {
          id: linkId,
        },
        data: {
          url,
          title,
          description,
        },
      });
      return res.status(200).json({
        status: 'success',
        data: updateLink,
        message: 'Link successfully updated',
      });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-links-error',
        message: err.message,
        data: null,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedLink = await prisma.link.delete({
        where: {
          id: linkId,
        },
      });
      return res.status(200).json({
        status: 'success',
        message: 'Link deleted successfully',
        data: deletedLink,
        code: 'api-link-delete-success',
      });
    } catch (err) {
      console.log('ERROR', err);
      res.status(400).json({
        status: 'error',
        code: 'api-links-error',
        message: err.message,
        data: null,
      });
    }
  } else {
    // This is a GET request
    // Get the link by ID
    try {
      const link = await prisma.link.findUnique({
        where: {
          id: linkId,
        },
        include: {
          category: true,
        },
      });
      if (!link) {
        return res.status(404).json({
          status: 'error',
          data: null,
          message: `No link was found with id ${linkId}`,
        });
      }
      //console.log('LINK', JSON.stringify(link));
      res.status(200).json({ status: 'success', data: link });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-links-error',
        message: err.message,
        data: null,
      });
    }
  }
};

export default requireAuth(handler);
