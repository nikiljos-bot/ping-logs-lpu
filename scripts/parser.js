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

    return allSeq;
};

export const analyzeSequence = (sequence) =>
    sequence.map((elt) => {
        const type = elt.start?.includes("bytes from") ? "up" : "down";
        const len = elt.endIndex - elt.startIndex + 1;
        const start = elt.start?.split(" | ")[0];
        const end = elt.end?.split(" | ")[0];
        const duration = (new Date(end) - new Date(start)) / 1000 + 1;

        return {
            type,
            start,
            end,
            duration,
            len,
        };
    });

const toFixedIfNecessary = (value, dp) => {
    return +value.toFixed(dp);
};

const convertSecondsToTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = toFixedIfNecessary(seconds % 60, 2);

    let timeString = "";
    if (hours > 0) {
        timeString += hours + "h ";
    }
    if (minutes > 0 || hours > 0) {
        timeString += minutes + "m ";
    }
    timeString += remainingSeconds + "s";

    return timeString;
};

export const generateMdTable = (data) => {
    const header = ["Status", "Start", "End", "Duration", "Packets"];
    const seperator = Array(header.length).fill("----");
    const dataRows = data.map((elt) => [
        elt.type == "up" ? "🟢" : "🔴",
        elt.start,
        elt.end,
        convertSecondsToTime(elt.duration),
        elt.len,
    ]);

    const allRows = [header, seperator, ...dataRows].map((elt) => elt.join(" | "));

    return allRows.join("\n");
};

const analyzeDropSequence = (data) => {
    let maxSoFar = {
        duration: 0,
    };
    let totalDropDuration = 0;
    let dropCount = 0;
    let packetLoss = 0;

    data.forEach((elt) => {
        if (elt.type == "down") {
            if (elt?.duration > maxSoFar?.duration) maxSoFar = elt;
            totalDropDuration += elt?.duration || 0;
            dropCount += 1;
            packetLoss += elt?.len || 0;
        }
    });

    return {
        longestDrop: maxSoFar,
        dropCount,
        averageDuration: totalDropDuration / dropCount,
        packetLoss,
        totalDropDuration,
    };
};
export const generateMdHeader = (type, date, data) => {
    const dropInfo = analyzeDropSequence(data);

    return `
## ${date} - ${type}

### Longest Drop

| Duration | ${convertSecondsToTime(dropInfo.longestDrop.duration)} |
| ---- | ---- |
| From | ${dropInfo.longestDrop.start} |
| To | ${dropInfo.longestDrop.end} |

### Overall Downtime

| Average Downtime | ${convertSecondsToTime(dropInfo.averageDuration)} |
| ---- | ---- |
| No. of Drop Sequences | ${dropInfo.dropCount} |
| Total Downtime | ${convertSecondsToTime(dropInfo.totalDropDuration)} |
| No. of Packets missed | ${dropInfo.packetLoss} |


---------

`;
};
