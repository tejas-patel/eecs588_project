
function getHostname(href) {
  var l = document.createElement("a");
  l.href = href;
  return l.hostname;
};

function getDomainName(hostname){

  domainParts = hostname.split(".");
  return domainParts[domainParts.length-2]+"."+domainParts[domainParts.length-1];
}



function getReferer(e){
  for (var header of e.requestHeaders) {
      if (header.name == "Referer") {
        //console.log("Referer:"+header.value);
        return header.value;  
      }
    }
}

function getHostHeader(e){
  for (var header of e.requestHeaders) {
      if (header.name == "Host") {
        //console.log("Host:"+header.value);
        return header.value;  
      }
    }
}

/*
Rewrite the User-Agent header to "ua".
*/
function dropCookieCrossSite(e) {
  referer = getReferer(e);
  domainReferer = getDomainName(getHostname(referer));

  hostHeader = getHostHeader(e);
  domainHost = getDomainName(hostHeader);

  if(domainHost!=domainReferer){
    console.log("type:"+e.type);
    console.log("Ref:"+domainReferer + " Host:"+domainHost);
  
    for (var header of e.requestHeaders) {
      console.log(header.name+":"+header.value);
      if (header.name == "Cookie") {
        //console.log("Dropping Cookie:"+header.value);
        //header.value = "";
      }
    }
  }
  return {requestHeaders: e.requestHeaders};
}

/*
Add rewriteUserAgentHeader as a listener to onBeforeSendHeaders,
only for the target page.
Make it "blocking" so we can modify the headers.
*/
chrome.webRequest.onBeforeSendHeaders.addListener(dropCookieCrossSite,
                                          {urls: ["<all_urls>"]},
                                          ["blocking", "requestHeaders"]);

