import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { orbitron } from '@/util/util';
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Linxify</title>
        <meta
          name="description"
          content="Linxify - Save our favorites to the web"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <div>
          <h1 className={`${orbitron.className} ${styles['logo-header']}`}>
            LINXIFY
          </h1>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h4 className={styles.header}> Save your favorites!</h4>
            <p>
              Now you can save all your favorites sites on the web in one place!
            </p>
          </div>

          <div className={styles.card}>
            <h4 className={styles.header}> Use Categories</h4>
            <p>
              You can save your favorites by category and easily access all your
              links for each saved category.
            </p>
          </div>

          <div className={styles.card}>
            <h4 className={styles.header}> Advanced Searching</h4>
            <p>
              Create meaningful descriptions for your links so you can easily
              search your links by website name or descriptions.
            </p>
          </div>

          <div className={styles.card}>
            <h4 className={styles.header}> Free to use</h4>
            <p>
              There is no upfront cost or subscription pricing, it&apos;s all
              free!
            </p>
          </div>
        </div>
        <div className={styles['grid-instr']}>
          <h1>How it works</h1>
          <p>
            Linxify is simple to use. You don&apos;t even have to leave the
            browser window of the website address you want to save. When you
            find yourself visting a page you would like to save, simply place
            your cursor at the beginning of the website address in the address
            bar and type{' '}
            <code className={styles.code}>linxify.io/new?link=</code> and press
            enter on your keyboard. This will redirect you to Linxify, where you
            can save the link and add a description that will make it easy to
            find later. Simple!
          </p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button
            variant="success"
            style={{ padding: '20px 50px' }}
            onClick={() => router.push('/links')}
          >
            Get Started Now
          </Button>
        </div>
      </main>
    </>
  );
}
