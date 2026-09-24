const moment = require("moment-timezone");

function bold(text) {
    return `*${text}*`;
}

function convertMsToDuration(ms, requestedParts = null) {
    if (!ms || ms <= 0) return "0 seconds";
    const duration = moment.duration(ms);
    const hasLargerUnits = duration.asSeconds() >= 1;
    const units = {
        year: {
            value: duration.years(),
            condition: duration.years() > 0
        },
        month: {
            value: duration.months(),
            condition: duration.months() > 0
        },
        week: {
            value: duration.weeks(),
            condition: duration.weeks() > 0
        },
        day: {
            value: duration.days(),
            condition: duration.days() > 0
        },
        hour: {
            value: duration.hours(),
            condition: duration.hours() > 0
        },
        minute: {
            value: duration.minutes(),
            condition: duration.minutes() > 0
        },
        second: {
            value: duration.seconds(),
            condition: duration.seconds() > 0
        },
        millisecond: {
            value: duration.milliseconds(),
            condition: duration.milliseconds() > 0
        }
    };
    const parts = [];
    if (requestedParts && Array.isArray(requestedParts)) {
        for (const part of requestedParts) {
            if (units[part]) parts.push(`${units[part].value} ${part}`);
        }
    } else {
        for (const [unit, data] of Object.entries(units)) {
            if (unit === "millisecond") {
                if (!hasLargerUnits && data.value > 0) parts.push(`${data.value} ${unit}`);
            } else if (data.condition) {
                parts.push(`${data.value} ${unit}`);
            }
        }
    }
    return parts.length > 0 ? parts.join(" ") : "0 seconds";
}

function formatSize(byteCount, withPerSecond = false) {
    if (!byteCount) return `0 yBytes${withPerSecond ? "/s" : ""}`;
    let index = 8;
    let size = byteCount;
    const bytes = ["yBytes", "zBytes", "aBytes", "fBytes", "pBytes", "nBytes", "µBytes", "mBytes", "Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    while (size < 1 && index > 0) {
        size *= 1024;
        index--;
    }
    while (size >= 1024 && index < bytes.length - 1) {
        size /= 1024;
        index++;
    }
    return `${size.toFixed(2)} ${bytes[index]}${withPerSecond ? "/s" : ""}`;
}

function generateCmdExample(used, args) {
    if (!used || !args) return `Incomplete arguments.`;
    return `Example: ${inlineCode(`${used.prefix + used.command} ${args}`)}`;
}

function generateInstruction(actions, mediaTypes) {
    if (!actions || !mediaTypes || !Array.isArray(actions) || !Array.isArray(mediaTypes)) return `Invalid arguments.`;
    const mediaTypeTranslations = {
        audio: "audio",
        document: "document",
        image: "image",
        sticker: "sticker",
        text: "text",
        video: "video",
        viewOnce: "view once"
    };
    const translatedMediaTypeList = mediaTypes.map(type => mediaTypeTranslations[type]);
    let mediaTypesList;
    if (translatedMediaTypeList.length > 1) {
        const lastMediaType = translatedMediaTypeList[translatedMediaTypeList.length - 1];
        mediaTypesList = `${translatedMediaTypeList.slice(0, -1).join(", ")} or ${lastMediaType}`;
    } else {
        mediaTypesList = translatedMediaTypeList[0];
    }
    const actionTranslations = {
        send: "Send",
        reply: "Reply"
    };
    const instructions = actions.map(action => `${actionTranslations[action]}`);
    const actionList = instructions.join(actions.length > 1 ? "/" : "");
    return info(`${actionList} ${mediaTypesList}.`);
}

function generatesFlagInfo(flags) {
    if (!flags || typeof flags !== "object") return `Invalid flag.`;
    return "Flag:\n" +
        Object.entries(flags).map(([flag, description]) => `- ${inlineCode(flag)}: ${description}`).join("\n");
}

function generateNotes(notes) {
    if (!notes || !Array.isArray(notes)) return `Invalid notes.`;
    return "Notes:\n" +
        notes.map(note => `- ${note}`).join("\n");
}

function info(text) {
    return `ⓘ ${italic(text)}`;
}

function inlineCode(text) {
    return `\`${text}\``;
}

function italic(text) {
    return `_${text}_`;
}

function monospace(text) {
    return `\`\`\`${text}\`\`\``;
}

function quote(text) {
    return `> ${text}`;
}

function strikethrough(text) {
    return `~${text}~`;
}

function ucwords(text) {
    if (!text) return null;
    return text.toLowerCase().replace(/\b\w/g, (txt) => txt.toUpperCase());
}

module.exports = {
    bold,
    convertMsToDuration,
    formatSize,
    generateCmdExample,
    generateInstruction,
    generatesFlagInfo,
    generateNotes,
    info,
    inlineCode,
    italic,
    monospace,
    quote,
    strikethrough,
    ucwords
};