import {readFile,writeFile} from "fs/promises"
import { extractSequence } from "./parser.js";

const type=process.argv[2]
const date=process.argv[3]

if(!type||!date){
    throw new Error("Invalid Args!")
}

const getAndSaveData=async (type,date)=>{
    const rawData=await readFile(`./data/${type}-${date}.txt`,{encoding:"utf-8"});
    const parsed=extractSequence(rawData)
    await writeFile(`./inference/${type}-${date}.json`,JSON.stringify(parsed,null,2))
}

await getAndSaveData(type,date)