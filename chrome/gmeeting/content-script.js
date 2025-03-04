
(function() {
    const { $e, delegateEvents, createEelement } = dom;
    
    const style = `
    <style>
        #contextMenu {
            position: fixed;
            z-index: 99999;
            background: white;
            border: 1px solid #ddd;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
            max-width: 350px;
            display: none;
        }

        #contextMenu .header {
        }

        #contextMenu .body {
            max-height: 300px;
            overflow: auto;
            padding: 10px;
            clear: both;
        }

        .menu-item {
            padding: 4px 12px;
            cursor: pointer;
            float: left;
        }

        .menu-item:hover {
            background: #f0f0f0;
            padding-bottom: 2px;
            border-bottom: 2px solid grey;
        }
    </style>
    `;

    

    
    function fallbackCopyTextToClipboard(text) {  
        // Create a temporary textarea element  
        const textArea = document.createElement('textarea');  
        textArea.value = text;  
        document.body.appendChild(textArea);  
        textArea.select(); // Select the text  
        
        // Use execCommand as a fallback method  
        try {  
            document.execCommand('copy'); // Attempt to copy
        } catch (err) {  
            console.error('Fallback copy failed: ', err);  
            console.log( 'Failed to copy text with fallback.');  
        } finally {  
            // Clean up  
            document.body.removeChild(textArea);  
        }  
    }

    const copy = async (content, type) => {
        if (typeof content === 'string') {
            try {  
                // Ensure the document is focused  
                // Attempt to write text to the clipboard 
                await navigator.clipboard.writeText(content);
            } catch (error) {  
                console.error('Failed to copy: ', error);  
                // Fallback method if Clipboard API fails  
                fallbackCopyTextToClipboard(content);
            }
        } 
        
    }

    function toggleContent(key) {
        const btn = $e('#contextMenu .menu-item.show');
        key = key || btn.dataset.show;
        if (key === 'question') {
            $e('#contextMenu .question').show();
            $e('#contextMenu .answer').hide();
            btn.dataset.show = 'answer';
        } else {
            $e('#contextMenu .question').hide();
            $e('#contextMenu .answer').show();
            btn.dataset.show = 'question';
        }
    }

    function showContextMenu(e) {
        // Get current dimensions
        const menuWidth = 350;
        const menuHeight = 350;
        const width = window.innerWidth - menuWidth - 10;
        const height = window.innerHeight - menuHeight;
        const X = e.clientX;
        const Y = e.clientY;
        const left = width < X ? width : X;
        const top = height < Y ? height : Y;
        const contextMenu = $e('#contextMenu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = `${left}px`;
        contextMenu.style.top = `${top}px`;
       return contextMenu;
    }

    async function summary(content, contextMenu) {
        const result = await sider.summarize(content);
        contextMenu.find('.answer').insert(result, { position: 'replace' });
        toggleContent('answer');
    }

    let currentTextEle = null;

    const actions = (contextMenu) => {
        const getContent = (isNext) => {
            let content =  currentTextEle.textContent;
            let nextSibling = currentTextEle.nextSibling;
            while(isNext && nextSibling) {
                content += '\n' + nextSibling.textContent;
                nextSibling = nextSibling.nextSibling;
            }
            return content;
        }

        dom.bindEvents('#contextMenu .menu-item', 'click', async (e) => {
            const text = e.target.textContent;
            let content = getContent(e.target.classList.contains('next'));
            let result = '';
            if (text === "CP") {
                copy(content);
            }else if (text === "SH") {
                toggleContent();
            }else if (text === "TR") {
                // toggleContent();
            }else if (text === "SC" || text === "SN") {
                result = await sider.summarize(content);
            }else if (text === "OK") {
                result = await sider.answer(content, {type: 'answerOK'});
            }else if (text === "NO") {
                result = await sider.answer(content, {type: 'answerNO'});
            }else if (text === "AN") {
                result = await sider.answer(content, {type: 'answerEX'});
            }else if (text === "EC" || text === "EN") {
                result = await sider.explain(content);
            }else if (text === "IN") {
                const inputContainer = contextMenu.find('.input');
                cinputContainer.style.display = inputContainer.style.display === 'none' ? 'display' : 'none';
            }else if (text === "CO") {
                contextMenu.hide();
            }

            if (result) {
                contextMenu.find('.answer').insert(result, 'replace');
                toggleContent('answer');
            }
        })
        
        // Hide context menu when clicking elsewhere
        // document.addEventListener('click', () => {
        //     $e('#contextMenu').style.display = 'none';
        // });
    }

    function createContextMenu(e) {
        $e('head').insert(style);
        $e('body').insert(`
            <div id="contextMenu">
                <div class="header">
                    <div class="menu-item">TR</div>
                    <div class="menu-item">SC</div>
                    <div class="menu-item next">SN</div>
                    <div class="menu-item">OK</div>
                    <div class="menu-item">NO</div>
                    <div class="menu-item">AN</div>
                    <div class="menu-item">EC</div>
                    <div class="menu-item next">EN</div>
                    <div class="menu-item">CP</div>
                    <div class="menu-item">IN</div>
                    <div class="menu-item show">SH</div>
                    <div class="menu-item">CO</div>
                </div>
                <div class="body">
                    <div class="question"></div>
                    <div class="answer"></div>
                </div>
                <div class="input" style="display: none;"><textarea></textarea></div>
            </div>
        `);
        actions($e('#contextMenu'));
    }

    const spanStyle = [
        "position: absolute",
        "width: 20px",
        "height: 20px",
        "background: antiquewhite",
        "display: block",
        "left: 0px",
        "top: 0px",
        "text-align: center",
        "cursor: pointer",
        "line-height: 20px",
        "z-index: 99",
        "border-radius: 50%",
        "color: burlywood",
    ]

    const textEvent = (contentEle, containerNode) => {
        const span = createEelement('span',  {id: 'closeSpan', content: 'X', style: spanStyle.join(';')});
        span.bindEvents('click', () => {
            $e('#summeryDiv')?.remove();    
        });
        delegateEvents(contentEle, 'click', async (e, { target }) => {
            const content = target?.textContent;
            if (content) {
                target.classList.add('selected');
                const contextMenu = showContextMenu(e);
                currentTextEle = target;
                contextMenu.find('.question').insert(content, 'replace' );
                toggleContent('question');
            }
        }, { delegateEle: $e(containerNode)});
    }


    const init = () => {
        let events = [{
             contentEle: 'div.items-center', 
             containerEle:'aside .overflow-auto'
        }];
        if (location.host === 'meet.google.com') {
            events = [
                {
                    contentEle: 'div[id^="chat-"]', 
                    containerEle: '#popup-container'
                },
                {
                    contentEle: 'li', 
                    containerEle: '.ask-me .dialog'
                },
            ]
        }
        const eles = events.filter(({contentEle, containerEle}) => {
            const containerNode = $e(containerEle);
            if (containerNode) {
                textEvent(contentEle, containerEle);
                return true;
            }
            return false;
        });
        if (eles.length) {
            createContextMenu();
            return true;
        }
        return false;
    }

    chrome.runtime.onMessage.addListener(({ startTime }, sender, sendResponse) => {
        const data = { message: init()? "set successfully!" : 'not found element!'};
        sendResponse(data);
    });

    
})();

