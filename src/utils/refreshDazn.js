import Axios from "axios";

let data = JSON.stringify({
  "DeviceId": "00488237d3"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://ott-authz-bff-prod.ar.indazn.com/v5/RefreshAccessToken',
  headers: { 
    'accept': '*/*', 
    'accept-language': 'fr,en-US;q=0.9,en;q=0.8,fr-FR;q=0.7', 
    'authorization': 'Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IjJXZlVweldreUxEcS1aOXkyRG1Yb0VwNXM3SHBYd3FnZGluallsS3c5NWsifQ.eyJ1c2VyIjoiMjU4NTZjZTgtMmRlNy00YTE3LWE3NDItZjQ0NjM0ZGZjOTQ3IiwiaXNzdWVkIjoxNzExOTA2OTUxLCJ1c2Vyc3RhdHVzIjoiQWN0aXZlUGFpZCIsInNvdXJjZVR5cGUiOiIiLCJwcm9kdWN0U3RhdHVzIjp7IkZJQkEiOiJBY3RpdmVQYWlkIiwiTGlnYVNlZ3VuZGEiOiJQYXJ0aWFsIiwiTkZMIjoiQWN0aXZlUGFpZCIsIkRBWk4iOiJBY3RpdmVQYWlkIn0sInZpZXdlcklkIjoiZjQ0NjM0ZGZjOTQ3IiwiY291bnRyeSI6InRuIiwiY29udGVudENvdW50cnkiOiJ0biIsImlzUHVyY2hhc2FibGUiOmZhbHNlLCJob21lQ291bnRyeSI6Iml0IiwidXNlclR5cGUiOjMsImRldmljZUlkIjoiMjU4NTZjZTgtMmRlNy00YTE3LWE3NDItZjQ0NjM0ZGZjOTQ3LTAwNDg4MjM3ZDMiLCJpc0RldmljZVBsYXlhYmxlIjpmYWxzZSwicGxheWFibGVFbGlnaWJpbGl0eVN0YXR1cyI6IkVMSUdJQkxFIiwiY2FucmVkZWVtZ2MiOiJFbmFibGVkIiwianRpIjoiNjMxZmRmMzUtOWQzNC00OTg5LTliZDItODRlZGZkNzYyOTAxIiwiaWRwVHlwZSI6ImlkcC1wYXNzd29yZCIsInByb3ZpZGVyTmFtZSI6ImRhem4iLCJwcm92aWRlckN1c3RvbWVySWQiOiIwNTQ3NzZkYy1lZGI4LTQwZWQtYmJlYy00M2FmYzRjZDBjMGEiLCJlbnRpdGxlbWVudHMiOnsiZW50aXRsZW1lbnRTZXRzIjpbeyJpZCI6Imtub2Nrb3V0X2NoYW9zIiwicHJvZHVjdFR5cGUiOiJwcHYiLCJlbnRpdGxlbWVudHMiOlsia25vY2tvdXRfY2hhb3Nfcm93Iiwia25vY2tvdXRfY2hhb3NfZ2JfaWUiLCJrbm9ja291dF9jaGFvc19jYSIsImtub2Nrb3V0X2NoYW9zX3VzIiwia25vY2tvdXRfY2hhb3NfZGFjaCIsImtub2Nrb3V0X2NoYW9zX2l0Iiwia25vY2tvdXRfY2hhb3NfZXMiLCJrbm9ja291dF9jaGFvc19iZSIsImtub2Nrb3V0X2NoYW9zX3B0Iiwia25vY2tvdXRfY2hhb3NfdHciLCJrbm9ja291dF9jaGFvc19iciIsImtub2Nrb3V0X2NoYW9zX2pwIl19LHsiaWQiOiJ0aWVyX3NpbHZlcl9pdCIsInByb2R1Y3RUeXBlIjoidGllciIsImVudGl0bGVtZW50cyI6WyJlbnRpdGxlbWVudF9hbGxvd193YXRjaF9jb25jdXJyZW5jeV93aXRoX3NpbmdsZV9sb2NhdGlvbiIsImVudGl0bGVtZW50X211bHRpcGxlX2RldmljZXNfOTk5IiwiZW50aXRsZW1lbnRfYWxsb3dfY2FzdGluZyIsImVfc2lsdmVyX2l0IiwiZV9zaWx2ZXJfYXJ0X2l0IiwiYmFzZV9kYXpuX2NvbnRlbnQiXX0seyJpZCI6InRpZXJfZmliYV9wcm8iLCJwcm9kdWN0VHlwZSI6InRpZXIiLCJlbnRpdGxlbWVudHMiOlsiZW50X2ZpYmFfcHJvX3VzIiwiZW50X2ZpYmFfcHJvX3R3IiwiZW50X2ZpYmFfcHJvX2VzIiwiZW50X2ZpYmFfcHJvX3JvdyIsImVudF9maWJhX3Byb19wdCIsImVudF9maWJhX3Byb19qcCIsImVudF9maWJhX3Byb19pdCIsImVudF9maWJhX3Byb19kZSIsImVudF9maWJhX3Byb19mciIsImVudF9maWJhX3Byb19jYSIsImVudF9maWJhX3Byb19iciIsImVudF9maWJhX3Byb19iZSIsImVudF9maWJhX3Byb19jb21wZXRpdGlvbnMiXX0seyJpZCI6InRpZXJfbmZsX3BybyIsInByb2R1Y3RUeXBlIjoidGllciIsImVudGl0bGVtZW50cyI6WyJlbnRfbmZsX3BybyIsImVudGl0bGVtZW50X211bHRpcGxlX2RldmljZXNfMjAiXX1dLCJmZWF0dXJlcyI6eyJERVZJQ0UiOnsiYWNjZXNzX2RldmljZSI6ImFueSIsIm1heF9yZWdpc3RlcmVkX2RldmljZXMiOjk5OX0sIkNPTkNVUlJFTkNZIjp7Im1heF9kZXZpY2VzIjoyLCJtYXhfaXBzIjoxfSwiQ0FTVElORyI6dHJ1ZX19LCJsaW5rZWRTb2NpYWxQYXJ0bmVycyI6W10sImV4cCI6MTcxMTkxNDE1MSwiaXNzIjoiaHR0cHM6Ly9hdXRoLmFyLmluZGF6bi5jb20ifQ.ccCuQ7rR6oSE6tuyNU0kVDz7ckY2ICDJEvEUBbOtcFI0viLNvCYaus_6LgYlL7dnVFELCh_nMqsRrGJ2r7sVPwVgnM8PUvZ-2sz_aOURvewBH3yllT1LWyXv9zBJN1UsqqB2N7KR4wT3_oxxU3uOceeZb_tFSeIQTosD5Kg7LhYqzEdx1DqeOCu-7MSzJbyLcfZ9Ukv0wmhYl0BLAr_81g3dEQeBUrBxaHABpWW6a3m-iWkHINMdNvzbh3ga6QNtcguQJSkRn7OL4gBF4i14ph7_jsF-uBE9M-qRz0GHnMb5ymcAFOKJdckE1V3Cl5fGbKih8VpiJaOu8VrnIfNZ5w', 
    'content-type': 'application/json', 
    'origin': 'https://www.dazn.com', 
    'priority': 'u=1, i', 
    'referer': 'https://www.dazn.com/', 
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"macOS"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'cross-site', 
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 
    'x-session-id': 'b01dfc98-c1b5-46c9-aacd-b9dd0aa6c5d6'
  },
  data : data
};

return Axios.request(config)

