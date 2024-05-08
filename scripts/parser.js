export const extractSequence = (rawData) => {
    const data = rawData
        .split("\n")
        .filter((line) => line.includes("icmp_seq") || line.includes("====="));

    let currentBlock = {};

    const allSeq = [];

    if (!data[0].includes("===")) currentBlock.start = data[0];

    for (let i = 1; i < data.length - 1; i += 1) {
        if (data[i].slice(25, 33) != data[i + 1].slice(25, 33)) {
            if (!data[i].includes("===")) {
                currentBlock.end = data[i];
                currentBlock.endIndex = i;
            }
            if (currentBlock.start) allSeq.push(currentBlock);
            currentBlock = {};
            if (!data[i + 1].includes("===")) {
                currentBlock.start = data[i + 1];
                currentBlock.startIndex = i + 1;
            }
        }
    }

    if (!data.at(-1).includes("===")) {
        const lastIndex = data.length - 1;
        currentBlock.end = data[lastIndex];
        currentBlock.endIndex = lastIndex;
        allSeq.push(currentBlock);
    }

    return allSeq
};
