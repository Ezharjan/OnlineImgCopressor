let mobileTypes =
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;

let isMobile = function () {
    if (window.navigator.userAgent.match(mobileTypes)) {
        return true;
    } else {
        return false;
    }
};
