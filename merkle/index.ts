import xlsx from "xlsx"
import { ethers } from "ethers"
import MerkleTree from "merkletreejs"
import keccak256 from "keccak256"

const etherToWei = (ether: string) => {
    return ethers.utils.parseEther(ether).toString()
}

const convertFile = async (file: File) => {
    const fileBuffer = await file.arrayBuffer()
    const workbook = xlsx.read(fileBuffer)

    // workbook must have data sheet and types sheet
    if (!workbook.SheetNames.includes("data") || !workbook.SheetNames.includes("types")) {
        throw new Error("Workbook must have data and types sheet")
    }

    const data: Record<string, any>[] = xlsx.utils.sheet_to_json(workbook.Sheets["data"])
    const types: Record<string, any>[] = xlsx.utils.sheet_to_json(workbook.Sheets["types"])

    if (data.length === 0 || types.length === 0) {
        throw new Error("Workbook must have data and types sheet. Both must have at least one row")
    }
    // throw error if types doesn't have attribute and type columns
    if (!types.some(type => type.attribute && type.type)) {
        throw new Error("Types sheet must have attribute and type columns. Please follow the example.")
    }
    Object.keys(data[0]).forEach(key => {
        if (!types.map(t => t.attribute).includes(key)) {
            throw new Error(`Attribute ${key}'s type not found! Please specify type of ${key} in types sheet.`)
        }
    })

    return { data, types }
}

export const makeMerkleTree = async (
    file: File,
    options: { floatToBN?: boolean; exportFileName: string } = { floatToBN: true, exportFileName: "export" }
) => {
    const { data, types } = await convertFile(file)
    const { keccak256: etherKeccak, defaultAbiCoder } = ethers.utils

    const leaves = data.map(row =>
        etherKeccak(
            defaultAbiCoder.encode(
                types.map(type => type.type),
                Object.values(row).map((value: any) =>
                    parseFloat(value) > 0 && options.floatToBN ? etherToWei(value.toString()) : value
                )
            )
        )
    )

    const tree = new MerkleTree(leaves, keccak256, { sort: true })
    const tokensWithProof = data.map((row, index) => ({
        proof: tree.getHexProof(leaves[index]),
        leaf: leaves[index],
        index,
        ...Object.fromEntries(
            Object.entries(row).map(([key, value]: any) => [
                key,
                parseFloat(value) > 0 && options.floatToBN ? etherToWei(value.toString()) : value,
            ])
        ),
    }))
    const result = {
        merkleRoot: tree.getHexRoot(),
        data: tokensWithProof,
    }
    exportToJson(result, options.exportFileName)
}

export const verifyProof = (root: string, proofs: string[], data: string, types: string[]) => {
    const { keccak256: etherKeccak, defaultAbiCoder } = ethers.utils
    let computedHash = etherKeccak(defaultAbiCoder.encode(types, Object.values(JSON.parse(data))))
    proofs.forEach(proof => {
        computedHash = etherKeccak(
            computedHash < proof ? computedHash + proof.substring(2) : proof + computedHash.substring(2)
        )
    })

    return computedHash === root
}

const exportToJson = (objectData: any, fileName = "export") => {
    let filename = `${fileName || "export"}.json`
    let contentType = "application/json;charset=utf-8;"

    const a = document.createElement("a")
    a.download = filename
    a.href = "data:" + contentType + "," + encodeURIComponent(JSON.stringify(objectData))
    a.target = "_blank"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}
