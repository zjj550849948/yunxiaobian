var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?7d0b4d1a3d993aa9e9bcf806dca6b5da";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

! function(p) {
    "use strict";
    ! function(t) {
        var s = window,
            e = document,
            i = p,
            c = "".concat("https:" === e.location.protocol ? "https://" : "http://", "sdk.51.la/js-sdk-pro.min.js"),
            n = e.createElement("script"),
            r = e.getElementsByTagName("script")[0];
        n.type = "text/javascript", n.setAttribute("charset", "UTF-8"), n.async = !0, n.src = c, n.id = "LA_COLLECT", i.d = n;
        var o = function() {
            s.LA.ids.push(i)
        };
        s.LA ? s.LA.ids && o() : (s.LA = p, s.LA.ids = [], o()), r.parentNode.insertBefore(n, r)
    }()
}({
    id: "3II91MJpNxV9UzxW",
    ck: "3II91MJpNxV9UzxW",
    autoTrack: true,
    hashMode: true
});