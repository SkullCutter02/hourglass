import React, { useRef } from "react";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { ReactQueryDevtools } from "react-query/devtools";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import Refresh from "../components/Refresh";
import PageWithLayoutType from "../components/layout/PageWithLayoutType";
import EmptyLayout from "../components/layout/EmptyLayout";

import "../styles.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

type AppLayoutProps = {
  Component: PageWithLayoutType;
  pageProps: any;
};

function App({ Component, pageProps }: AppLayoutProps) {
  const Layout = Component.layout || EmptyLayout;

  const queryClientRef = useRef<QueryClient>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <RecoilRoot>
            <Head>
              <title>Hourglass</title>
              <link rel="preconnect" href="https://fonts.gstatic.com" />
              <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet"
              />
            </Head>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Refresh />
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <ReactQueryDevtools />
            </MuiPickersUtilsProvider>
          </RecoilRoot>
        </Hydrate>
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
