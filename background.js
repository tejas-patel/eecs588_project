
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



function preFlightRequest(e) {

	var xhttp;

	//referer = getReferer(e.requestHeaders);
	//cookievalue = getCookieValue(e.requestHeaders);
	//cookiepropertyheader = getCookiePropertyHeader(e.requestHeaders);
	//type = getType(e.requestHeaders);
	//host = getHostHeader(e.requestHeaders);
	//domainhost = getDomainName(host);

xhttp = new XMLHttpRequest();
xhttp.open("GET", "http://www.hollerjohn.com", true);
//xhttp.setRequestHeaders("Content-Type", type);
//xhttp.setRequestHeaders("Host", host);
//xhttp.setRequestHeaders("Referer", referer);
//xhttp.setRequestHeaders("Cookie-Value", eecs588);
//xhttp.setRequestHeaders("Cookie-Property", eecs588);
//xhttp.setRequestHeaders("Cookie", eecs588);
xhttp.send();



//	xhttp.onreadystatechange = function() {
//  		if (xhttp.readyState == 4 && xhttp.status == 200) {
//    			//document.getElementById("demo").innerHTML = xhttp.responseText;
//			var controlstring = xhttp.responseText;
//			DropSameOriginCookie(controlstring);
// 		}

}

chrome.webRequest.onBeforeSendHeaders.addListener(preFlightRequest,
                                          {urls: ["<all_urls>"]},
                                          ["blocking", "requestHeaders"]);







