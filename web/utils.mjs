/**
 * Creates a new DOM element with the given name and attributes.
 *
 * @param {string} name - The name of the DOM element to create.
 * @param {Object} [attributes={}] - The attributes to set on the created element.
 * @param {Document} [doc=document] - The document to use to create the element.
 * @returns {Element} The new DOM element.
 * @throws {TypeError} If name is not a non-empty string.
 */
export const createEelement = (name, attributes = {}, doc = document) => {
    if (typeof name !== 'string' || !name) {
        throw new TypeError('Invalid arguments: name must be a non-empty Dom string');
    }

    const el = doc.createElement(name);

    // Set attributes on the element
    for (const key in attributes) {
        const value = attributes[key];

        if (key === 'text') {
            el.insertAdjacentText('beforeend', value || '');
            continue;
        }
        if (key === 'html') {
            el.insertAdjacentHTML('beforeend', value || '');
            continue;
        }
        if (key === 'elements') {
            el.append(...[].concat(value));
            continue;
        }

        if (key.startsWith('on') && typeof value === 'function') {
            bindEvent(el, key.slice(2), value);
            continue;
        }
        el.setAttribute(key, value);
    }

    el.appends = (...params) => {
        el.append(...[].concat(...params));
        return el;
    }

    return el;
}



/**
 * Binds an event listener to a DOM element or a selector.
 *
 * @param {string|Element} selector - The selector or the DOM element to bind the event to.
 * @param {string} events - The event(s) to listen for.
 * @param {function} callback - The callback function to be executed when the event is triggered.
 * @param {Object} [options={}] - Additional options for the event listener.
 * @throws {TypeError} If selector, events, or callback is falsy.
 * @throws {Error} If the selector does not match any element in the document.
 * @return {AbortController} An AbortController instance to control the event listener.
 */
export const bindEvent = (selector, events, callback, options = {}) => {
    if (!selector || !events || !callback) {
        throw new TypeError('bind event error, selector, events, and callback are required');
    }

    const controller = new AbortController();

    setTimeout(() => {
        const dom = selector instanceof Element ? selector : document.querySelector(selector);
        if (!dom) {
            throw new Error(`event bind failed: selector "${selector}" not found`);
        }

        const eventListener = (event) => {
            try {
                callback(event);
            } catch (error) {
                console.error(`error handling event "${events}"`, error);
            }
        };

        dom.removeEventListener(events, eventListener, {signal: controller.signal, ...options});
        dom.addEventListener(events, eventListener, {signal: controller.signal, ...options});
    }, 0);

    return controller;
}

export const request = (url, { data = undefined, ...option } = {}) => {
    console.log(url);
    try {
        const controller = new AbortController();
        const result = new Promise(async (resolve, reject) => {
            const datas = data ? { data: JSON.stringify(data) } : {};
            const response = await fetch(url, {
                signal: controller.signal,
                method: data ? "POST" : "GET", // *GET, POST, PUT, DELETE, etc.
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
