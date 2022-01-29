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
    const [exportFileName, setExportFileName] = useState("export")
    const [convertFloatToBN, setConvertFloatToBN] = useState(true)

    const process = async () => {
        if (!file) return
        try {
            await makeMerkleTree(file, { exportFileName, floatToBN: convertFloatToBN })
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
        exportFileName,
        setExportFileName,
    }
}

export default useGenerator
