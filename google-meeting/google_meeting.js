
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

    function init() {
        clearInterval(window.myinterval);
        // const date = new Date().toDateString().replace(' ', '_');
        document.querySelector('body #myTranslator')?.remove();
        document.querySelector('body')?.append(createContainer());
        localStorage.removeItem('ATS');
        if (!document.querySelector('.IjxGeb .XTMph')?.textContent.includes('Recording')) {
            const close = createEelement('i', {style: 'margin-left: 10px; padding: 0 4px 0 2px; background: red; color: white; '});
            const tooltips = createEelement('div', {id: 'mytooltips', style: 'padding: 10px; position: absolute; z-index: 99999;top: 20px; left: 50%; background: yellow; color: red;'});
            tooltips.textContent = 'please record video';
            close.textContent="X";
            tooltips.append(close);
            document.querySelector('body').append(tooltips);
            bindEvent('#mytooltips i', 'click', () => {
                document.querySelector('#mytooltips').remove();
            });
        }
        bindEvent('body .Tmb7Fd button[aria-label="Leave call"]', 'mousedown', (e) => {
            if (document.querySelector('.IjxGeb .XTMph')?.textContent.includes('Recording')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                alert('please close record');
                return false;
            }
        });
        window.myinterval = setInterval(() => {
            let contents = '';
            const speakers = document.querySelectorAll('.iOzk7 > div.TBMuR');
            for (let i=0; i<speakers.length; i++) {
                const contentEles = speakers[i].children;
                const speaker = contentEles[0]?.textContent;
                const content = contentEles[1]?.textContent;
                console.log()

                if (content) {
                    contents += speaker + ': ' + content + (i+1 === speakers.length ? '' : '\n');
                }
            }
            if (!contents) return;
            document.querySelector('#inputLanguage').value = contents;
            document.querySelector('#inputLanguage').dispatchEvent(new Event("change"));
            const lastContent = localStorage.getItem('ATS_last') || '';
            localStorage.setItem('ATS_last', contents);
            const searchstr = lastContent.slice(-10);
            const index = contents.indexOf(searchstr) + searchstr.length;
            const newWords = contents.slice(index);
            // if (newWords.length <10) return;
            localStorage.setItem('ATS', (localStorage.getItem('ATS') || '') + newWords);
            // setTimeout(() => {
            //     const allContent = localStorage.getItem('ATS') || '';
            //     const searchstr = allContent.slice(-10);
            //     const index = content.indexOf(searchstr) + searchstr.length;
            //     localStorage.setItem('ATS', allContent + content.slice(index));
            // }, 0);
            
        } , 1000);
    }

    init();

    const websocket = (url) => {
        // 创建一个WebSocket对象，指定服务器的URL
        const socket = new WebSocket(url);
    
        // 当连接建立时触发
        socket.onopen = function(event) {
            console.log('WebSocket连接已建立');
            
            // 向服务器发送消息
            // socket.send('Hello, server!');
        };
    
        // 当接收到消息时触发
        socket.onmessage = function(event) {
            console.log('接收到服务器消息:', event.data);
        };
    
        // 当连接关闭时触发
        socket.onclose = function(event) {
            console.log('WebSocket连接已关闭');
        };
    
        // 当连接发生错误时触发
        socket.onerror = function(error) {
            console.error('WebSocket连接错误:', error);
        };
    
    }

    const testGPT = () => {

        request('https://chat.openai.com/backend-api/conversation', {
            data: {
                "action": "next",
                "messages": [
                    {
                        "id": "7e298833-8bc0-4661-bf5e-01ecd9580321",
                        "author": {
                            "role": "user"
                        },
                        "content": {
                            "content_type": "text",
                            "parts": [
                                "js websocket "
                            ]
                        },
                        "metadata": {}
                    }
                ],
                "conversation_id": "7e298833-8bc0-4661-bf5e-01ecd9580321",
                "parent_message_id": "ba1b8b87-3a4e-43bc-93dd-1cdd099f4d93",
                "model": "text-davinci-002-render-sha",
                "timezone_offset_min": -480,
                "suggestions": [],
                "history_and_training_disabled": false,
                "conversation_mode": {
                    "kind": "primary_assistant",
                    "plugin_ids": null
                },
                "force_paragen": false,
                "force_rate_limit": false,
                "websocket_request_id": "b07df427-13a3-4409-89ac-66673294d980"
            },
            headers: {
                "Oai-Device-Id": "2b607235-5d04-473b-a57b-56dccf58de90",
                "Oai-Language": "en-US",
                "Openai-Sentinel-Chat-Requirements-Token": "gAAAAABmCWjTL2MlnLuhkdCmFhMysxmMp9VGY4VP3_vWlrQop082FXZ6FHzVA628eu1Lk57auO1o-0_l35Et8Ut_g9Si_i4zUyEVr1Y7JGnpVyyH7Jv3Xlvewlv0x1gbdKdT3J-SJgO4qhXp5x0X2F0XStfCuc6JDof5Jt5fPyQVFbbn7Ul_jJmJ8HD-eef28FX807HDIrTe7sH0msprsvjtlwZP_23UpoFUNMISTxQQw9tQg7E9gssnB6SbUWsfsjsluCSlcuXHOdINX4r5EZ2qeenuF1rMjA==", //"gAAAAABl_FOAqzswnKcUMbdelSslllG1n-F75nGM-e-gystbDOzCowzxM1vrmgRafSQkzyEAOFwBkjYIC4J3RsVTDoWc_gnoLTxqF3kOykyqymRLAJDyAi5y4yhhmPz7HdAb3EFdNLYzQZRTmOB5gG_ky4yBVcBmimOUv3WhYBM3yNFyM1LxPr_R-fqjYegWb1maiIdDzx6mcFOc6AlED5ISGpikeO54Xt0SIxYtIVCxxfBcQXH-FsRPWnC9wqH1KMR3bn3UrCcHHZfgCFicMntAS77wxxiQzA==",
                Origin: "https://chat.openai.com",
                Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiI3ODY3MTY1OTdAcXEuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJodHRwczovL2FwaS5vcGVuYWkuY29tL2F1dGgiOnsicG9pZCI6Im9yZy12Ym1Qc1g3TWtRcU92VXJDRTBTUHJad1ciLCJ1c2VyX2lkIjoidXNlci0xdHpwdldWR0RRY1BBOFFDYkNCbnluZXQifSwiaXNzIjoiaHR0cHM6Ly9hdXRoMC5vcGVuYWkuY29tLyIsInN1YiI6IndpbmRvd3NsaXZlfGE4ZGQ4MmY0ZDY1MmI5ZGUiLCJhdWQiOlsiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS92MSIsImh0dHBzOi8vb3BlbmFpLm9wZW5haS5hdXRoMGFwcC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzEwNzUwMTYwLCJleHAiOjE3MTE2MTQxNjAsImF6cCI6IlRkSkljYmUxNldvVEh0Tjk1bnl5d2g1RTR5T282SXRHIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBtb2RlbC5yZWFkIG1vZGVsLnJlcXVlc3Qgb3JnYW5pemF0aW9uLnJlYWQgb3JnYW5pemF0aW9uLndyaXRlIG9mZmxpbmVfYWNjZXNzIn0.CX3QXtyv4LZvUKlyph2bGmn9bkqRK6uDkSbcNdp6q_9q6i_UdFA9ui-SYzVuvPCQIkl4_0C5xI_EW0qEFbghurfvW0tER2ddidAHf_GgM2OBbuHvK-ELJ_hhO-ggjMXK1ylzqO3o9pxpTeUxRk7RoTGmAAv3z1S60rIcHmYHZRV4Z6rO1frHlxbOaaqJLNnFxE3AVmP6fZmZgCmEcLbPmhmPuSdoTga7ld5K7Vv-q1pO1zJ6DBbiFSDVd-pqPwcTwiUeW6Ft39Izx1gEWXlh9l7uyT0bm9TEwoAVyTMbjCwEeVpCoyy_A-xz1jIcnI7ARaDK8LwLX4kmOYfCe5mQvw",
                Cookie: "__Host-next-auth.csrf-token=7abd6f1e38da5f1052d7fbc45bee0214ca7beb719f295e95c8594ec8523a4a21%7Cdaed0b05d56bf6176f473a7502828b3cab0e6fb3c8e09404c8ce9d3e4956fbc5; intercom-device-id-dgkjq2bp=e8f84038-a064-468b-ad1a-1a54697e6c76; oai-did=2b607235-5d04-473b-a57b-56dccf58de90; _cfuvid=98D6qLx2mKH5HCEiFM7LGhzw8XM66vObGRvzBgauSGI-1711885515349-0.0.1.1-604800000; _cfuvid=mInnBnYeConZLYVxcOMZU2nawOEfo3CjVbei4U06ua4-1711885727036-0.0.1.1-604800000; cf_clearance=9RvzrEyCy0pb.pZpQ5uwwDv2TJuQtHvkX32TPNGgr.4-1711885830-1.0.1.1-mO.IW07XhEpXQ2uImrvJa8eR6yZV8IE0lV7XQ5QTpEtxJg3aoW43hmopMQdMT7tbW6xYsXifttRGlwmLwzdwnA; __Secure-next-auth.callback-url=https%3A%2F%2Fchat.openai.com; cf_clearance=W79pzDcnPdCRVWmWsVyyQyGP95d85ZhEs2.cN5_2BOA-1711889736-1.0.1.1-N8.4TumkYm4jr3Qdf3Sk7cKh8gdLy0xsXYY51s_7gVB2DhfT__33I4Sn_B8huRP6J4qaMMI.1tTgdUiFWktzOw; ajs_user_id=user-7S2Qwfua7PQFshcQRDgbfLTT; ajs_anonymous_id=0478e0e6-e603-41f4-aff2-5570cccd0f92; __cf_bm=jDcxjSFSDHkiLf5hzKlGk.z80XEnWFze1HiMVmSzkv8-1711891143-1.0.1.1-JiSPT3ZnEMrjP2hd5yVRJAPLwjxjBJ3QBzGjfs1R91p7wp_0rjkJFX_cq38modMZN5mq8TWva7eIE.OUPFZh.A; intercom-session-dgkjq2bp=S0ExU2JIcUs2MmhSeCtqL1k2OXo4SVVDRjh1Y29SU09QMFJyRElZTkdaVGttZWY5ZHJSWGRwYlB5KzFHNG55dC0teGdvcDlPWkcxUCs4dGppOGJMOHk4QT09--65276cca79f4fc376c2c6b2821bf905475df9ac5; __cflb=0H28vVfF4aAyg2hkHFTZ1MVfKmWgNcKEuU9iLUEBPx1; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..oxssHsO_eacP_sE8.Nd8g9f-lBzLQ_WMCR6D3FGScAfiOk9tdwAS7iDtz82lv9g8c-D3LnEVIxAlc1Ld_pWBj4kFVNbc2D9gi-BNzhkrRf_MqFHdewIKdg_LyYvUVahOSnk1SC8HphxFj2VnD3Tlo4yJzLZCcIut8aeP9xSUvfua18NpJj2ffWzz-w7B6mbdT1TyKfT80pzTvz5UezbSC54bN5vqewxaLu7Uu0ps961b2c4TgbleYm6DnsSmNAK9hw6IoewOdLR5nRma6nKp5RKv9A-BM45N3HZx-t6s9uyd6OAp92LKcoJNK6Hraa2LjJTmvORJHRetlgWrWT1_Zoa01fILmzdMTGLj7kLL80XAiJ7i5zEeu2oz3NH4KVFPnC7gq8S2g1Og_u1OBXv0UXEvOW02D5i4UxkxLpCjJk41yB2exPZJl2T0F3R2QyhgX8V13--2h6se9lfslsE8tvxfBymI665hQuucG-qmzXfKk4X3yqBR2dMK-6eX1gz2_pXXftcH1EnWuvT4sEyzllJKsti5mXRD-31o8DiulgaLDfWD9_spQuDALRPuTtn9G0P0SkpjKTxAd88R8VhC7jSVUO-hLsChSq9hoaAOzahzYeLp2170C4FqgU5p_K4yf-uBmKzzJVaR_fur-LEdIYUO3q7epzmA7jR8DnnjJeDuRYf_pKF-Gvd9CBd7m_6fATpt00iyPiez105EdYDXQez2Ko1Z1JvrwLoy90Ex2ybzaS9VibBW5q_EOYnQZ1Qof6n8pZBY-hwmGT7ERe15cj2T_bn8ZtbCvb33EMfeeQGxfo69MkLiKw-b2GhkI5Q8XEU44Lsz3CLLRwVRZstqQEGfhPg1XhbwTraIgO1jnCQquogLVg67hnF90nLKiV4wFAqU5HKtnG4XNwp5JGCIoTO_ksvPVnpiG8IuQwTvuY4NAcHkScoqFgJZsgthiXKRSy8-QoeTOJBsnkmxVuyPUF6lMQ3kLOlwwqczAk7NETkgXcJXjTlIUV_fi_MZ_047KmDppnsg9CqwUYjTNFtelmNvzQPoWzUdfu96d57VfAwr-UyOKPFNfFy7JQIFxsFv6ZcxpuzwxSlPzu2A-jgtxEf9bfQrDJdlQgFb5kgrQMjO-UqR_R2i7JijUGDFjhM9mBeCj-ErZ__-uN4G9KruXlpEDUdoYtihlkYGYOEsiXV_brWXmEkeU34Stm1HJ_11PooirYOj5BiPycmhFBYth3q8E6Gj-EPikoIXJlFiCNc9PJ9TQxOtRJ8iVVoPVXZeGEiEUjgeXQDX23m3hfpOEtiTU4_DfBoGV7lg0w1ivk8-7FE2V1cdGTDnudKLhC9D6q2H3VbvVsMfBDekT3kpwMt-EdnUOeja151Bw4Mj_ue-ChliHPIJwOfmzbIteLDd1nvcW22xY3rqTWEwg804RfFF37gI3VBTrq14YpcVacatZDI-ivgziiPOPZC96QrXBSW8wFErmXH4bjsUo2-nTzAzG02xfpdXUeVXQigU_8yKMgvzkcnOfv77Za8gndp74OIob1rFH_qQz-sno8SUpgcxBNUQcb-MlKRk_8aWMp-GEc7IiGU8pzg7CoGsPtpK89Z9JAGyJowFRDp9j4Ul6lY_wIs1cFJZINj3lpt0t74rvE0oEORDuQAA_ejW2S9bimsQGdzcedX5HGnGhQtjze2kajPrm2JiGYqmbznHV9v76ULxO_rpjBBsh5G4X5Yfl8Mu761555Qi9wQPuuRSoz_K2zHmpdO3Dld9otHJ5xQiKu7XanHfc140NAbLgwH1TkoxipjStxtMt9fuG3CeRL0geKJtT0VQchSD4TVk-dxfoTyEAY7Dj3Qm8u2DKrzFdyw5TLAHiSvrhbcxcjtMUVCsWC5V5jzvmYLRO13HImBaTPXsjy0HGGdvGC4bSXxuqhF_DbPzgskN_GXKbO1MwKzR6DEyZ44EPzl0pw_qqm7E_eVDSwaIoqnnPkvPaK4Z8038-uIWStTykzqJAqlYPPiPtAwxmH2TPmMo8aSrzmR58muzkxUxQ73GSiv0rUt01itVuIVnCN1dQaeeV0qNTaf8AJNazusgz8AyN0HjvP4xIDcqsyQvIMPg7eIx6E2gIc7-L4wD1TR0RLIiJTm1xsxWgooXTdsVi9crr_bGM0Kr5fGPY-oY2DeMf4W1PJFpjFAgZQsB9FtA-mAjTiZ1ECAyyQmOWm-dnQ_97RTyyLoNM9Xy0pcOlypaF9ky7UBwwwQN3nWC1Gbt3kwxPqOKDgRHnxb5pNJp0ZH3gYki214avmC-LX_KHhZ5hw2gYUNokNGaTGv_AorPM_2VIIMp8MJTjciwog5a3GLG5eNZ0jsKnDYYK9aBTddwQMyTZ2YSzxbSEzH5yVYf33ybFOrbtINQhrz7XLZ8D3LpKV2XBHNFXwwjO6Ug7y2MvOZL-8lyvPpcDW86B28u_tFpdzLsZsiNNvJF4u550YwUdxi8wXbenHddOd_MCpBPm7IXrpR0YswxkIxW6i7mQyT_kikvlc-_P9wW33eNYm6MiGjoJb7IDpoNEWTwVr8zhcNN3b1SYSGhe0Xu3x9G2EVK2DovlE6tDlSh1oOH18jbYex-xN4bUUV83m1gGMlCLZKwpd4BV8-kEEg0GRZcAHR49CEDz8glrsDJUisnIoYcUU5KqBRVjv2o-XQ_xLTsNioQM46NpC2QXAfCaYP3pbzuxGM2GVAfEWkF2wi6eqVorsZPxnVIfcOdPlFHMfHEZlHoHBgf1997gTVOK9TL1qRVRno8f8rInmoU3rEZwzo_zb-K2EruMpQhIHt_xSGa1jK-JOZZ5w3RmyY_5OgJwHp8mCzEQthL8MK5cQAFafBiPvw4fa7sOcgmO3PGc7ol-bTS5s9h7KhwhRRSTX2Hx7gVcUw.j_5YPmIGVDGs0p7THZxkIw; __cf_bm=yttP9qWT1LUmRB13ramMGXmi0uQ8Nmjdhk1aTk4oZro-1711892692-1.0.1.1-YRMCG3s8c2iYiY8wzb1WCUEi_AQqkhj92Q1oN0PVgcHPYXf4YOXVgY8ShghA9xTZ9aTR4DZL_455_TrWbIsOkA; _dd_s=rum=0&expire=1711893595391"
                // "token=7abd6f1e38da5f1052d7fbc45bee0214ca7beb719f295e95c8594ec8523a4a21%7Cdaed0b05d56bf6176f473a7502828b3cab0e6fb3c8e09404c8ce9d3e4956fbc5; intercom-device-id-dgkjq2bp=e8f84038-a064-468b-ad1a-1a54697e6c76; cf_clearance=WRmo1GJyp.4b_qTwm8QKv4.O2uYRk76yve69mRMDnUo-1690710475-0-1-75c82dcb.17cd1c1e.36fa1514-0.2.1690710475; oai-did=2b607235-5d04-473b-a57b-56dccf58de90; ajs_user_id=c6c2ce06-c906-405b-8716-383e9f79a3c4; ajs_anonymous_id=aed89a74-636f-48d9-93d0-d257ea3af866; __cflb=0H28vVfF4aAyg2hkHFTZ1MVfKmWgNcKF5oyMuAYmKmX; _cfuvid=PTNqaysSfxVuk3qUv755dmMh37i9qnIhzmBhxG2H9gw-1711034353116-0.0.1.1-604800000; __Secure-next-auth.callback-url=https%3A%2F%2Fchat.openai.com; cf_clearance=TKKDoF1noQ_5ArfGkS7eQ6dnDvhlcrcL0dFNMs08aPw-1711034356-1.0.1.1-B7OCLoMF0KzoEynYMspuVgBQZpLhfiwrvrRX6lIqtB30jD1HpyWhyr4qbqbDON2.4ikSpx53Tm2YQ.Dtp2TmNg; intercom-session-dgkjq2bp=SnJNQkZkTml5eUVESFZxQWJrV09WTHhDQmQzVVpqVVg5UEVMSmFiZ2dpRysxSytjMXlSczZTSWhRTklrd1R0ei0tVHdCV0tqT1g5dDNTU25mMldQdmp0QT09--2a778d605638056cb8105f0c19b0a4b38c9fef6b; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..iqeBJXHeCN9B7b0G.OjeZzctC_NSG3ceCptQIacwcml30zKxjTBNo_nVxo-onZLbQlY-ZROP0N731A5o11QDpbv1xF9f-yLrHYsWQHkfVC9E_XsgL4N39UHHX2IBWWnRYNJJFsv8QCCJjPlZqVq31BBHri-O4Z_dQo1lgE5XgaFR7-KDf6FI_6Q4mAUNiwc3t2gNvZ0oRvZ38021E13wn_-XGvU0Z6QsJ70nXkXRybbBRrKg_98285aN5JQYYHzZ-aQK-3tQEHhBMvtbXyk1WRP6ClAmA7ZCv6Ocjp77DZhov71_84HwLTGz1j9_f8gaNZc85z-NvCVpC5APS8ldXewfbsKO1ZozW9GHIHn5o8bZMJ_PfVO9KIEKZYswmkr5LeoFgqHb_XTHfx-pr2h6YgTGJ2uaRUbxo-rBUW3lOMFNhnwQAXZhineh96Q4rd2hm2LE0SwnfwIbjOuuPjjQKB4hzoCxiscX1roEEz4mw-bFKWeAkFMpeCRGhI5k67cpLIYz1vsS7f6w1PZerVL1Uvt8kXuERvN316HEfdxUR_ZRIq76u99rx48JAxRWrwtmQ12ualrqoBHGX1odzS2RbISgI7eNspqEo42TruFO2S0xck3m5hrFdPoIXSjywovzg7mgHRRPEKhbvIDodXjXxfVZFsVOagD9-ZMwm5ipG5hWvEk6eWzSwPJMp7ydTdkNocO0__TIMACkctSOuo6RiqGJKK2-LZy-KzzYVB9bT2bMvAgvSJ4uXsvjRY_xl0M_Rq2UN6ce1VOYKI7p_QkEh0wOfrWYDqbCdhoY5cbjDVY0gs88QG2wlxsQeggt11cM-2UNnUE2KsFKovwPp7Yuo6RtNMYzoARS8caazPRHyyrrXxGYK81hau2_3fPMpzu9HFw7m3o3magA6fzo0UyOtFGIoioD6BiiGU8Lr2ZrBk11vb3jU17ldeqwMPtmvPmi9pw5FqUPJU59Y1JG2FFIif7XAIonV_haUG1E4uIHL_vDlJilsboQjIKrzwENC25_UC5qhJ5DxvsjoyeceMW6aLTDEpl8vJlXfjX5oGlIIyI9PXKRQlBUNEJZ7qBHBvmftK1QbkaoJ9E9GfkcYodvcSj9xw53b7IXziaRFbVw363X4qAJWXzwKAOv_8TtBVbFmNxhp3M7VQoo06T6ooYGG7iqaltJxyS4rYS-T7yNlPUnSgdCGFembqDgDf7pnr6bzN2fVM0qhzacpx5wni0hYh_RhZL1oZ_ywo8pgwHjWyUn5za9e68pcG-ywO9Ux-aBorr9AQsI0UOfUwxgVB4n6BSLQIpO4gylSyKlJlHf0HVJM0S_YkYtYyT6S3MWk8wk02gW9uLxEQkDXrZyk3QM41h5oMOH2PJx1bxAp2NmiYXKKzTLmE1Em19bYe5vnOysxAKFrIuDIDgoLTVnaMJbPlJn-dyAqVyGhsusZoiJH0MiAHoMQKgCZDT0zbym4X9yDoy0eJZOd7kbNzYtcQIfpgjXaLQpxtAFkM-UafDQdaemCiq2vK1rNKGLhIgY1ekSkXBSW1cMjFddovsDegS9JxlY1QZPu7zWZwircyqrLbLCjhKVQMdNjAiDMvwaK3GT8FNtsuPw0L8XziW18DeNm2EfJWa35kUMxU3Y-WiOOJZ_yZeRSBePVC1JQdKWUDr_iHpDtBw0-pyRc6SvYxX5czHIYT8X2cs3101csXWpm206YomtvCDcATeOK8itsC9z9RmoyTIpeLMj3vWuN3xWKACKxoXrTGVntZcXArFWgIhUEfpvaYjxAy4I8DmxQQnSx7Biywv1yshmjH3dBnKLrZF0Z04w5XnYR48I9EtMuzVOiBTgMaEIAfcggukCjpQGdQcTXYEU7NekaG4Xsm1p9IKN65_JZYpu0jCGabJ0o8b1ZyX9V3himhMYhqDNbYLYg4hfv6TZd9nmBS3GoZZjFx03rcDJ5Obdqiy_IoyZYxdjxKtyQP4NBeAx9s6hCVgH201UDm5tJaBJFhUNXFkcJVQZnMa1GMKMAwzn-WiaLqImYZsP1ovz5bVT0k6K7TAJ1X8udU98UAHumJCkcbR5gLXRtrops1hke0DWR8hqZOUSDkVxlxL3qlilqPb0Fz-nPA7_50BFvMYngBKa2Ud8tMaKoh04ngAfwChvRMfyqD5wtTlNdLYGMG8Rt9JhBtIgRpkXiRndf-JX5e7Sy6wsaBdpHOW9xzW3eC6hsCex9K9gfFa7v7CZLx2NZzC8RsX0oYqFBSis6AWdBYXctx69oxk7fySuHwUr1y-ntYTNBA8TkG0euOly8QO7bZi-hZ51kxFgIt82aIKDqx3Eg37D7LYz7eGf83tBlxdiqCcorqcfOxHEyH07LSHsPjZVBgYUmykqVDjNxAapUqEwPOKWmZ8KBhHRvb2NU6uGa8_vG8QmlrEjgW94YSbw8--nOpWcNIKc8SwL79DQmSYA2TPtVKdkO5103R6Qn_uCJF1YPCWooJ_0M2QRcoXQRXlQiTvzslVlAk-iGYm1LmRbM3EoJ7I1n0n_OzZ09xmq7SHcaLx0U0aWolXqxPnvf8df96nSonhauGeFqmUMh9vNoksEYB4xFpAgLIucgNw9Usv3jNNuWUtnFErrz9ZFZz12RQTRj7gT0Cbx3xcYWw4JTWwS27Pbad3D-X9ZRN6wXeG2jmKXVm3uG6m7-TFtdoDpbHgL0X6AtiabV74tOAxMqW1-56N4o30T2x_yQeute8cFxAvOQIhdZeu5Q8a92DM6PKLdc_atIIEZ_njHxDrmxkzwqezDTUpwt-K7jJF5NOI8CLWYRUR1BLrhLwTZV8oEvqKHE-Or0Mn_L2J_J61Ml1SNECKZmL3cXuoTXPKUDoNPcXzE_L9HLw-iJcP5tOu4YE4H6Lzvm1rmkzgaTw_Yhhg.ijmI-PwifeZfno3iwLKwJA; _uasid=Z0FBQUFBQmxfRktUTW1lU0ZLYlBUSnJkaFRDY1hBRG9JLTRqWFZaWDdDNm5WWFIyYWEwZlhoLUJqb1djN0lfb0stdWVlRkNPX011dVRDb2RnNVljY3hzbG4tNUw3RWJkanpjYmhhSXUwb2lfajNiR2RROEFfdFdTTENFWF9tcTBsMV9yT3FXUUxxU2k3aDlGR3ZWUXFwTTZweXhDdlR1TlpfMkRqSHkyUlhiX1BwR21odUFvWGtNSEFEck5rQ21aTHFkbFhYUnBKVzFGYmNUc3k4Q01mRjhTb3B6NGl6WUpRaTB3bGhGMzZFdnhPMmpSRXI0Snk0NjIyekpvTjVRcFMtZWZVQml0MDBBZ01WVEFnOHc2SnRfc2VXUVV1ZXd0R2xycWM4WmlHRlEtMU4xS3VCSzIxY0JIWThxcXpCLWZKSDVnQ21pdWZUeFFfa2hPb09mZ1k2V3ZxRExzQlV1YVpBPT0=; _umsid=Z0FBQUFBQmxfRktUREJPSDFsbi1lNjRKc1FNa0stOTNHaXpuNTNXNXRxTmVFQTIzTVg5SlJ2QXMzVVZaMnh6V29Yb0dTQ3hITnV6WG93T29EX1dORzFoSEI1YUZBQkNPeW1LT2x5ZzNTdXdXTVgwNjF3QW9hdGVnaXEweFNDVjN5ejQxQkgwMWtUckJ2aGQxTGhnVV81cDR3WWY4Ty10SDFybHJITW02U1BXc3ROeWlqZ3hVRDNUNnFDemRMcGFqVEs4TlptWVQ4aW9pRmNjZEhWdjRISm1sREtsUzZTUVVRdHc2dE1kN3lJQk1yQUNLZ2Nscm9OTT0=; __cf_bm=rvyvHkYFjb0tn2wuVjrhDwZQa_CGQSRNBFzzjXX.KgE-1711035264-1.0.1.1-D91OYonDzG54qAx9HdHtgxgUwZayBu8SeLt6euQfeNogbazom3UMPAe85gf8agR55AwTy4MRtkkOt96AJmEHjw; _dd_s=rum=0&expire=1711036174840"
            }
        }).then((res) => {
            websocket(res.wss_url);
        });

    }
    // testGPT();
})()

