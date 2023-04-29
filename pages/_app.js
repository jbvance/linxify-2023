import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/custom.scss';
import Layout from '@/components/Layout';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider } from '@/util/db';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  console.log('QUERY', router.query);
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
