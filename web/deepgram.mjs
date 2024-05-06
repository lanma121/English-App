import fs from 'fs';
import dotenv from 'dotenv';
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import WS from './web-socket.mjs';

dotenv.config();
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY || '77b396cac08488d0ab439c764e98a1976acc5f31';

export default class {
    deepgram = null;
    keepAlive = null;

    constructor(config = {}) {
        if (!DEEPGRAM_API_KEY) {
            throw new Error("Missing DEEPGRAM_API_KEY in .env file")
        }
        try {
            this.deepgram = createClient(DEEPGRAM_API_KEY, {
                // global: { url: "https://api.beta.deepgram.com" },
                // restProxy: { url: "http://localhost:8080" }
                ...config
            });
        } catch (error) {
            console.error("Deepgram client construction error: ", error)
            throw error
        }
    }

    async prerecorded (file, options = {}) {
        if (!file) {
            throw new TypeError("Missing file argument");
        }

        const transcriptor = file.startsWith('http') ? {
            transcribe: 'transcribeUrl', source: { url: file } 
        }: { transcribe: 'transcribeFile', source: fs.existsSync(file) ? fs.createReadStream(file) : null };

        if (transcriptor.source === null) {
            throw new TypeError("Failed to create read stream for file");
        }

        const { result, error } = await this.deepgram.listen.prerecorded[transcriptor.transcribe](
            transcriptor.source,
            { smart_format: true, model: 'nova-2', language: 'en-US', ...options },
        );

        if (error) {
            throw error;
        }
        console.dir(result, {depth: null});
    }




    livestream = async (options = {}) => {

        try {
            const dgConnection = deepgram.listen.live({ 
                model: "nova",
                language: "en",
                punctuate: true,
                smart_format: true,
                ...options 
            });
    
            if (keepAlive) clearInterval(keepAlive);
            keepAlive = setInterval(() => {
                console.log("deepgram connection: keepalive");
                dgConnection.keepAlive();
            }, 10 * 1000);
            
            const ws = await WS.server({
                onmessage: (message) => {
                    console.log("socket: client data received");
                    if (dgConnection.getReadyState() === 1 /* OPEN */) {
                        console.log("socket: data sent to deepgram");
                        dgConnection.send(message);
                    } else if (dgConnection.getReadyState() >= 2 /* 2 = CLOSING, 3 = CLOSED */) {
                        console.log("socket: data couldn't be sent to deepgram");
                        console.log("socket: retrying connection to deepgram");
                        /* Attempt to reopen the Deepgram connection */
                        dgConnection.finish();
                        dgConnection.removeAllListeners();
                        dgConnection = livestream(options);
                    } else {
                        console.log("socket: data couldn't be sent to deepgram");
                    }
                },
                onclose: () => {
                    dgConnection.finish();
                    dgConnection.removeAllListeners();
                    dgConnection = null;
                }
            });

            dgConnection.on(LiveTranscriptionEvents.Open, () => {
                console.log("deepgram: connected");
                dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
                    console.log(data);
                    ws.send(JSON.stringify(data));
                });
    
                dgConnection.addListener(LiveTranscriptionEvents.Close, async () => {
                    console.log("deepgram: disconnected");
                    clearInterval(keepAlive);
                    dgConnection.finish();
                });
    
                dgConnection.addListener(LiveTranscriptionEvents.Error, async (error) => {
                    console.log("deepgram: error received");
                    console.error(error);
                });
    
                dgConnection.addListener(LiveTranscriptionEvents.Warning, async (warning) => {
                    console.log("deepgram: warning received");
                    console.warn(warning);
                  });
              
                dgConnection.addListener(LiveTranscriptionEvents.Metadata, (data) => {
                    console.log("deepgram: packet received");
                    console.log("deepgram: metadata received");
                    console.log("ws: metadata sent to client");
                    ws.send(JSON.stringify({ metadata: data }));
                });
    
                // source.addListener("got-some-audio", async (event) => {
                //     dgConnection.send(event.raw_audio_data);
                // });
            });
        } catch (error) {
            
        }

        return dgConnection;
    }


    const getProjectId = async () => {
        const { result, error } = await deepgram.manage.getProjects();
      
        if (error) {
          throw error;
        }
      
        return result.projects[0].project_id;
      };
      
      const getTempApiKey = async (projectId) => {
        projectId = projectId || await getProjectId();
        const { result, error } = await deepgram.manage.createProjectKey(projectId, {
          comment: "short lived",
          scopes: ["usage:write"],
          time_to_live_in_seconds: 20,
        });
      
        if (error) {
          throw error;
        }
      
        return result;
      };

    return {
        prerecorded,
        livestream,
        getProjectId,
        getTempApiKey,
    };

}