import requireAuth from '../_requireAuth';
import prisma from '@/lib/prisma';

const handler = async (req, res) => {
  const { categoryId } = req.query;
  const { title, description } = req.body;
  if (!categoryId) {
    throw new Error('No Category Id was provided');
  }
  if (req.method === 'PATCH') {
    // If no description or title provided, return error response
    if (!description || !title) {
      return res.status(404).json({
        status: 'error',
        data: null,
        message: `Missing description or title`,
        code: 'api-categories-error',
      });
    }
    // Data provided, update here
    try {
      const updateCategory = await prisma.category.update({
        where: {
          id: categoryId,
        },
        data: {
          title,
          description,
        },
      });
      return res.status(200).json({
        status: 'success',
        data: updateCategory,
        message: 'Category successfully updated',
      });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-categories-error',
        message: err.message,
        data: null,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedCategory = await prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
      return res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully',
        data: deletedCategory,
        code: 'api-category-delete-success',
      });
    } catch (err) {
      console.log('ERROR', err);
      res.status(400).json({
        status: 'error',
        code: 'api-categories-delete-error',
        message: err.message,
        data: null,
      });
    }
  } else {
    // This is a GET request
    // Get the category by ID
    try {
      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        return res.status(404).json({
          status: 'error',
          data: null,
          message: `No category was found with id ${categoryId}`,
          code: 'api-categories-fetch-error-not-found',
        });
      }
      res.status(200).json({ status: 'success', data: category });
    } catch (err) {
      console.log('ERROR', err);
      res.status(401).json({
        status: 'error',
        code: 'api-categories-fetch-error-server-error',
        message: err.message,
        data: null,
      });
    }
  }
};

export default requireAuth(handler);
