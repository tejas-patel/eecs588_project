var cookie_global = {};


function isIPaddress(ipaddress)   
{  
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return (true)  
  }  
  return (false)  
}  

function getHostname(href) {
  var l = document.createElement("a");
  l.href = href;
  return l.hostname;
};

function getDomainName(hostname){

  if(isIPaddress(hostname)){
    return hostname;
  }
  domainParts = hostname.split(".");
  if(domainParts.length>1){
    return domainParts[domainParts.length-2]+"."+domainParts[domainParts.length-1];
  } else{
    return domainParts[domainParts.length-1];
  }
}



function getReferer(e){
  for (var header of e) {
      if (header.name == "Referer") {
        //console.log("Referer:"+header.value);
        return header.value;  
      }
    }
}

function getHostHeader(e){
  for (var header of e) {
      if (header.name == "Host") {
        //console.log("Host:"+header.value);
        return header.value;  
      }
    }
}

function getType(e){
  for (var header of e) {
      if (header.name == "Accept") {
        //console.log("Host:"+header.value);
        values = header.value;
        value_arr = values.split(",");
        return value_arr[0];
      
      }
  }
}

function getCookiePropertyHeader(e){
  for(var header of e){
    if(header.name == "Cookie-Property"){
      return header.value;
    }
  }
}
function getCookieValue(e){
  for(var header of e){
    if(header.name == "Cookie"){
      return header.value;
    }
  }
}

function removeSameOrigin(cookieList, domain){
    cookieKeyValue = cookieList.split("; ");
    newCookieArray = [];
    for(var i in cookieKeyValue){
      keyValue = cookieKeyValue[i].split("=");
      console.log("keyValue[0]="+keyValue[0]+" keyvalue[1]="+keyValue[1]);
      if(!cookie_global[keyValue[0]] || cookie_global[keyValue[0]][domain]!="sameorigin"){
        newCookieArray.push(cookieKeyValue[i]);
      }
    }
    return newCookieArray.join("; ");
}

function setCookieProperty(e) {
  //console.log(e.responseHeaders["Content-Type"]);

  
  console.log("URL:"+e.url);
  hostname = getHostname(e.url);
  console.log("hostname:"+hostname);
  domainName = getDomainName(hostname);
  console.log("domainname:"+domainName);
  cookieValue = getCookiePropertyHeader(e.responseHeaders);
  if(cookieValue){
      cookieProperties = cookieValue.split("; ");
      for(var i in cookieProperties){
        console.log(cookieProperties[i]);
        propVal = cookieProperties[i].split("=");
        if(propVal[0] in cookie_global){
            cookie_global[propVal[0]][domainName] = propVal[1];
        } else{
            cookie_global[propVal[0]] = {};
            cookie_global[propVal[0]][domainName] = propVal[1];
        }
      }
  }
 
  console.log(cookie_global);
}

function dropSameOriginCookie(e){
  referer = getReferer(e.requestHeaders);
  console.log("Referer:"+referer);
  if(referer){
    domainReferer = getDomainName(getHostname(referer));
  } else{
    domainReferer = undefined;
  }
  hostHeader = getHostHeader(e.requestHeaders);
  domainHost = getDomainName(hostHeader);
  console.log("Ref:"+domainReferer+" host:"+domainHost);
  if(domainReferer && domainReferer!=domainHost && e.type!="main_frame"){
    for(var header of e.requestHeaders){
      if(header.name=="Cookie"){

        cookieValue = header.value;
        console.log("cookieValue:"+cookieValue);
        modCookieValue = removeSameOrigin(cookieValue, domainHost);
        header.value = modCookieValue;
        console.log("Mod Cookie:"+modCookieValue);
      }
    }
  }
 
  return {requestHeaders: e.requestHeaders};

}
chrome.webRequest.onHeadersReceived.addListener(setCookieProperty,
                                          {urls: ["<all_urls>"]},
                                          [ "responseHeaders"]);

chrome.webRequest.onBeforeSendHeaders.addListener(dropSameOriginCookie,
                                          {urls: ["<all_urls>"]},
                                          ["blocking", "requestHeaders"]);
