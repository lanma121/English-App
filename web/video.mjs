import {createEelement, bindEvent} from './utils.mjs';


export const createVideo = (src) => {
    let seeking = 0, seeked = 0;
    const video = createEelement('video', {
        src,
        controls: true,
        crossorigin: '',
        preload: 'auto', 
        poster: 'https://media.tenor.com/qXzHf2tesO0AAAAC/loading-gif-steiness.gif'
    });
    bindEvent(video, 'seeking', (e) => {
        if (seeking === 0) {
            seeking = video.currentTime;
        }
        // seeking = video.currentTime;
        console.log('---------seeking', e);
        console.log('======', video.currentTime, video.loop);
    });
    bindEvent(video, 'seeked', (e) => {
        console.log('---------seeked', e);
        console.log('======', video.currentTime);

        // video.currentTime = 30;
    });
    return video;
}