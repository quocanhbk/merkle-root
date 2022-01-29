import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "react-query"

const qc = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <QueryClientProvider client={qc}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </ChakraProvider>
    )
}

export default MyApp
