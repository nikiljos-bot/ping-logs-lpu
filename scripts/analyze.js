import { readFile, writeFile } from "fs/promises";
import { analyzeSequence, extractSequence, generateMdHeader, generateMdTable } from "./parser.js";

const type = process.argv[2];
const date = process.argv[3];

if (!type || !date) {
    throw new Error("Invalid Args!");
}

const getAndSaveData = async (type, date) => {
    const rawData = await readFile(`./data/${type}-${date}.txt`, { encoding: "utf-8" });
    const sequence = extractSequence(rawData);
    const finalData = analyzeSequence(sequence);
    const mdTable = generateMdTable(finalData.reverse());
    const finalMarkdown = generateMdHeader(type, date, finalData.reverse()) + mdTable;
    await writeFile(`./inference/${type}-${date}.json`, JSON.stringify(finalData, null, 2));
    await writeFile(`./inference/${type}-${date}.md`, finalMarkdown);
};

await getAndSaveData(type, date);
