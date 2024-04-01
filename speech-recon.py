import speech_recognition as sr;
from pydub import AudioSegment;


# def recognize_speech(audio_file):
#     # Initialize the recognizer
#     recognizer = sr.Recognizer()

#     # Load the audio file
#     with sr.AudioFile(audio_file) as source:
#         audio = recognizer.record(source)

#     try:
#         # Use Baidu's DeepSpeech engine for Chinese recognition
#         print(recognizer)
#         recognized_text = recognizer.recognize_baidu(audio, app_key='UKBVNHDQ2OvdeQtCm2UfVa8u', secret_key='GKZWsnVRoVyjUaaGzCAlaDQWPH0bcxuF', dev_pid=1537)

#         # Print the recognized text
#         print("Recognized Text:", recognized_text)
#     except sr.UnknownValueError:
#         print("Speech recognition could not understand audio")
#     except sr.RequestError as e:
#         print("Could not request results from Baidu's DeepSpeech service; {0}".format(e))



def recognize_speech(audio_file):
    # Initialize the recognizer
    recognizer = sr.Recognizer()

    # Load the audio file
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)

    try:
        # Use the default speech recognition engine
        recognized_text = recognizer.recognize_google(audio, key=None, language='zh-CN', show_all=False)

        # Print the recognized text
        print("Recognized Text=====:", recognized_text)
    except sr.UnknownValueError:
        print("=====Speech recognition could not understand audio")
    except sr.RequestError as e:
        print("====Could not request results from speech recognition service; {0}".format(e))


# # audio_file = 'path/to/your/audio/file.wav'
# audio_file = '/Users/tliu1/Downloads/xxxx.mp3'

# audio = AudioSegment.from_mp3('/Users/tliu1/Downloads/xxxx.mp3')
# audio.export('/Users/tliu1/Downloads/xxxx.wav', format='wav')
recognize_speech('/Users/tliu1/Downloads/xxxx.wav')

