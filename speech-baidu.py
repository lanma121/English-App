import requests

def recognize_speech_baidu(audio_file, api_key, secret_key):
    url = "https://vop.baidu.com/server_api"  # Baidu API endpoint

    with open(audio_file, 'rb') as file:
        audio_data = file.read()

    headers = {
        'Content-Type': 'audio/wav',
    }

    params = {
        'cuid': 'your_unique_user_id',
        'token': 'your_access_token',
        'dev_pid': '1536',  # Language code for Mandarin Chinese
    }

    auth_headers = {
        'Content-Type': 'application/json',
    }

    auth_params = {
        'grant_type': 'client_credentials',
        'client_id': api_key,
        'client_secret': secret_key,
    }

    # Fetch access token
    auth_response = requests.get('https://openapi.baidu.com/oauth/2.0/token', params=auth_params, headers=auth_headers)
    access_token = auth_response.json()['access_token']

    headers['Content-Type'] = 'audio/wav; rate=16000'  # Set the appropriate audio format and sample rate

    params['token'] = access_token

    response = requests.post(url, params=params, headers=headers, data=audio_data)

    if response.ok:
        result = response.json()
        if 'result' in result:
            recognized_text = result['result'][0]
            print("Recognized Text:", recognized_text)
        else:
            print("No speech recognized.")
    else:
        print("Error occurred during speech recognition.")

# Example usage
audio_file = '/Users/tliu1/Downloads/xxxx.wav'
api_key = 'UKBVNHDQ2OvdeQtCm2UfVa8u'
secret_key = 'GKZWsnVRoVyjUaaGzCAlaDQWPH0bcxuF'
recognize_speech_baidu(audio_file, api_key, secret_key)
