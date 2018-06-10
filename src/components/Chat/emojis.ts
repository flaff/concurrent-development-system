export const
    emojiMap = {
        ":D": "😀",
        ";)": "😉",
        ":)": "🙂",
        "B)": "😎",
        ":(": "🙁",
        ";(": "😭",
    },

    emojis = Object.keys(emojiMap).map(key => emojiMap[key]),

    isAnEmojiOnly = (string) => emojis.indexOf(string) !== -1,

    addEmojis = (string) => {
        Object.keys(emojiMap).forEach((key) => string = string.replace(key, emojiMap[key]));
        return string;
    };
