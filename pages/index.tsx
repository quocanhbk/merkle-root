import { Box, Button, Checkbox, Flex, Heading, Input, Stack, Text, Textarea, Tooltip } from "@chakra-ui/react"
import type { NextPage } from "next"
import { BsInfoCircleFill } from "react-icons/bs"
import { UploadInput } from "../components"
import FormControl from "../components/FormControl"
import useGenerator from "../hooks/useGenerator"
import useVerify from "../hooks/useVerify"

const Home: NextPage = () => {
    const { file, setFile, process, convertFloatToBN, setConvertFloatToBN, exportFileName, setExportFileName } =
        useGenerator()
    const { values, setValue, isDisabled, isValid, handleVerify } = useVerify()

    const prettifyJSON = (json: string) => {
        return JSON.stringify(JSON.parse(json), null, 2)
    }

    return (
        <Stack direction={["column", "row"]} h="full" justify="center" p={4} py={16} spacing={16}>
            <Box w="full" maxW="32rem">
                <Heading mb={8} color="green.500">
                    Generator
                </Heading>
                <FormControl label="Input file">
                    <UploadInput
                        label="File"
                        file={file}
                        onSubmit={setFile}
                        inputProps={{
                            accept: ".xlsx",
                        }}
                    />
                    <Checkbox
                        colorScheme={"green"}
                        isChecked={convertFloatToBN}
                        onChange={e => setConvertFloatToBN(e.target.checked)}
                        mt={2}
                    >
                        <Flex align="center">
                            Convert ETH to Wei
                            <Tooltip label="Convert ETH type to wei in exported file">
                                <Box ml={2}>
                                    <BsInfoCircleFill />
                                </Box>
                            </Tooltip>
                        </Flex>
                    </Checkbox>
                </FormControl>
                <FormControl label="Export file name">
                    <Input value={exportFileName} onChange={e => setExportFileName(e.target.value)} />
                </FormControl>
                <Button colorScheme={"green"} w="full" mt={4} onClick={process} isDisabled={!file}>
                    Process
                </Button>

                <FormControl label="Example input file" mt={4}>
                    <a href="/data.xlsx">
                        <Text color="blue.500" fontWeight={"semibold"} cursor="pointer">
                            data.xlsx
                        </Text>
                    </a>
                </FormControl>
            </Box>
            <Box w="full" maxW="32rem">
                <Heading mb={8} color="orange.500">
                    Verifier
                </Heading>
                <FormControl label="Tree root">
                    <Input
                        type="text"
                        placeholder="Example: 0x7805a5e18e093fe163bfe931898304d284472ce8cc4692942954fb1ac0af1a20"
                        values={values.root}
                        onChange={e => setValue("root", e.target.value)}
                        fontSize={"xs"}
                        fontFamily={"monospace"}
                    />
                </FormControl>
                <FormControl label="Proofs">
                    <Textarea
                        value={values.proofs}
                        onChange={e => setValue("proofs", e.target.value)}
                        onBlur={() => {
                            setValue("proofs", prettifyJSON(values.proofs))
                        }}
                        fontSize={"xs"}
                        fontFamily={"monospace"}
                        placeholder={`Example: \n${prettifyJSON(`[
                            "0xad196729f283eb43a47934888821c8982661785703e77a8794b0f07d0e4d7142",
                            "0x615122da60fe4d194aaa03214a72d159dacf359d88e6041e33218fad908cda30",
                            "0x97a694534f1efe9c8b66479aebbc034018bb05e2faceccd398901421d589c935"
                        ]`)}`}
                        h="8rem"
                    />
                </FormControl>
                <FormControl label="Data">
                    <Textarea
                        value={values.data}
                        onChange={e => setValue("data", e.target.value)}
                        onBlur={() => {
                            setValue("data", prettifyJSON(values.data))
                        }}
                        fontSize={"xs"}
                        fontFamily={"monospace"}
                        placeholder={`Example: \n${prettifyJSON(`{
                            "publicAddress": "0x7Af6f70217108AfE82983145db6B4F82C8Ef598F",
                            "amount": "100000000000000000000"
                          }`)}`}
                        h="8rem"
                    />
                </FormControl>
                <FormControl label="Type of each data attribute (separated by comma)">
                    <Input
                        placeholder="Example: address, uint256"
                        value={values.types}
                        onChange={e => setValue("types", e.target.value)}
                        fontSize={"xs"}
                        fontFamily={"monospace"}
                    />
                </FormControl>
                <Button colorScheme={"orange"} w="full" mt={4} onClick={handleVerify} isDisabled={isDisabled}>
                    Verify
                </Button>
                <Box mt={4}>
                    {isValid !== null &&
                        (isValid === true ? (
                            <Text fontSize={"xl"} color="green.500" fontWeight={"bold"}>
                                Proofs is valid
                            </Text>
                        ) : (
                            <Text fontSize={"xl"} color="red.500" fontWeight={"bold"}>
                                Proof is invalid
                            </Text>
                        ))}
                </Box>
            </Box>
        </Stack>
    )
}

export default Home
