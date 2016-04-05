var preflightdict = [];


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
}

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

function addPreFlightDestination(e) {
  console.log("adding to preflight dictionary");
  for(var header of e.responseHeaders){
    if(header.name == "Preflight"){
	preflightdict[getHostname(e.url)] = header.value;      
	/*preflightdict.push({
        key : getHostname(e.url),
        value : header.value});
	*/
      console.log("dictionary successfully updated");
    }
  }
}
      
    
function preFlightRequest(e) {
  
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
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
        console.log(xhttp.responseText);
    }
  }
  console.log("Sending request to" + domainHost + "/" + preflightdict[getHostname(e.url)]);
  xhttp.open("GET", domainHost + "/" + preflightdict[getHostname(e.url)], false);
  xhttp.send();

  }

/*	var xhttp;
	//referer = getReferer(e.requestHeaders);
	//cookievalue = getCookieValue(e.requestHeaders);
	//cookiepropertyheader = getCookiePropertyHeader(e.requestHeaders);
	//type = getType(e.requestHeaders);
	//host = getHostHeader(e.requestHeaders);
	//domainhost = getDomainName(host);
console.log("Sending request");
xhttp = new XMLHttpRequest();
xhttp.open("GET", "http://www.google.com", true);
//xhttp.setRequestHeaders("Content-Type", type);
//xhttp.setRequestHeaders("Host", host);
//xhttp.setRequestHeaders("Referer", referer);
//xhttp.setRequestHeaders("Cookie-Value", eecs588);
//xhttp.setRequestHeaders("Cookie-Property", eecs588);
//xhttp.setRequestHeaders("Cookie", eecs588);
xhttp.send();
*/


//	xhttp.onreadystatechange = function() {
//  		if (xhttp.readyState == 4 && xhttp.status == 200) {
//    			//document.getElementById("demo").innerHTML = xhttp.responseText;
//			var controlstring = xhttp.responseText;
//			DropSameOriginCookie(controlstring);
// 		}
  return {requestHeaders: e.requestHeaders};
}

chrome.webRequest.onBeforeSendHeaders.addListener(preFlightRequest,
                                          {urls: ["<all_urls>"]},
                                          ["blocking", "requestHeaders"]);


chrome.webRequest.onHeadersReceived.addListener(addPreFlightDestination,
                                          {urls: ["<all_urls>"]},
                                          [ "responseHeaders"]);





