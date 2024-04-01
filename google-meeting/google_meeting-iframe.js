
(function(){

    const createEelement = (name, attributes = {}, DOC = document) => {
        const el = DOC.createElement(name);
        Object.keys(attributes).forEach((key) => {
            el.setAttribute(key, attributes[key]);
        });
        return el;
    }

    const bindEvent = (selector, events, callback, options = {}, DOC = document) => {
        if (!selector || !events || !callback) {
            console.error('bind event error');
        }
        const controller = new AbortController();
        setTimeout(() => {
            console.log('+++++++++++', DOC, DOC.querySelector(selector));
            const dom = typeof selector === 'string' ? DOC.querySelector(selector) : selector;
            dom.removeEventListener(events, callback, {signal: controller.signal, ...options});
            dom.addEventListener(events, callback, {signal: controller.signal, ...options});
        }, 0);
        return controller;
    }

    const createContainer = () => {
        const el = createEelement('iframe', {id: 'myTranslator', draggable: true, style: 'position: fixed; top: 0; right: 4px;z-index: 9999; background: #fff; width: 300px; border: 1px solid blue; display: flex;'});
        // const drap = createEelement('div', {style: 'width: 10px; height: 10px; position: absolute; z-index: 99999;top: 0; left: 0; background: blue; cursor: move;'});
        // const ol = createEelement('textarea', {style: 'flex-grow: 1;'});
        // const il = createEelement('textarea', {id: 'inputLanguage', style: 'width: 0;'});
        // el.append(drap);
        // el.append(il);
        // el.append(ol);
        // document.querySelector('body')?.append(el);
        bindEvent('#myTranslator', 'load', (e) => {
            console.log('------------------');
            e.target.contentWindow.googleTranslateElementInit = () => {
                new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
            }
            const iframeDocument = e.target.contentWindow.document;
            const ele = createEelement('div', {id: "google_translate_element"});
            const p = createEelement('p');
            p.innerHTML = "Hello everybody!";
            const drap = createEelement('div', {style: 'width: 10px; height: 10px; position: absolute; z-index: 99999;top: 0; left: 0; background: blue; cursor: move;'});
            const script = createEelement('script', {type: 'text/javascript',  charset: "UTF-8", src: "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"});
            iframeDocument.querySelector('head').append(script);
            iframeDocument.querySelector('body').append(drap);
            iframeDocument.querySelector('body').append(ele);
            iframeDocument.querySelector('body').append(p);
            bindEvent('#myTranslator', 'dragend', (e,b) => {
                e.target.style.left = e.pageX + 'px';
                e.target.style.top = e.pageY + 'px';
            });
        });
        return el;
    }

    function init() {
        clearInterval(window.myinterval);
        // const date = new Date().toDateString().replace(' ', '_');
        document.querySelector('body #myTranslator')?.remove();
        document.querySelector('body')?.append(createContainer());
        localStorage.removeItem('ATS');
        // window.myinterval = setInterval(() => {
        //     let contents = '';
        //     const speakers = document.querySelectorAll('.iOzk7 > div.TBMuR');
        //     for (let i=0; i<speakers.length; i++) {
        //         const contentEles = speakers[i].children;
        //         const speaker = contentEles[0]?.textContent;
        //         const content = contentEles[1]?.textContent;
        //         console.log()

        //         if (content) {
        //             contents += speaker + ': ' + content + (i+1 === speakers.length ? '' : '\n');
        //         }
        //     }
        //     if (!contents) return;
        //     document.querySelector('#inputLanguage').value = contents;
        //     document.querySelector('#inputLanguage').dispatchEvent(new Event("change"));
        //     const lastContent = localStorage.getItem('ATS_last') || '';
        //     localStorage.setItem('ATS_last', contents);
        //     const searchstr = lastContent.slice(-10);
        //     const index = contents.indexOf(searchstr) + searchstr.length;
        //     const newWords = contents.slice(index);
        //     // if (newWords.length <10) return;
        //     localStorage.setItem('ATS', (localStorage.getItem('ATS') || '') + newWords);
        //     // setTimeout(() => {
        //     //     const allContent = localStorage.getItem('ATS') || '';
        //     //     const searchstr = allContent.slice(-10);
        //     //     const index = content.indexOf(searchstr) + searchstr.length;
        //     //     localStorage.setItem('ATS', allContent + content.slice(index));
        //     // }, 0);
            
        // } , 1000);
    }

    init();

})()
