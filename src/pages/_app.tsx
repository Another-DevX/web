import { AppProps } from 'next/app';
import { Content, GlobalStyle, Main } from '../theme/components';
import { CeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import {
    CookieConsent,
    Footer,
    Header,
    ImpactMarketDaoProvider,
    Loading,
    SEO
} from '../components';
import { DataProvider } from '../components/DataProvider/DataProvider';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ModalManager, modal } from 'react-modal-handler';
import { PrismicDataProvider } from '../lib/Prismic/components/PrismicDataProvider';
import { ThemeProvider } from 'styled-components';
import { TranslationProvider } from '../components/TranslationProvider/TranslationProvider';
import { modals } from '../modals';
import { pageview } from '../lib/gtag';
import ErrorPage from 'next/error';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Toaster from '../components/Toaster/Toaster';
import config from '../../config';
import theme from '../theme';
import useFilters from 'src/hooks/useFilters';

const { baseUrl, isProduction, recaptchaKey } = config;

Router.events.on('routeChangeComplete', (url) => pageview(url));
Router.events.on('hashChangeComplete', (url) => pageview(url));

export default function App(props: AppProps) {
    const { Component, pageProps, router } = props as any;
    const { asPath, isReady, locale, query } = router;
    const url = `${baseUrl}/${locale}${asPath}`;
    const { getByKey } = useFilters();
    const [showSpinner, setShowSpinner] = useState(true);

    const {
        data,
        footerOptions = {},
        meta = {},
        page,
        statusCode,
        wip
    } = pageProps as any;

    useEffect(() => {
        if (isReady) {
            // eslint-disable-next-line no-underscore-dangle
            window.__localeId__ = locale;

            const handleRouteChange = () => {
                setShowSpinner(true);
            };

            const handleRouteComplete = () => {
                setShowSpinner(false);
            };

            router.events.on('routeChangeStart', handleRouteChange);
            router.events.on('routeChangeComplete', handleRouteComplete);

            router.events.on('hashChangeStart', handleRouteChange);
            router.events.on('hashChangeComplete', handleRouteComplete);

            return () => {
                setShowSpinner(true);

                router.events.off('routeChangeStart', handleRouteChange);
                router.events.on('routeChangeComplete', handleRouteComplete);

                router.events.off('hashChangeStart', handleRouteChange);
                router.events.on('hashChangeComplete', handleRouteComplete);
            };
        }
    }, [isReady, locale, router.events]);

    if (!page || (wip && isProduction)) {
        return <ErrorPage statusCode={wip ? 404 : statusCode} />;
    }

    if (query?.contribute === 'true') {
        meta.image = 'https://impactmarket.com/img/share-governance.jpg';
        meta['image:height'] = 1080;
        meta['image:width'] = 1080;
    }

    useEffect(() => {
        if (asPath.includes('modal')) {
            // @ts-ignore
            modal.open(getByKey('modal'));
        }
    }, [asPath]);

    return (
        <DataProvider page={page} url={url}>
            <CeloProvider
                dapp={{
                    icon: '',
                    name: 'My awesome dApp',
                    description: 'My awesome description',
                    url: 'https://example.com',
            
                }}
            >
                <PrismicDataProvider data={data} page={page} url={url}>
                    <TranslationProvider locale={locale}>
                        <Head>
                            <meta
                                content="width=device-width, initial-scale=1"
                                name="viewport"
                            />
                            <meta content="#2362FB" name="theme-color" />
                            <link rel="manifest" href="/manifest.json" />
                            <link
                                rel="apple-touch-icon"
                                href="/img/icons/icon-96x96.png"
                            />
                            <meta
                                name="apple-mobile-web-app-status-bar"
                                content="#90cdf4"
                            />
                            <script type="text/javascript">
                                {`(function(c,l,a,r,i,t,y){
                            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                        })(window, document, "clarity", "script", "hiriq2fzcz");`}
                            </script>
                        </Head>
                        <SEO meta={meta} />
                        <ThemeProvider theme={theme}>
                            <GlobalStyle />
                            <GoogleReCaptchaProvider
                                reCaptchaKey={recaptchaKey}
                            >
                                <Loading isActive={showSpinner} />
                                <Toaster />
                                <Main>
                                    <ImpactMarketDaoProvider>
                                        <ModalManager modals={modals} />
                                        <Header />
                                        <Content>
                                            <Component {...pageProps} />
                                        </Content>
                                        <Footer {...footerOptions} />
                                    </ImpactMarketDaoProvider>
                                </Main>
                                <CookieConsent />
                            </GoogleReCaptchaProvider>
                        </ThemeProvider>
                    </TranslationProvider>
                </PrismicDataProvider>
            </CeloProvider>
        </DataProvider>
    );
}
