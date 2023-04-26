import {
  useQuery,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from '@tanstack/react-query';
import axios from 'axios';

// React Query client
const client = new QueryClient();

/**********************************************
 * LINKS
 **********************************************/

// Get number of links for user
export function useLinkCountByUser(userId) {
  return useQuery(
    ['linkCount'],
    async () => {
      let userLinkCount = 0;
      try {
        const response = await axios.get(`api/links/count`);
        if (response.data && response.data.data.count) {
          userLinkCount = response.data.data.count;
        }
      } catch (err) {
        console.log(`Error in getUserLinkCount - ${err.message}`);
      } finally {
        return userLinkCount;
      }
    },
    { enabled: !!userId }
  );
}

export function useLink(id) {
  return useQuery(
    ['link', { id }],
    async () => {
      let data;
      try {
        const response = await axios.get(`/api/links/${id}`);
        console.log('RESPONSE', response);
        if (response.data && response.data.data) {
          data = response.data.data;
        }
      } catch (err) {
        console.log('ERROR', err);
      } finally {
        return data;
      }
    },
    { enabled: !!id }
  );
}

// Fetch all items by owner
export function useLinksByUser(filter = '', page = 1) {
  return useQuery(
    ['links'],
    async () => {
      let data;
      try {
        const response = await axios.get(`/api/links?page=${page}`);
        console.log('RESPONSE', response);
        if (response.data && response.data.data.links) {
          data = response.data.data.links;
        }
        return data;
      } catch (err) {
        console.log('ERROR', err);
        throw err;
      }
    },
    {
      select: (links) =>
        links.filter(
          (link) =>
            link.title.toUpperCase().includes(filter.toUpperCase()) ||
            link.description.toUpperCase().includes(filter.toUpperCase()) ||
            link.url.toUpperCase().includes(filter.toUpperCase())
        ),
    }
    //{ enabled: !!userId }
  );
}

export async function updateLink(id, data) {
  try {
    const response = await axios.patch(`/api/links/${id}`, {
      url: data.url,
      title: data.title,
      description: data.description,
      categoryId: data.category,
    });
    await Promise.all([
      client.invalidateQueries(['link', { id }]),
      client.invalidateQueries(['links']),
    ]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

export async function createLink({ url, title, description, category }) {
  try {
    const response = await axios.post(`/api/links`, {
      url,
      title,
      description,
      categoryId: category,
    });
    await Promise.all([client.invalidateQueries(['links'])]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

export async function deleteLink(id) {
  try {
    const response = await axios.delete(`/api/links/${id}`);
    await Promise.all([
      client.invalidateQueries(['link', { id }]),
      client.invalidateQueries(['links']),
    ]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

/*********************************************
 * CATEGORIES
 ********************************************/

export function useCategory(id) {
  return useQuery(
    ['category', { id }],
    async () => {
      let data;
      try {
        const response = await axios.get(`/api/categories/${id}`);
        console.log('RESPONSE', response);
        if (response.data && response.data.data) {
          data = response.data.data;
        }
      } catch (err) {
        console.log('ERROR', err);
      } finally {
        return data;
      }
    },
    { enabled: !!id }
  );
}

// Fetch all items by owner
export function useCategoriesByUser(filter = '') {
  return useQuery(
    ['categories'],
    async () => {
      let data;
      try {
        const response = await axios.get(`/api/categories`);
        console.log('RESPONSE', response);
        if (response.data && response.data.data) {
          data = response.data.data;
        }
        return data;
      } catch (err) {
        console.log('ERROR', err);
        throw err;
      }
    },
    {
      select: (categories) =>
        categories.filter(
          (category) =>
            category.title.toUpperCase().includes(filter.toUpperCase()) ||
            category.description.toUpperCase().includes(filter.toUpperCase())
        ),
    }
    //{ enabled: !!userId }
  );
}

export async function updateCategory(id, data) {
  try {
    const response = await axios.patch(`/api/categories/${id}`, {
      title: data.title,
      description: data.description,
    });
    await Promise.all([
      client.invalidateQueries(['category', { id }]),
      client.invalidateQueries(['categories']),
    ]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

export async function createCategory({ title, description }) {
  try {
    const response = await axios.post(`/api/categories`, {
      title,
      description,
    });
    await Promise.all([client.invalidateQueries(['categories'])]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

export async function deleteCategory(id) {
  try {
    const response = await axios.delete(`/api/categories/${id}`);
    await Promise.all([
      client.invalidateQueries(['category', { id }]),
      client.invalidateQueries(['categories']),
    ]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}
