import Head from "next/head";
import React from "react";
import { RecoilRoot } from "recoil";

import Refresh from "../components/Refresh";
import PageWithLayoutType from "../components/layout/PageWithLayoutType";
import EmptyLayout from "../components/layout/EmptyLayout";

import "../styles.css";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function App({ Component, pageProps }: AppLayoutProps) {
  const Layout = Component.layout || EmptyLayout;

  return (
    <React.Fragment>
      <RecoilRoot>
        <Head>
          <title>Hourglass</title>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Refresh />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RecoilRoot>
    </React.Fragment>
  );
}

export default App;
