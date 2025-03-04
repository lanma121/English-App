(function() {
    const { $e, delegateEvents, createEelement } = dom;
    const { edge: translate } = translator;
    let max_time = 3, delay_seocnd = 3;
    let timeout = null, transcripts = [], play_collect = false;
    const COLLECT = 'collect';
    const hoverClass = 'hover:text-gray-700 hover:border-brand-green-lighter3';
    const activeClass = 'border-brand-green-lighter3 text-brand-green';
    const contentHtml = `
        <div id="transcript-container" style="position: absolute; top: 0; margin: auto; padding: 12px; color: blue; font-size: 20px; width: 100%; background: aliceblue;">
            <div class="speaker border-b border-gray-200" style="display: flex;">
                <h4></h4>
                <a id="viedo-control" class="border-transparent text-gray-500 whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm cursor-pointer">Stop</a>
                <a class="border-transparent text-gray-500 whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm cursor-pointer">Hide</a>
                <a class="border-transparent text-gray-500 whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm cursor-pointer">Repe</a>
                <a title="collect" class="border-transparent text-gray-500 whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm cursor-pointer">
                    <svg data-icon="star-empty" height="20" role="img" viewBox="0 0 16 16" width="20" style="fill: currentColor;">
                        <path d="M16 6.11l-5.53-.84L8 0 5.53 5.27 0 6.11l4 4.1L3.06 16 8 13.27 12.94 16 12 10.21l4-4.1zM4.91 13.2l.59-3.62L3 7.02l3.45-.53L8 3.2l1.55 3.29 3.45.53-2.5 2.56.59 3.62L8 11.49 4.91 13.2z" fill-rule="evenodd"></path></svg>
                </a>
                <a class="border-transparent text-gray-500 whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm cursor-pointer">Favo</a>
            </div>
            <div class="content" style="overflow: auto; max-height: calc(100% - 40px);"></div>
        </div>
    `;

    const iframeHtml = `
        <iframe src="" style="position: absolute; top: 0px; display: none; height: 100%; width: 100%; z-index: 1;"></iframe>
    `;

    function timeToSeconds(time) {
        const [minutes, senconds] = time.split(':');
        return parseInt(minutes) * 60 + parseInt(senconds);
    }

    const storeIndex = (value = '', key) => {
        key = key ? '/' + key : ''
        localStorage.setItem(location.pathname + key, value);
    }

    const queryIndex = (key) => {
        key = key ? '/' + key : ''
        return localStorage.getItem(location.pathname + key) || '';
    }

    const getIndex = () => parseInt(queryIndex()) || 0;

    const getCollectIndex = () => {
        const currentIndex = queryIndex() || '0';
        const collecIndexs = queryIndex(COLLECT).split(',');
        const collectIndex = collecIndexs.indexOf(currentIndex);
        const currentValue = collecIndexs[collectIndex];
        return [collecIndexs, currentValue, currentIndex, collectIndex];
    }

    const isCollectedTranscript = () => {
        return !!getCollectIndex()[1];
    }

    const updateCollectedIndex = () => {
        const [collecedIndexs, currentValue, currentIndex, collectIndex] = getCollectIndex();
        if (currentValue) {
            collecedIndexs.splice(collectIndex, 1);
        } else {
            collecedIndexs.push(currentIndex);
            collecedIndexs.sort((a, b) => parseInt(a) - parseInt(b));
        }
        storeIndex(collecedIndexs.join(','), COLLECT);
        return !!currentValue;
    }

    const getAllTranscript = () => {
        transcripts = transcripts.length ? transcripts :
            $e('aside .h-full div.flex-col.items-center .cursor-pointer') || [];
        return transcripts;
    }


    const getTranscript = (index) => {
        index = parseInt(index || queryIndex()) || 0;
        return getAllTranscript()[index];
    }

    const playTranscript = (target) => {
        (target || getTranscript())?.click();
        $e('main > iframe')?.hide();
        $e('#transcript-container #viedo-control')?.replace('Stop');
    }

    const pauseTranscript = () => {
        const video = $e('main video');
        video.pause();
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        $e('#transcript-container #viedo-control')?.replace('Play');
    }

    const renderContent = (speaker = '', content = '') => {
        let container = $e("#transcript-container");
        let myIframe = $e('main main > iframe') || $e('main main').insert(iframeHtml).find('iframe');
        let translationDom = $e('main main > p') || createEelement('p', {
            appendEle: 'main main',
            style: 'position: absolute; top: 0px; background: aliceblue; width: 80%; padding: 12px;'
        });
        translate(content).then((data) => {
            const text =  data[0].translations[0].text;
            translationDom.replace(text);
        });
        if (!container) {
            container = $e('main aside').insert(contentHtml).find("#transcript-container");
            const height = $e('main aside').clientHeight - 80;
            container.find('.content').style.maxHeight = height + 'px';
            delegateEvents('#transcript-container .content a', 'click', (event, { index, target }) => {
                myIframe.show();
                const word = target.textContent.replace(/[,\.]/, '');
                myIframe.src = `https://www.bing.com/dict/search?q=${word}&cc=cn`;
                pauseTranscript();
            });

            delegateEvents('#transcript-container .speaker a', 'click', (event, { index, target }) => {
                const text = target.textContent;
                target.parentNode.querySelectorAll('a').forEach(element => {
                    activeClass.split(' ').forEach((classname) => {
                        element.classList.remove(classname);
                        if (element === target) {
                            element.classList.add(classname);
                        }
                    })
                });
                if (text === 'Play') {
                    playTranscript();
                }
                if (text === 'Stop') {
                    pauseTranscript();
                }
                if (text === 'Repe') {
                    max_time = 10;
                    target.textContent = 'Reve';
                }
                if (text === 'Reve') {
                    max_time = 3;
                    target.textContent = 'Repe';
                }
                if (text === 'Hide') {
                    container.find('.content').hide();
                    target.textContent = 'Show';
                }
                if (text === 'Show') {
                    container.find('.content').show();
                    target.textContent = 'Hide';
                }

                if (target.title === COLLECT) {
                    const removed = updateCollectedIndex();
                    target.styles({color: removed ? '' : 'red'});
                }

                if (text === 'Favo') {
                    const index = queryIndex(COLLECT).split(',')[0];
                    if (index) {
                        playTranscript(getTranscript(index));
                        play_collect = true;
                        target.textContent = 'All';
                    }
                }

                if (text === 'All') {
                    playTranscript(getTranscript());
                    play_collect = false;
                    target.textContent = 'Favo';
                }
            });
        }
        // container.find('.speaker h4').insert(speaker, 'replace');
        const contentEle = container.find('.content').replace(
            content.
                split(' ')
                .map((word) => word ? `<a class="px-2" href="javascript:void(0)">${word}</a>` : '')
                .join(' ')
        );
        container
        .find('.speaker a[title="collect"]')
        .styles({color: isCollectedTranscript() ? 'red' : ''});
        
    }

    const scrollContent = (duration) => {
        const contentEle = $e('#transcript-container .content');
        const { scrollHeight, clientHeight }  = contentEle;
        if (scrollHeight > clientHeight) {
            contentEle?.scrollTo({  
                top: 0,  
                behavior: 'smooth' // Smooth scroll effect  
            });
            setTimeout(() => {
                contentEle?.scrollTo({  
                    top: scrollHeight,  
                    behavior: 'smooth' // Smooth scroll effect  
                });  
            }, (duration / 2 ) * 1000);
        }
    }

    
    const getNextTranscript = () => {
        let nextIndex = getIndex() + 1;
        if (play_collect) {
            const [collecedIndexs, currentValue, currentIndex, collectIndex] = getCollectIndex();
            nextIndex = collecedIndexs[collectIndex + 1];
        }
        return getTranscript(nextIndex);
    }

    const handleTranscript = (target) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }

        const [startTime, endTime] = $e('span.text-gray-700', target).textContent.split('-');
        const duration = timeToSeconds(endTime) - timeToSeconds(startTime) + delay_seocnd;

        if (!target.dataset.play_time || target.dataset.play_time < 1) {
            const speaker = $e('span.text-gray-800', target).textContent;
            const content = $e('div.text-gray-800', target).textContent;
            renderContent(speaker, content, duration);
        } 
        scrollContent(duration);
        
        timeout = setTimeout(() => {
            target.dataset.play_time = parseInt(target.dataset.play_time || 0) + 1;
            if (parseInt(target.dataset.play_time) >= max_time) {
                target.dataset.play_time = 0;
                target = getNextTranscript();
            }
            if (target) {
                playTranscript(target);
            }
        }, duration * 1000);
    }

    const listenTranscript = () => {
        delegateEvents('aside .h-full div.flex-col.items-center .cursor-pointer', 'click', (event, { index, target }) => {
            storeIndex(index);
            handleTranscript(target);
            target.scrollIntoView({
                behavior: 'smooth', // Smooth scrolling  
                block: 'start'      // Align to the top of the viewport  
            });
        });
        $e(document).bindEvents('click', (event) => {
            if (event.target.text === 'Transcript') {
                setTimeout(() => {
                    playTranscript();
                });
                return;
            }
        });
    }

    listenTranscript();

})();