import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";

import "../styles.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>Hourglass</title>
      </Head>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default App;
