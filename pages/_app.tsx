import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "react-query"
import Head from "next/head"

const qc = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <QueryClientProvider client={qc}>
                <Head>
                    <title>{`Merkle Root Generator & Verifier`}</title>
                </Head>
                <Component {...pageProps} />
            </QueryClientProvider>
        </ChakraProvider>
    )
}

export default MyApp
