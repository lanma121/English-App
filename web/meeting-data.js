
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

    function api(data) {
        fetch('http://localhost:3005/translate/', { mode: "no-cors", method: "POST", body: JSON.stringify(data)})
            .then(async (response) => {
                const res = await response.text();
                console.log('===fetch success', res);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const recordVideoTooltips = () => {
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
    }

    function init() {
        clearInterval(window.myinterval);
        recordVideoTooltips();
        window.myinterval = setInterval(() => {
            let contents = '';
            const speakers = document.querySelectorAll('.iOzk7 > div.TBMuR');
            for (let i=0; i<speakers.length; i++) {
                const contentEles = speakers[i].children;
                const speaker = contentEles[0]?.textContent;
                const content = contentEles[1]?.textContent;
                if (content) {
                    contents += speaker + ': ' + content + (i+1 === speakers.length ? '' : '\n');
                }
            }
            if (contents) {
                const lastContent = localStorage.getItem('ATS_last') || '';
                localStorage.setItem('ATS_last', contents);
                const searchstr = lastContent.slice(-20);
                const index = contents.indexOf(searchstr) + searchstr.length;
                // const lastword = lastContent.slice(lastContent.lastIndexOf('.'));
                const newWords = contents.slice(index);
                newWords && api({content: newWords});
            };
        } , 1000);
    }
    init();
    // api({aa: 434334});
    // window.postMessage("fewfwefwffewwff", '*');
})()
