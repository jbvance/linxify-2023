import { Orbitron } from 'next/font/google';

// Make an API request to `/api/{path}`
export async function apiRequest(path, method = 'GET', data) {
  //const accessToken = session ? session.access_token : undefined;
  console.log('GOT TO HERE YEP');
  return fetch(`/api/${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      //Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status === 'error') {
        // Automatically signout user if accessToken is no longer valid
        // if (response.code === 'auth/invalid-user-token') {
        //   supabase.auth.signOut();
        // }

        throw new CustomError(response.code, response.message);
      } else {
        return response.data;
      }
    });
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Custom font
export const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});
