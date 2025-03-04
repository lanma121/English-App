// Request URL: https://api1.sider.ai/api/v3/completion/text
// Request Method: POST
// Status Code: 200 OK
// Remote Address: 127.0.0.1:9001
// Referrer Policy: strict-origin-when-cross-origin

// Response Header
// access-control-allow-origin: *
// cache-control: no-cache
// cf-cache-status: DYNAMIC
// cf-ray: 9133d28c3b58fc18-IAD
// connection: keep-alive
// content-type: text/event-stream
// date: Mon, 17 Feb 2025 06:46:59 GMT
// referrer-policy: no-referrer-when-downgrade
// server: cloudflare
// strict-transport-security: max-age=31536000; includeSubDomains
// transfer-encoding: chunked
// vary: Accept-Encoding
// x-content-type-options: nosniff
// x-response-time: 10009 ms
// x-xss-protection: 1; mode=block

// Request Header
// accept: */*
// accept-encoding: gzip, deflate, br, zstd
// accept-language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7
// authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDE1ODgxNSwicmVnaXN0ZXJfdHlwZSI6Im9hdXRoMiIsImFwcF9uYW1lIjoiQ2hpdENoYXRfQ2hyb21lX0V4dCIsInRva2VuX2lkIjoiZTg0NWI5OTctNWE5MC00MWRhLTg0NjQtYTA5NTk1NDU0M2E5IiwiaXNzIjoic2lkZXIuYWkiLCJhdWQiOlsiIl0sImV4cCI6MTc2MjU5MTkzOCwibmJmIjoxNzMxNDg3OTM4LCJpYXQiOjE3MzE0ODc5Mzh9.idrtSqZWoVRnmOATmlQu00B4jx9ccjMI-Cu5nk5tdIk
// cache-control: no-cache
// connection: keep-alive
// content-length: 1482
// content-type: application/json
// cookie: lang=en; _uetvid=01bbc8a0a19a11ef972e13d0df13fcc1; token=Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDE1ODgxNSwicmVnaXN0ZXJfdHlwZSI6Im9hdXRoMiIsImFwcF9uYW1lIjoiQ2hpdENoYXRfQ2hyb21lX0V4dCIsInRva2VuX2lkIjoiZTg0NWI5OTctNWE5MC00MWRhLTg0NjQtYTA5NTk1NDU0M2E5IiwiaXNzIjoic2lkZXIuYWkiLCJhdWQiOlsiIl0sImV4cCI6MTc2MjU5MTkzOCwibmJmIjoxNzMxNDg3OTM4LCJpYXQiOjE3MzE0ODc5Mzh9.idrtSqZWoVRnmOATmlQu00B4jx9ccjMI-Cu5nk5tdIk; refresh_token=discard; userinfo-avatar=https://chitchat-avatar.s3.amazonaws.com/ed2c0ab935184786adbb78fca06ba0b4-1714031328.png; userinfo-name=tyler%20liu; userinfo-type=oauth2
// host: api1.sider.ai
// origin: chrome-extension://difoiogjjojoaoomphldepapgpbgkhkb
// pragma: no-cache
// sec-fetch-dest: empty
// sec-fetch-mode: cors
// sec-fetch-site: none
// sec-fetch-storage-access: active
// user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36

// import { request } from '../nodejs/request.mjs';

