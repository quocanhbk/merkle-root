import { useToast } from "@chakra-ui/react"
import { useState } from "react"
import { ethers } from "ethers"
import { makeMerkleTree } from "../merkle"

const useGenerator = () => {
    const toast = useToast({
        duration: 3000,
        position: "bottom",
    })
    const [file, setFile] = useState<File | null>(null)
    const [convertFloatToBN, setConvertFloatToBN] = useState(true)

    const process = async () => {
        if (!file) return
        try {
            await makeMerkleTree(file)
            setFile(null)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message,
                status: "error",
            })
        }
    }

    return {
        file,
        setFile,
        process,
        convertFloatToBN,
        setConvertFloatToBN,
    }
}

export default useGenerator
