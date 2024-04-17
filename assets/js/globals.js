// Step 5 Global variable are set from Step 3
let gl_pattern,gl_solutions,gl_meanings, gamecount=1, currentPage=1; // Declare a global variable
// JSON conversation data
let conversationData = {
    "conversation": [
        {
            "speaker": "ゆうた",
            "text": "はなこさん、おはようございます。"
        },
        {
            "speaker": "はなこ", 
            "text": "おはようございます、ゆうたさん。"
        },
        {
            "speaker": "ゆうた",
            "text": "はなこさんは、どこから きましたか。"
        },
        {
            "speaker": "はなこ",
            "text": "わたしは、みなみから きました。"
        },
        {
            "speaker": "ゆうた",
            "text": "へえ、みなみですか。いいですね。" 
        },
        {
            "speaker": "はなこ",
            "text": "ゆうたさんは？"
        },
        {
            "speaker": "ゆうた", 
            "text": "ぼくは、きたから きました。"
        },
        {
            "speaker": "はなこ",
            "text": "きたは、さむいですか。" 
        }, 
        {
            "speaker": "ゆうた",
            "text": "ええ、ふゆは さむいです。"
        },
        {
            "speaker": "はなこ",
            "text": "そうですか。わたしは、ひがしから にしへ りょこうしたいです。"
        },
        {
            "speaker": "ゆうた",
            "text": "いいですね。たのしいですね。"
        }
    ]
};