chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    setTimeout(function () {
        if (request.method == 'getLocalStorage') sendResponse({ data: localStorage.getItem(request.key) });
        else sendResponse({}); // snub them.
    }, 1);
    return true;
});
