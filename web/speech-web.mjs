const synth = window.speechSynthesis;
const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
const SpeechGrammarList = window?.SpeechGrammarList || window?.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window?.SpeechRecognitionEvent || window?.webkitSpeechRecognitionEvent;

let startTimestamp = 0;
/**
 * @event life cycle: onstart -> onaudiostart -> onsoundstart -> onspeechstart -> onspeechend -> onsoundend -> onaudioend -> onend
 * @param {*} lang 识别语言类型
 * @param {*} grammars 语音是否包含该字符串 (语音识别器使用grammars来确定识别器应侦听的内容，从而描述用户可能说出的话语)
 * @param {*} maxAlternatives 每次识别的结果最多是几个
 * @param {*} continuous true: 连续性返回结果，false: 一次返回所有结果
 * @param {*} interimResults true 识别到就返回，False,一句话说完饭回（有停顿）
 * @returns 
 */
export const createSpeechRecognition = ({
    grammars = '',
    lang = "en-US",
    maxAlternatives = 1,
    continuous = true,
    interimResults = false
} = {}) => {
  const recognition = new SpeechRecognition();
  if (grammars) {
    const speechRecognitionList = new SpeechGrammarList();
    //一个浮点数，表示语法相对于 SpeechGrammarList 中存在的其他语法的权重。权重表示此语法的重要性，或者语音识别服务识别它的可能性。该值可以介于 和 1.0 之间 0.0 ;如果未指定，则使用的默认值为 1.0 。
    speechRecognitionList.addFromString(`#JSGF V1.0; grammar phrase; public <phrase> = ${grammars};`, 1);
    recognition.grammars = speechRecognitionList;
  }
  
  recognition.continuous = continuous;
  recognition.lang = lang;
  recognition.interimResults = interimResults;
  recognition.maxAlternatives = maxAlternatives;

  recognition.start();

  startTimestamp = new Date().getTime();

  recognition.onstart = function(event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log('SpeechRecognition.onstart');
  }


  recognition.onend = function(event) {
    //Fired when the speech recognition service has disconnected.
    if ((new Date().getTime() - startTimestamp) > (1000 * 60) ) {
        const yes = window.confirm('retain the speech recognition?');
        if (yes) {
            recognition.start();
            startTimestamp = new Date().getTime();
        }
        return;
    }
    recognition.start();
}

  // Event listener for errors
  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    if (event.message === 'no-speech') {
        // recognition.start();
    }
  };

  recognition.onaudiostart = function(event) {
    //Fired when the user agent has started to capture audio.
    console.log('SpeechRecognition.onaudiostart');
}

recognition.onaudioend = function(event) {
    //Fired when the user agent has finished capturing audio.
    console.log('SpeechRecognition.onaudioend');
}

recognition.onspeechend = function() {
    console.log('SpeechRecognition.onspeechend');
}


recognition.onnomatch = function(event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log('SpeechRecognition.onnomatch');
}

recognition.onsoundstart = function(event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log('SpeechRecognition.onsoundstart');
}

recognition.onsoundend = function(event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log('SpeechRecognition.onsoundend');
    startTimestamp = new Date().getTime();
}

recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log('SpeechRecognition.onspeechstart');
}

  return recognition;
}

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
    const aname = a.name.toUpperCase();
    const bname = b.name.toUpperCase();

    if (aname < bname) {
      return -1;
    } else if (aname == bname) {
      return 0;
    } else {
      return +1;
    }
  });
  const selectedIndex =
    voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = "";

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    option.textContent = `${voices[i].name} (${voices[i].lang})`;

    if (voices[i].default) {
      option.textContent += " -- DEFAULT";
    }

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

// if (speechSynthesis.onvoiceschanged !== undefined) {
//   speechSynthesis.onvoiceschanged = populateVoiceList;
// }

function speak() {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }

  if (inputTxt.value !== "") {
    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);

    utterThis.onend = function (event) {
      console.log("SpeechSynthesisUtterance.onend");
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    const selectedOption =
      voiceSelect.selectedOptions[0].getAttribute("data-name");

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

// inputForm.onsubmit = function (event) {
//   event.preventDefault();

//   speak();

//   inputTxt.blur();
// };

// pitch.onchange = function () {
//   pitchValue.textContent = pitch.value;
// };

// rate.onchange = function () {
//   rateValue.textContent = rate.value;
// };

// voiceSelect.onchange = function () {
//   speak();
// };