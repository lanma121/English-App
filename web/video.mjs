const {createEelement, bindEvents}  = dom;
const spinIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 96c38.4 0 73.7 13.5 101.3 36.1l-32.6 32.6c-4.6 4.6-5.9 11.5-3.5 17.4s8.3 9.9 14.8 9.9H448c8.8 0 16-7.2 16-16V64c0-6.5-3.9-12.3-9.9-14.8s-12.9-1.1-17.4 3.5l-34 34C363.4 52.6 312.1 32 256 32c-10.9 0-21.5 .8-32 2.3V99.2c10.3-2.1 21-3.2 32-3.2zM132.1 154.7l32.6 32.6c4.6 4.6 11.5 5.9 17.4 3.5s9.9-8.3 9.9-14.8V64c0-8.8-7.2-16-16-16H64c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l34 34C52.6 148.6 32 199.9 32 256c0 10.9 .8 21.5 2.3 32H99.2c-2.1-10.3-3.2-21-3.2-32c0-38.4 13.5-73.7 36.1-101.3zM477.7 224H412.8c2.1 10.3 3.2 21 3.2 32c0 38.4-13.5 73.7-36.1 101.3l-32.6-32.6c-4.6-4.6-11.5-5.9-17.4-3.5s-9.9 8.3-9.9 14.8V448c0 8.8 7.2 16 16 16H448c6.5 0 12.3-3.9 14.8-9.9s1.1-12.9-3.5-17.4l-34-34C459.4 363.4 480 312.1 480 256c0-10.9-.8-21.5-2.3-32zM256 416c-38.4 0-73.7-13.5-101.3-36.1l32.6-32.6c4.6-4.6 5.9-11.5 3.5-17.4s-8.3-9.9-14.8-9.9H64c-8.8 0-16 7.2-16 16l0 112c0 6.5 3.9 12.3 9.9 14.8s12.9 1.1 17.4-3.5l34-34C148.6 459.4 199.9 480 256 480c10.9 0 21.5-.8 32-2.3V412.8c-10.3 2.1-21 3.2-32 3.2z"/></svg>`;
const repeatIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="16" height="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96H320v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32V64H160C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96H192V352c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V448H352c88.4 0 160-71.6 160-160z"/></svg>`;



export const createVideo = (src) => {
    const seek = {
        seeked: true,
        startTime: 0,
        endTime: 0,
        repeat: 0, // 0: init | end; 1: ready start; 2: repeating
    };
    const video = createEelement('video', {
        src,
        width: '100%',
        controls: true,
        crossorigin: '',
        preload: 'auto', 
        poster: 'https://media.tenor.com/qXzHf2tesO0AAAAC/loading-gif-steiness.gif'
    });

    const play = () => {
        if (video.paused) {
            video.play();
        }
    }

    const start = (time = 0) => {
        video.currentTime = time;
        play();
    }

    const repeat = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pathElement = e.currentTarget.querySelector('path');
        seek.repeat = seek.repeat === 2 ? 0 : seek.repeat + 1;
        // repeat inprogress
        if (seek.repeat === 2) {
            pathElement.style.fill = '#1c8d1c';
            if (seek.startTime > video.currentTime) {
                seek.endTime = seek.startTime;
                seek.startTime = video.currentTime;
            } else {
                seek.endTime = video.currentTime;
            }
            if (seek.endTime > seek.startTime + 1) {
                start(seek.startTime);
            }
        // ready speat, waiting setup start time and end time
        } else if (seek.repeat === 1) {
            pathElement.style.fill = '#d22c0b';
            seek.startTime = video.currentTime;
        }
        // end repeat
        else {
            pathElement.style.fill = '#fff';
            seek.seeked = true;
            seek.startTime = 0;
            seek.endTime = 0;
            seek.repeat = 0;
        }
    }

    bindEvents(video, 'loadedmetadata', () => {
        if (video.parentNode) {
            video.parentNode.style.position = 'relative';
            const div = createEelement('div', {
                style: 'position: absolute; bottom: 43px; right: 130px; height: 16px; background: transparent;z-index: 1;'
            });
            const eles = [{
                html: repeatIcon,
                onclick: repeat,
                // (e) => {
                //     e.preventDefault();
                //     seek.loop = !seek.loop;
                //     repeat(e);
                // }
            }].map((options) => {
                return createEelement('a', {
                    style: 'cursor: pointer; margin-right: 26px',
                    ...options,
                });
            });

            video.parentNode.append(div.appends(eles));
        }
    });
    
    // bindEvents(video, 'seeking', () => {
    //     if (seek.seeked && seek.repeat === 1) {
    //         seek.startTime = video.currentTime;
    //         seek.seeked = false;
    //         video.pause();
    //     }
    //     console.log('=====seeking', seek);
    // });

    bindEvents(video, 'timeupdate', (e) => {
        if (video.currentTime >= seek.endTime && seek.repeat === 2) {
            video.currentTime = seek.startTime;
            // video.fastSeek(seek.startTime);
            play();
        }
    });

    // video.prototype.interval = function(amount  = 3, interval = 5) {
    //     console.log('=====video', this);
    //     let startTime = 0;
    //     setTimeout(() => {
    //         start(start);
    //     }, interval);
    // };

    return video;
}
