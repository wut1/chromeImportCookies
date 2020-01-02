let sure = document.getElementById('sure');
let formControlTextarea1 = document.getElementById('formControlTextarea1');

function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
  return match[2];
  }
  else {
      return null;
  }
}

function getDomain(url) {
  var hostName = getHostName(url);
  var domain = hostName;

  if (hostName != null) {
      var parts = hostName.split('.').reverse();

      if (parts != null && parts.length > 1) {
          domain = parts[1] + '.' + parts[0];

          if (hostName.toLowerCase().indexOf('.co.uk') != -1 && parts.length > 2) {
            domain = parts[2] + '.' + domain;
          }
      }
  }

  return domain;
}

function cookieForCreationFromFullCookie(fullCookie) {
  var newCookie = {};
  //If no real url is available use: "https://" : "http://" + domain + path
  newCookie.url = "http://" + fullCookie.domain + fullCookie.path;
  newCookie.name = fullCookie.name;
  newCookie.value = fullCookie.value;
  if (!fullCookie.hostOnly)
      newCookie.domain = fullCookie.domain;
  newCookie.path = fullCookie.path;
  newCookie.secure = false;
  newCookie.httpOnly = false;
  return newCookie;
}

function setCookies(value,currentTabURL){ 
        let domain = getDomain(currentTabURL)
        value.split(';').forEach(item =>{
          const str = item.trim().split('=');
          const fullCookie = {
            name:str[0],
            value: escape(str[1]),
            domain:domain,
            url:currentTabURL,
            path:'/'
          }
          var cookie = cookieForCreationFromFullCookie(fullCookie)
          chrome.cookies.set(cookie);
        })                             
}

  sure.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let currentTabURL = tabs[0].url;
      setCookies(formControlTextarea1.value.trim(),currentTabURL)
    });
  };