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
export function useLinksByUser(filter) {
  return useQuery(
    ['links'],
    async () => {
      let data;
      try {
        const response = await axios.get(`/api/links`);
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

export async function createLink({ url, title, description }) {
  try {
    const response = await axios.post(`/api/links`, {
      url,
      title,
      description,
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
    console.log('LINK DELETED');
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
export function useCategoriesByUser(filter) {
  return useQuery(
    ['categories'],
    async () => {
      console.log('GOT HERE');
      let data;
      try {
        const response = await axios.get(`/api/categories`);
        console.log('RESPONSE', response);
        if (response.data && response.data.data) {
          data = response.data.data;
        }
        console.log('DATA', data);
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
