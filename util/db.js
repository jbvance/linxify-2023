import {
  useQuery,
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
} from '@tanstack/react-query';
import axios from 'axios';

// React Query client
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

/**********************************************
 * LINKS
 **********************************************/
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

// Export the function for getting links here so we
// can use it in Links page for searching
export async function getLinksByUser(
  filter = '',
  orderByField = 'title',
  orderByValue = 'asc'
) {
  let data;
  try {
    const response = await axios.get(
      `/api/links?orderByField=${orderByField}&orderByValue=${orderByValue}&filter=${filter}`
    );
    console.log('RESPONSE', response);
    if (response.data && response.data.data.links) {
      data = response.data.data.links;
    }
    return data;
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}
// Fetch all items by owner
export function useLinksByUser(
  filter = '',
  orderByField = 'title',
  orderByValue = 'asc'
) {
  return useQuery(
    ['links', { filter }],
    async () => getLinksByUser(filter, orderByField, orderByValue)
    // {
    //   select: (links) =>
    //     links.filter(
    //       (link) =>
    //         link.title.toUpperCase().includes(filter.toUpperCase()) ||
    //         link.description.toUpperCase().includes(filter.toUpperCase()) ||
    //         link.url.toUpperCase().includes(filter.toUpperCase())
    //     ),
    // }
    //{ enabled: !!userId }
  );
}

// Links by Category
export function useLinksByCategory(
  categoryId,
  orderByField = 'title',
  orderByValue = 'asc'
) {
  return useQuery(
    ['links', { categoryId }],
    async () => {
      let data = {};

      const response = await axios.get(`/api/categories/${categoryId}/links`);
      console.log('RESPONSE', response);
      if (response.data && response.data.data) {
        data = response.data.data;
      }
      return data;
    },

    { enabled: !!categoryId }
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
export function useCategoriesByUser(userId, filter = '') {
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
    },
    { enabled: !!userId }
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

/***************
 * FAVORITES
 *****************/
// Fetch all items by owner
export function useFavorites() {
  return useQuery(['favorites'], async () => {
    let data;
    try {
      const response = await axios.get(`/api/favorites`);
      if (response.data && response.data.data) {
        data = response.data.data;
      }
      return data;
    } catch (err) {
      console.log('ERROR GETTING FAVORITES', err);
      throw err;
    }
  });
}

export async function createFavorite(linkId) {
  try {
    const response = await axios.post(`/api/favorites`, {
      linkId,
    });
    await Promise.all([client.invalidateQueries(['favorites'])]);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
}

export async function deleteFavorite(linkId) {
  try {
    const response = await axios.delete(`/api/favorites/${linkId}`);
    await Promise.all([client.invalidateQueries(['favorites'])]);
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
