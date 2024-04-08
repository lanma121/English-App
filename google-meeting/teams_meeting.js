
(function(){
    let translator = 'google';

    const translatorConfig = {
        googlet: () => {
            return {
                // https://translate.googleapis.com/translate_a/t?anno=3&client=te&format=html&v=1.0&key&logld=vTE_20240320&sl=en&tl=zh-CN&tc=0&tk=572971.1048196
                url: 'https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?rpcids=AVdN8&source-path=%2F&f.sid=-531554306794997781&bl=boq_translate-webserver_20240312.05_p0&hl=en&soc-app=1&soc-platform=1&soc-device=1&_reqid=379387&rt=c',
            }
        },//https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=Hello
        google: (value) => `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${
            encodeURI(value,)
        }`,
        bing: {
            url: 'https://www.bing.com/ttranslatev3?&IG=E2680977B73848FA8BC5252FFEBF9700&IID=SERP.5626',
            data: {
                fromLang: 'en',
                to: 'zh-Hans',
                token: 'XtZFvL8c9N2oHiFYwKR9e_ymeayhNp16',
                key: '1710859737886',
                text: 'hi everyone',
                tryFetchingGenderDebiasedTranslations: true
            }
        }
    }

    const request = (url, { data = undefined, ...option } = {}) => {
        console.log(url);
        try {
            const controller = new AbortController();
            const result = new Promise(async (resolve, reject) => {
                const datas = data ? {data: JSON.stringify(data)}: {};
                const response = await fetch(url, {
                    signal: controller.signal,
                    method: data? "POST": "GET", // *GET, POST, PUT, DELETE, etc.
                    // mode: "cors", // no-cors, *cors, same-origin
                    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        //   "Content-Type": "application/json",
                        //   'Content-Type': 'application/x-www-form-urlencoded',
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                    },
                    ...option,
                    ...datas,
                    // redirect: "follow", // manual, *follow, error
                    // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                });
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                resolve(response.json());
            });
            result.controller = controller;
            return result;
        } catch (error) {
            console.error(error)
        }
    }

    const googleTranslate = async (value) => {
        const json = await request(translatorConfig.google(value));
        return json[0].map((item) => item[0]).join("");
    }

    const createEelement = (name, attributes = {}) => {
        const el = document.createElement(name);
        Object.keys(attributes).forEach((key) => {
            el.setAttribute(key, attributes[key]);
        });
        return el;
    }

    const bindEvent = (selector, events, callback, options = {}) => {
        if (!selector || !events || !callback) {
            console.error('bind event error');
        }
        const controller = new AbortController();
        setTimeout(() => {
            const dom = typeof selector === 'string' ? document.querySelector(selector) : selector;
            dom.removeEventListener(events, callback, {signal: controller.signal, ...options});
            dom.addEventListener(events, callback, {signal: controller.signal, ...options});
        }, 0);
        return controller;
    }

    const switchTranslator = () => {
        const el = createEelement('div', {id: "switchTranslator", style: ""});
        el.innerHTML = `<select defaultValue="google">
                            <option value="google">Google</option>
                            <option value="bing">Bing</option>
                            <option value="2"></option>
                            <option value="3"></option>
                            <option value="4"></option>
                        </select>`;
        bindEvent('#switchTranslator', 'change', (e) => {
            translator = e.target.value;
        });
    }

    const createContainer = () => {
        const el = createEelement('div', {id: 'myTranslator', draggable: true, style: 'position: fixed; top: 0; right: 4px;z-index: 9999; background: #fff; width: 300px; border: 1px solid blue; display: flex;'});
        const drap = createEelement('div', {style: 'width: 10px; height: 10px; position: absolute; z-index: 99999;top: 0; left: 0; background: blue; cursor: move;'});
        const ol = createEelement('textarea', {style: 'flex-grow: 1;'});
        const il = createEelement('textarea', {id: 'inputLanguage', style: 'width: 0;'});
        el.append(drap);
        el.append(il);
        el.append(ol);
        let lastContent = '';
        let lastTime = 0;
        bindEvent('#myTranslator', 'dragend', (e,b) => {
            e.target.style.left = e.pageX + 'px';
            e.target.style.top = e.pageY + 'px';
        });
        bindEvent('#inputLanguage', 'change', async(e) => {
            const value = e.target.value;
            console.log('---------',value, lastContent, new Date().getTime() - lastTime );
            // || new Date().getTime() - lastTime < 1500
            if (lastContent === value || !value) {
                return;
            }
            lastContent = value;
            lastTime = new Date().getTime();
            if (translator === 'google') {
               ol.value = await googleTranslate(value);
            }
        });
        return el;
    }

    const addStyle = () => {
        document.querySelector('#myStyle')?.remove();
        const style = createEelement('style', {id: 'myStyle', type: "text/css"});
        style.appendChild(document.createTextNode(`
            .a4cQT {
                height: 0 !important;
                width: 0 !important;
                overflow: hidden  !important;
            }
            .Mz6pEf {
                padding: 0 !important;
            }
            .iTTPOb {
                left: 0 !important;
            }
            .a4cQT .iOzk7 {
                position: fixed !important;
                left: calc(100% - 400px);
                z-index: 9 !important;
                top: 0px;
                background: black !important;
                width: 400px !important;
                height: 600px !important;
                padding: 0px !important;
                overflow: hidden !important;
                resize: both !important;
            }
        `));
        document.querySelector('head').append(style);
    }

    function init() {
        clearInterval(window.myinterval);
        // addStyle();
        document.querySelector('body #myTranslator')?.remove();
        document.querySelector('body')?.append(createContainer());
        localStorage.removeItem('ATS');
        window.myinterval = setInterval(() => {
            let contents = '';
            const speakers = document.querySelectorAll('div[aria-label="Live Captions"] .ui-box ul.ui-chat');
            for (let i=0; i<speakers.length; i++) {
                const speaker = speakers[i].querySelector('.ui-chat__messageheader')?.textContent;
                const content = speakers[i].querySelector('.ui-chat__messagecontent')?.textContent;

                if (content) {
                    contents += speaker + ': ' + content + (i+1 === speakers.length ? '' : '\n');
                }
            }
            if (!contents) return;
            
            document.querySelector('#inputLanguage').value = contents;
            document.querySelector('#inputLanguage').dispatchEvent(new Event("change"));
            // const lastContent = localStorage.getItem('ATS_last') || '';
            // localStorage.setItem('ATS_last', contents);
            // const searchstr = lastContent.slice(-10);
            // const index = contents.indexOf(searchstr) + searchstr.length;
            // const newWords = contents.slice(index);
            // if (newWords.length <10) return;
            // localStorage.setItem('ATS', (localStorage.getItem('ATS') || '') + newWords);
            // setTimeout(() => {
            //     const allContent = localStorage.getItem('ATS') || '';
            //     const searchstr = allContent.slice(-10);
            //     const index = content.indexOf(searchstr) + searchstr.length;
            //     localStorage.setItem('ATS', allContent + content.slice(index));
            // }, 0);
            
        } , 1000);
    }

    init();

})()

