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
        el.setAttribute(key, value);
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
