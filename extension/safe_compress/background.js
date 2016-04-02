
function getHostname(href) {
  var l = document.createElement("a");
  l.href = href;
  return l.hostname;
};

function getDomainName(hostname){

  domainParts = hostname.split(".");
  if(domainParts.length>1){
    return domainParts[domainParts.length-2]+"."+domainParts[domainParts.length-1];
  } else{
    return domainParts[domainParts.length-1];
  }
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

function getType(e){
  for (var header of e.requestHeaders) {
      if (header.name == "Accept") {
        //console.log("Host:"+header.value);
        values = header.value;
        value_arr = values.split(",");
        return value_arr[0];
      
      }
  }
}

/*
Rewrite the User-Agent header to "ua".
*/
function disableCompressionCrossSite(e) {
  console.log(e.url);
  referer = getReferer(e);
  console.log("Referer:"+referer);
  if(referer){
    domainReferer = getDomainName(getHostname(referer));
  } else{
    domainReferer = undefined;
  }
  hostHeader = getHostHeader(e);
  domainHost = getDomainName(hostHeader);
  contentType = getType(e);
  console.log("type:"+e.type);
  console.log("Ref:"+domainReferer + " Host:"+domainHost);
  console.log("Content:"+contentType);

  if(domainReferer && domainHost!=domainReferer){
    
    for (var header of e.requestHeaders) {
      if (header.name == "Accept-Encoding" && (contentType == "text/html" || contentType == "*/*")){
        //console.log("Dropping Cookie:"+header.value);
        header.value = "identity";
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
chrome.webRequest.onBeforeSendHeaders.addListener(disableCompressionCrossSite,
                                          {urls: ["<all_urls>"]},
                                          ["blocking", "requestHeaders"]);

