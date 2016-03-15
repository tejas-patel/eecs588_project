var currentTab;
var compressionOn = false;

var tabStatus = {};
var domainStatus = {};

function getHostname(href) {
  var l = document.createElement("a");
  l.href = href;
  return l.hostname;
};

function getDomainName(hostname){

  domainParts = hostname.split(".");
  return domainParts[domainParts.length-2]+"."+domainParts[domainParts.length-1];
}

/*
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 */
function updateIcon() {
  chrome.browserAction.setIcon({
    path: compressionOn ? {
      38: "icons/off_logo_burned.png"
    } : {
      38: "icons/on_logo_burned.png"
    },
    tabId: currentTab.id
  });  
}

function changeCurrentTabStatus(){
  browser.tabs.getCurrent(
    function(tab) {
      console.log(tabStatus[currentTab.id])
      tabStatus[currentTab.id] = !tabStatus[currentTab.id];
      console.log(tabStatus[currentTab.id])
      compressionOn = tabStatus[currentTab.id];
      console.log(compressionOn);
      updateIcon();
    } 
  );
}


/*
 * Add or remove the bookmark on the current page.
 */
function toggleCompression() {
  if (compressionOn) {
      domain = getDomainName(getHostname(currentTab.url));
      domainStatus[domain] = false;
      changeCurrentTabStatus();  
  } else {
      domain = getDomainName(getHostname(currentTab.url));
      domainStatus[domain] = true;
      changeCurrentTabStatus();    
  }
}

chrome.browserAction.onClicked.addListener(toggleCompression);

/*
 * Switches currentTab and currentBookmark to reflect the currently active tab
 */
function updateTab() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {

      currentTab = tabs[0];
      hostname = getHostname(currentTab.url);
      domain = getDomainName(hostname);
      if(domain && domainStatus[domain]){
          tabStatus[currentTab.id] = true;
      }
      
      compressionOn = tabStatus[currentTab.id];
      updateIcon();
    }
  });
}

function newTab(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {

      currentTab = tabs[0];
      
      hostname = getHostname(currentTab.url);
      domain = getDomainName(hostname);


      if(tabStatus[currentTab.id] == null){
          tabStatus[currentTab.id] = false;  
      } 
      if(domain && domainStatus[domain]){
          tabStatus[currentTab.id] = true;
      }
      console.log("Domain:"+domain);
      compressionOn = tabStatus[currentTab.id];
      updateIcon();
    }
  });

}

// TODO listen for bookmarks.onCreated and bookmarks.onRemoved once Bug 1221764 lands

// listen to tab URL changes
chrome.tabs.onUpdated.addListener(updateTab);

// listen to tab switching
chrome.tabs.onActivated.addListener(updateTab);

chrome.tabs.onCreated.addListener(newTab);

// update when the extension loads initially
updateTab();



function getReferer(e){
  for (var header of e.requestHeaders) {
      if (header.name == "Referer") {
        console.log("Referer:"+header.value);
        return header.value;  
      }
    }
}

function getHostHeader(e){
  for (var header of e.requestHeaders) {
      if (header.name == "Host") {
        console.log("Host:"+header.value);
        return header.value;  
      }
    }
}

/*
Rewrite the User-Agent header to "ua".
*/
function rewriteAcceptEncoding(e) {
  referer = getReferer(e);
  domainReferer = getDomainName(getHostname(referer));

  hostHeader = getHostHeader(e);
  domainHost = getDomainName(hostHeader);

  console.log("Ref:"+domainReferer + "Host:"+domainHost);

  if(tabStatus[currentTab.id]==true || (domainStatus[domainHost] == true && domainHost!=domainReferer)){
    for (var header of e.requestHeaders) {
      if (header.name == "Accept-Encoding") {
        console.log(header.value);
        header.value = "identity;gzip;q=0,deflate;q=0";
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
chrome.webRequest.onBeforeSendHeaders.addListener(rewriteAcceptEncoding,
                                          {urls: ["<all_urls>"]},
                                          ["blocking", "requestHeaders"]);

