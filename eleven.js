var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://mcls-api.mycujoo.tv/bff/events/v1beta1?order_by=ORDER_START_TIME_DESC&page_size=100&start_after_time=2023-02-24T00:00:00.000Z&status=EVENT_STATUS_STARTED&country_codes=IT',
  'headers': {
    'authority': 'mcls-api.mycujoo.tv',
    'accept': '*/*',
    'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'authorization': 'Bearer FBVKACGN37JQC5SFA0OVK8KKSIOP153G,eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5Nzc2NzU3MDgsImlhdCI6MTY2MjMxNTcwOCwiaWRlbnRpdHlfaWQiOiIxNzg0NTE5IiwiaXNzIjoiYXV0aF9zdmMiLCJvcmdfaWQiOiJlc2dwIn0.SuDbxqD29r0IaU5XfRzVP_GrByxrfINu7VZKj6fsdUc',
    'if-modified-since': 'Fri, 24 Feb 2023 12:55:17 GMT',
    'origin': 'http://185.221.173.62:5678',
    'referer': 'http://185.221.173.62:5678/',
    'sec-ch-ua': '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
