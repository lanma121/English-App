import fs from "fs";
import dotenv from "dotenv";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import WS from "../web/web-socket.mjs";
import { request } from "./utils.mjs";

dotenv.config();
// const token = process.env.DEEPGRAM_API_KEY || '77b396cac08488d0ab439c764e98a1976acc5f31'; // Replace with your Deepgram API key

class dgConnection extends LiveTranscriptionEvents {
    constructor(deepgramClient) {
        super();
        this.dgConnection = null;
        this.keepAlive = null;
        this.deepgramClient = deepgramClient;
    }

    /**
     * Connect to a Deepgram transcription stream
     * @param {string} token - Deepgram API token
     * @param {import("@deepgram/sdk").LiveSchema} [options] - Options to pass to the Deepgram connection
     * @returns {Promise<import("@deepgram/sdk").LiveTranscription>} A promise that resolves to the connection object
     */
    connect(token, options = {}) {
        if (this.dgConnection) {
            this.dgConnection.close();
            this.dgConnection.removeAllListeners();
        }
        
        // Create a Deepgram connection object and start the keep alive interval
        /**
         * 
         * @param options {import("@deepgram/sdk").LiveSchema} options
         * @param {string} model - Deepgram model: base | whisper | nova-2 | enhanced | custom_id
         *                          general: Optimized for everyday audio processing.
                                    meeting: Optimized for conference room settings, which include multiple speakers with a single microphone.
                                    phonecall: Optimized for low-bandwidth audio phone calls.
                                    voicemail: Optimized for low-bandwidth audio clips with a single speaker. Derived from the phonecall model.
                                    finance: Optimized for multiple speakers with varying audio quality, such as might be found on a typical earnings call. Vocabulary is heavily finance oriented.
                                    conversationalai: Optimized for use cases in which a human is talking to an automated bot, such as IVR, a voice assistant, or an automated kiosk.
                                    video: Optimized for audio sourced from videos.
                                    medical: Optimized for audio with medical oriented vocabulary.
                                    drivethru: Optimized for audio sources from drivethrus.
                                    automotive: Optimized for audio with automative oriented vocabulary.
         * 
         * 
         */
        this.dgConnection = this.deepgramClient.listen.live({
            model: "nova",
            language: "en",
            punctuate: true,
            smart_format: true,
            ...options                
        });

        this._setKeepAlive(); 
        this.dgConnection.on('    ', (event: import("@deepgram/sdk").LiveTranscriptionEvent) => {
            console.log(event);
        });

        this.dgConnection.on('error', (error: Error) => {
            console.error(error);
            clearInterval(this.keepAlive);
            this.emit("connectionError");
        });

        this.dgConnection.on('close', () => {
            clearInterval(this.keepAlive);
            this.emit("connectionClose");
            this.dgConnection = null;
        });

        this.dgConnection.on('open', () => {
            this.emit("connectionOpen");
        });

        return new Promise((resolve, reject) => {
            if (this.dgConnection) {
                resolve(this.dgConnection);
            } else {
                reject();
            }
        })
    
    }

    _setKeepAlive() {
        this.keepAlive = setInterval(() => {
            this.dgConnection.ping();
        }, 30000);
    }
    
}

class Deepgram {
  apiKey = null;
  deepgram = null;
  constructor(apiKey) {
    // If the instance has already been created, return it
    if (Deepgram.instance && Deepgram.instance.apiKey === apiKey) {
      return Deepgram.instance;
    }

    this.apiKey = apiKey || process.env.DEEPGRAM_API_KEY;
    // If the apiKey is not defined, throw an error
    if (!this.apiKey) {
      throw new Error("No apiKey provided");
    }
    Deepgram.instance = this;
  }

  createClient(config = {}) {
    try {
      this.deepgram = createClient(this.apiKey, {
        // global: { url: "https://api.beta.deepgram.com", headers: {} },
        // restProxy: { url: "http://localhost:8080" }
        // fetch: {}
        // _experimentalCustomFetch: () => {}
        ...config,
      });
      return this.deepgram;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Null pointer reference in Deepgram.createClient()");
      }
      if (error instanceof Error) {
        throw new Error(
          `Unhandled exception in Deepgram.createClient(): ${error.message}`
        );
      }
      throw new Error("Unknown error in Deepgram.createClient()");
    }
  }

  async prerecorded(file, options = {}) {
    try {
      if (!file) {
        throw new TypeError("Missing file argument");
      }
  
      const transcriptor = file.startsWith("http")
        ? {
            transcribe: "transcribeUrl",
            source: { url: file },
          }
        : {
            transcribe: "transcribeFile",
            source: fs.existsSync(file)
              ? fs.createReadStream(file)
              : null,
          };
  
      if (transcriptor.source === null) {
        throw new TypeError("Failed to create read stream for file");
      }
  
      const { result, error } = await this.deepgram.listen.prerecorded[
        transcriptor.transcribe
      ](transcriptor.source, {
        smart_format: true,
        model: "nova-2",
        language: "en-US",
        ...options,
      });
  
      if (error) {
        throw error;
      }
      console.dir(result, { depth: null });
  
      return result;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          "Null pointer reference in Deepgram.prerecorded()"
        );
      }
      if (error instanceof Error) {
        throw new Error(
          `Unhandled exception in Deepgram.prerecorded(): ${error.message}`
        );
      }
      throw new Error("Unknown error in Deepgram.prerecorded()");
    }
  }






}

class DeepgramRecorder {
  constructor(client, stream, options = {}) {
    this.client = client;
    this.stream = stream;
    this.options = options;
    this.socket = new WS(
      this.options.wsUrl || "wss://api.deepgram.com/v1/listen",
      ["v1.listen"]
    );
    this.recorder = new MediaRecorder(this.stream, {
      mimeType: "audio/webm; codecs=opus",
    });
    this.recorder.onstop = this.onStop.bind(this);
    this.socket.onopen = this.onSocketOpen.bind(this);
    this.socket.onmessage = this.onSocketMessage.bind(this);
  }

  start() {
    this.recorder.start();
  }

  stop() {
    this.recorder.stop();
  }

  onStop() {
    this.socket.send(
      this.recorder.stream.getTracks()[0].getAudioTracks()[0].getSettings()
        .deviceId
    );
  }

  onSocketOpen() {
    this.socket.send(
      JSON.stringify({
        type: "init",
        config: this.options.config || {},
      })
    );
  }

  onSocketMessage(message) {
    const data = JSON.parse(message.data);
    if (data.type === "init") {
      this.socket.send(
        JSON.stringify({
          type: "start",
          config: this.options.config || {},
        })
      );
      this.stream.getTracks().forEach((track) => {
        this.socket.send(track.getSettings().deviceId);
      });
    } else if (data.type === "transcription") {
      this.options.onTranscription(data.transcription);
    }
  }
}


export const httpRequest = () => {
    const url = '';
    request()
}

export default Deepgram;
