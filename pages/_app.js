import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/custom.scss';
import Layout from '@/components/Layout';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider } from '@/util/db';

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  );
}
