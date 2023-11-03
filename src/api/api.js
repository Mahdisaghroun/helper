import axios from "axios"
import moment from "moment";
import globalconfig from '../config.json'
let ELEVENTOKEN = "Bearer FBVKACGN37JQC5SFA0OVK8KKSIOP153G,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5Nzc2NzU3MDgsImlhdCI6MTY2MjMxNTcwOCwiaWRlbnRpdHlfaWQiOiIxNzg0NTE5IiwiaXNzIjoiYXV0aF9zdmMiLCJvcmdfaWQiOiJlc2dwIn0.SuDbxqD29r0IaU5XfRzVP_GrByxrfINu7VZKj6fsdUc"


export const getElevenSportDta = (tabId) => {
  var d = new Date();
  let orderType = tabId == "EVENT_STATUS_SCHEDULED" || tabId == "EVENT_STATUS_FINISHED" ? "ASC" : "DESC"
  d.setUTCHours(0, 0, 0, 0);
  console.log(d.toISOString());
  const today = new Date(Date.now());
  const iso = d.toISOString()
  console.log(iso)
  var config = {
    method: 'get',
    url: 'https://mcls-api.mycujoo.tv/bff/events/v1beta1?order_by=ORDER_START_TIME_' + orderType + '&page_size=100&start_after_time=' + iso + '&status=' + tabId,
    headers: {

      'accept': '*/*',
      'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'authorization': 'Bearer FBVKACGN37JQC5SFA0OVK8KKSIOP153G,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5Nzc2NzU3MDgsImlhdCI6MTY2MjMxNTcwOCwiaWRlbnRpdHlfaWQiOiIxNzg0NTE5IiwiaXNzIjoiYXV0aF9zdmMiLCJvcmdfaWQiOiJlc2dwIn0.SuDbxqD29r0IaU5XfRzVP_GrByxrfINu7VZKj6fsdUc',


    }
  };



  return axios(config)
}
export const getElevenSportDtaFifa = (tabId) => {
  var d = new Date();

  let orderType = tabId == "EVENT_STATUS_SCHEDULED" || tabId == "EVENT_STATUS_FINISHED" ? "ASC" : "DESC"
  console.log(d.toISOString());
  const today = new Date(Date.now());
  const iso = d.toISOString().split('T')[0];
  console.log(iso)
  var config = {
    method: 'get',
    url: 'https://mcls-api.mycujoo.tv/bff/events/v1beta1?order_by=ORDER_START_TIME_' + orderType + '&page_size=100&start_after_time=' + iso + 'T00%3A01%3A00.000Z&status=' + tabId,
    headers: {



      'authorization': 'Bearer 0FIQ3SKOSF09NH33IQO7IRARV5BSPT2N',

      'accept': '*/*',



    }
  };



  return axios(config)
}
export const getElevenSportDtaItaliaLiveById = (id,link) => {
  var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: link+'/id',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      id: id
    }
  };

  return axios(config)
}
export const getElevenSportDtaItaliaLive = (link) => {


  var config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: link,
    headers: {
      'Content-Type': 'application/json'
    },

  };

  return axios(config)


}
export const getElevenSportDtaItalia = (tabId) => {
  var d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  let orderType = tabId == "EVENT_STATUS_SCHEDULED" || tabId == "EVENT_STATUS_FINISHED" ? "ASC" : "DESC"
  console.log(d.toISOString());
  const today = new Date(Date.now());
  const iso = d.toISOString()
  console.log(iso)
  var config = {
    method: 'get',
    url: 'https://mcls-api.mycujoo.tv/bff/events/v1beta1?order_by=ORDER_START_TIME_' + orderType + '&page_size=100&start_after_time=' + iso + '&status=' + tabId + '&country_codes=IT',
    headers: {

      'accept': '*/*',
      'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'authorization': 'Bearer FBVKACGN37JQC5SFA0OVK8KKSIOP153G,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5Nzc2NzU3MDgsImlhdCI6MTY2MjMxNTcwOCwiaWRlbnRpdHlfaWQiOiIxNzg0NTE5IiwiaXNzIjoiYXV0aF9zdmMiLCJvcmdfaWQiOiJlc2dwIn0.SuDbxqD29r0IaU5XfRzVP_GrByxrfINu7VZKj6fsdUc',


    }
  };



  return axios(config)
}
export const getF1Data = (link) => {
  var config = {
    method: 'get',
    url: link,
    headers: {}
  };

  return axios(config)

}
export const refreshF1Token = () => {
  var config = {
    method: 'get',
    url: globalconfig.f1_url + 'refresh',
    headers: {}
  };
  return axios(config)
}
export const SignInLNP = () => {

  var data = '{"email":"pcserviceh24@gmail.com","password":"vK33Pe2wvl"}';

  var config = {
    method: 'post',
    url: 'https://prod-api.viewlift.com/identity/signin?site=lnp&deviceId=browser-808afc3d-b761-423f-932a-92b103be938f',
    headers: {
      'authority': 'prod-api.viewlift.com',
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'content-type': 'application/json;charset=UTF-8',
      'origin': 'null',
      'sec-ch-ua': '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
    },
    data: data
  };

  return axios(config)


}
export const fetchingSerieA = () => {
  var config = {
    method: 'get',
    url: 'https://prod-api-cached-2.viewlift.com/content/pages?path=%2Fwatch-live&site=lnp&includeContent=true&moduleOffset=0&moduleLimit=50&languageCode=it&countryCode=IT&userState=eyJzdGF0ZSI6WyJzdWJzY3JpYmVkIl0sImNvbnRlbnRGaWx0ZXJJZCI6bnVsbH0%3D',
    headers: {}
  };

  return axios(config)

}
export const fetchingSerieB = () => {
  var config = {
    method: 'get',
    url: 'https://prod-api-cached-2.viewlift.com/content/pages?path=%2Flive-serie-b&site=lnp&includeContent=true&moduleOffset=0&moduleLimit=50&languageCode=it&countryCode=IT&userState=eyJzdGF0ZSI6WyJzdWJzY3JpYmVkIl0sImNvbnRlbnRGaWx0ZXJJZCI6bnVsbH0%3D',
    headers: {}
  };

  return axios(config)



}
export const fetchWithIdLNP = (id, token) => {


  var config = {
    method: 'get',
    url: "https://prod-api.viewlift.com/entitlement/video/status?id=" + id + "&deviceType=web_browser&contentConsumption=web",
    headers: {

      "Host": "prod-api.viewlift.com",
      'Authorization': token,
      "Origin": "https://lnppass.legapallacanestro.com",
      "x-api-key": "PBSooUe91s7RNRKnXTmQG7z3gwD2aDTA6TlJp6ef"


    }
  };



  return axios(config)
}
export const fetchHilightData = (url) => {
  var data = {
    method: 'get',
    url: 'https://feed.entertainment.tv.theplatform.eu/f/PR1GhC/mediaset-prod-all-programs-v2?byCustomValue={subBrandId}{100018726}&sort=:publishInfo_lastPublished|desc,tvSeasonEpisodeNumber|desc&range=0-10',
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Mobile/15E148 Snapchat/10.77.5.59 (like Safari/604.1)'
    }
  };
  var config = {
    method: 'post',
    url: url + '/excute',
    data: data
  };
  return axios(config)

}
export const GetRaiList = (raiUrl) => {
  var data = {
    method: "get",
    url: "https://www.raiplay.it/palinsesto/onAir.json",
    headers: {}
  };

  var config = {
    method: 'post',
    url: raiUrl + '/excute',
    headers: {

    },
    data: data
  };

  return axios(config)


}
export const fetchDiscovery = (link) => {
  //http://185.221.173.62:3001/
  var config = {
    method: 'get',
    url: link,
    headers: {}
  };

  return axios(config)

}
export const getMotoGP = (link)=>{

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: link,
  headers: { 
    'authority': 'secure.motogp.com', 
    'accept': '*/*', 
    'accept-language': 'en', 
    
   
  }
};

return axios.request(config)


}