const sider = {};
sider.prompt = {
    background: 'I am a software developer working on time attendance systems.',
    summarize: (content, background = '', lang = 'chinese') => background + " You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the text delimited by triple quotes and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. Please avoid unnecessary details or tangential points.\nOnly give me the output and nothing else. Do not wrap responses in quotes. Respond in the " + lang + " language.\n\"\"\"\n" + content + "\n\"\"\"",
    answer: (content, background = '', lang = 'en') => background + ' Use simple and clear language to answer the following question or content.\nDo not translate the question.\nDo not wrap responses in quotes.\n\n\"\"\"\n"'+content+'\n\"\"\"\n\nRespond in ' + lang,
    answerEX: (content, background = '', lang = 'en') => background + ' Summarize key questions from the following content and provide example answers.\nUse simple and clear language to answer.\n\n\"\"\"\n"'+content+'\n\"\"\"\n\nRespond in ' + lang,
    answerOK: (content, background = '', lang = 'en') => background + ' Use positive, straightforward, and clear language to answer the following question or content.\n\n\"\"\"\n"'+content+'\n\"\"\"\n\nRespond in ' + lang,
    answerNO: (content, background = '', lang = 'en') => background + ' Use clear and negative to answer the following question or content.\n\n\"\"\"\n"'+content+'\n\"\"\"\n\nRespond in ' + lang,
    explain: (content, background = '', lang = 'chinese') => background + 'Please explain clearly and concisely in '+ lang +' : \"\"\"' + content + '\"\"\"',
    improve: (content, background = '', lang = 'en') => background + "Rewrite the following text, which will be delimited by triple quotes, to be more concise and well-written while preserving the original meaning:\n\n\"\"\""+ content+"\"\"\"\n\nProvide only the rewritten text as your output, without any quotes or tags. Respond in the same language as the original text."
}

sider.model = {
    "gpt-4o-mini": "gpt-4o-mini",
    "claude-3.5-haiku": "claude-3.5-haiku",
    "gemini-2.0-flash": "gemini-2.0-flash",
    "deepseek-v3": "deepseek-chat",
    "deepseek-r1": "deepseek-r1-distill-llama-70b"
}

const data = {
    "prompt": "hi",
    "stream": true,
    "app_name": "ChitChat_Chrome_Ext",
    "app_version": "4.41.0",
    "tz_name": "Asia/Shanghai",
    "cid": "C05ZSB48XJZ0",
    "model": "sider",
    "search": false,
    "auto_search": false,
    "filter_search_history": false,
    "from": "chat",
    "group_id": "default",
    "chat_models": [],
    "tools": {
        "auto": []
    },
    "extra_info": {
        "origin_url": "https://meet.google.com/",
        "origin_title": "Google Meet"
    },
    "parent_message_id": "CM0A4U55KGLAD",
    "branch": true
};

sider.run = async (prompt, option = {}) => {
    const result = await utils.request('https://api1.sider.ai/api/v3/completion/text', {
        headers: {
            'Content-Type': 'application/json',
            'origin': 'chrome-extension://difoiogjjojoaoomphldepapgpbgkhkb',
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMDE1ODgxNSwicmVnaXN0ZXJfdHlwZSI6Im9hdXRoMiIsImFwcF9uYW1lIjoiQ2hpdENoYXRfQ2hyb21lX0V4dCIsInRva2VuX2lkIjoiZTg0NWI5OTctNWE5MC00MWRhLTg0NjQtYTA5NTk1NDU0M2E5IiwiaXNzIjoic2lkZXIuYWkiLCJhdWQiOlsiIl0sImV4cCI6MTc2MjU5MTkzOCwibmJmIjoxNzMxNDg3OTM4LCJpYXQiOjE3MzE0ODc5Mzh9.idrtSqZWoVRnmOATmlQu00B4jx9ccjMI-Cu5nk5tdIk'
        },
        data: Object.assign({}, data, option, { prompt })
    });

    return result;
}

sider.summarize = async (content, { background = sider.prompt.background, lang, ...option } = {}) => {
    return sider.run(sider.prompt.summarize(content, background, lang), { "prompt_key": "summarize", ...option});
}

sider.answer = async (content, { background = sider.prompt.background, lang, type, ...option } = {}) => {
    return sider.run(sider.prompt[type](content, background, lang), { "prompt_key": "answer_this_question", ...option});
}

sider.explain = async (content, { background = sider.prompt.background, lang, ...option } = {}) => {
    return sider.run(sider.prompt.explain(content, background, lang), { "prompt_key": "explain_this", ...option});
}

sider.improve = async (content, { background = sider.prompt.background, lang, ...option } = {}) => {
    return sider.run(sider.prompt.summarize(content, background, lang), { "prompt_key": "improve_writing", ...option});
}
