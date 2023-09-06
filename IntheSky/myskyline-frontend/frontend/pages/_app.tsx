import Head from 'next/head';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US';
import { YDIYGO340 } from '@/fonts';
import 'styles/globals.css';

import type { AppProps } from 'next/app';

interface CustomAppProps {
  Component: AppProps['Component'] & {
    getLayout: (page: React.ReactNode) => React.ReactNode;
  };
  pageProps: AppProps['pageProps'];
}

function MyApp({ Component, pageProps }: CustomAppProps) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ConfigProvider locale={enUS}>
      <Head>
        <title>inthesky</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="inthesky" />
        <meta property="og:url" content="https://inthesky.kayaji.com" />
        <meta property="og:image" content="https://inthesky.kayaji.com/img/inthesky.png" />
        <meta name="description" content="Upload your skyview" key="desc" />
        <meta property="og:description" content="Upload your skyview" />
        <meta property="og:site_name" content="inthesky" />
        <meta property="og:locale" content="en_US" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <link rel="shortcut icon" href="/favicon-22x14.svg" sizes="14x14" />
        <link rel="shortcut icon" href="/favicon-44x28.svg" sizes="28x28" />
      </Head>
      <main className={YDIYGO340.className}>{getLayout(<Component {...pageProps} />)}</main>
    </ConfigProvider>
  );
}

export default MyApp;
