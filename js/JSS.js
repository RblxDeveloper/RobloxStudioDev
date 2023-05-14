function createElement(t, e, n, o, i) {
    "use strict";
    null == o && (o = []);
    let l = Object.keys(o);
    if (null == n) return null;
    ("string" != typeof n && "number" != typeof n) ||
        (n = document.getElementById(n));
    let r,
        c,
        s = "";
    for (
        r = null == i ? document.createElement(e) : document.createElementNS(i, e),
        null === n ? document.body.appendChild(r) : n.appendChild(r),
        c = 0;
        c < l.length;
        c += 1
    )
        s = s + l[c] + ": " + o[l[c]] + "; ";
    return r.setAttribute("style", s), r.setAttribute("id", t), r;
}
function setCSS(t, e, n) {
    "use strict";
    if (null == t) return null;
    ("string" != typeof t && "number" != typeof t) ||
        (t = document.getElementById(t));
    let o,
        i,
        l,
        r,
        c,
        s = t,
        u = s.getAttribute("style").split("; "),
        a = !1,
        p = "";
    for (u.pop(), o = 0; o < u.length; o += 1)
        (l = "|| " + u[o] + " ||"),
            (r = l.split("|| ").pop().split(": ")[0]),
            (c = l.split(": ").pop().split(" ||")[0]),
            r === e && ((u[o] = e + ": " + n), (a = !0));
    for (!1 === a && u.push(e + ": " + n), i = 0; i < u.length; i += 1)
        p = p + u[i] + "; ";
    s.setAttribute("style", p);
}
function removeCSS(t, e) {
    "string" == typeof t && (t = document.getElementById(t));
    let n = t.getAttribute("style").split("; ");
    for (n.pop(), i = 0; i < n.length; i += 1)
        (CurrentCheck = "|| " + n[i] + " ||"),
            (FirstPart = CurrentCheck.split("|| ").pop().split(": ")[0]),
            (SecondPart = CurrentCheck.split(": ").pop().split(" ||")[0]),
            FirstPart === e && (n[i] = "");
    let o = "";
    for (p = 0; p < n.length; p += 1) "" != n[p] && (o = o + n[p] + "; ");
    t.setAttribute("style", o);
}
function getCSS(t, e) {
    "use strict";
    if (null == t) return null;
    ("string" != typeof t && "number" != typeof t) ||
        (t = document.getElementById(t));
    let n,
        o,
        i,
        l,
        r = t,
        c = r.getAttribute("style").split("; ");
    if (c.length < 2) return "";
    for ("" == c[c - 1] && c.pop(), n = 0; n < c.length; n += 1)
        if (
            ((o = "|| " + c[n] + " ||"),
                (i = o.split("|| ").pop().split(": ")[0]),
                (l = o.split(": ").pop().split(" ||")[0]),
                i === e)
        )
            return l;
    return r && r.currentStyle
        ? r.currentStyle[e]
        : r && window.getComputedStyle
            ? document.defaultView.getComputedStyle(r, null).getPropertyValue(e)
            : void 0;
}
function find(t) {
    "use strict";
    return document.getElementById(t);
}
function findClass(t) {
    "use strict";
    return document.getElementsByClassName(t);
}
function ranInt(t, e) {
    "use strict";
    return Math.floor(Math.random() * (e - t)) + t;
}
function setClass(t, e) {
    "use strict";
    document.getElementById(t).className = e;
}
function removeAllChilds(t) {
    for (; t.firstChild;) t.removeChild(t.firstChild);
}
function getElementUnderMouse(t) {
    return document.elementFromPoint(t.clientX, t.clientY);
}
function getScript(t) {
    return document.getElementById(t);
}
function loadScript(t) {
    let e = getScript(t);
    null != e && e.remove();
    let n = document.createElement("script");
    return (n.src = t), (n.id = t), document.body.appendChild(n), n;
}
function removeScript(t) {
    let e = getScript(t);
    null != e && e.remove();
}
function getImageDimensions(t) {
    return new Promise(function (e, n) {
        let o = new Image();
        (o.onload = function () {
            e(o.height);
        }),
            (o.onerror = function () {
                e(0);
            }),
            (o.src = t);
    });
}
function getPageURLPath(t) {
    return "file:" == window.location.protocol ||
        0 == window.location.origin.includes("https")
        ? null
        : window.location.pathname.split("/")[t];
}
function getCookieValue(t) {
    let e = t + "=",
        n = decodeURIComponent(document.cookie).split(";");
    for (let t = 0; t < n.length; t++) {
        let o = n[t];
        for (; " " == o.charAt(0);) o = o.substring(1);
        if (0 == o.indexOf(e)) return o.substring(e.length, o.length);
    }
    return null;
}
function disableScrolling() {
    let t = window.scrollX,
        e = window.scrollY;
    window.onscroll = function () {
        window.scrollTo(t, e);
    };
}
function enableScrolling() {
    window.onscroll = function () { };
}
function checkElementVisible(t, e) {
    return (
        e.scrollTop - t.offsetHeight + 10 < t.offsetTop &&
        t.offsetTop < e.scrollTop + e.clientHeight - 30
    );
}
function deviceIsMobile() {
    let t = !1;
    var e;
    return (
        (e = navigator.userAgent || navigator.vendor || window.opera),
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            e
        ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                e.substr(0, 4)
            )) &&
        (t = !0),
        t
    );
}
function timestampToString(t) {
    let e = {
        Year: 31536e3,
        Month: 2678400,
        Week: 604800,
        Day: 86400,
        Hour: 3600,
        Minute: 60,
        Second: 1,
    },
        n = {},
        o = Object.keys(e);
    for (let i = 0; i < o.length; i++) {
        let l = e[o[i]];
        for (; t - l > 0;)
            null == n[o[i]] ? (n[o[i]] = 1) : (n[o[i]] += 1), (t -= l);
    }
    let i = "",
        l = Object.keys(n);
    for (let t = 0; t < l.length; t++) {
        let e = n[l[t]];
        i += e > 1 ? e + " " + l[t] + "s  " : e + " " + l[t] + "  ";
    }
    return i;
}
function checkElementVisible(t, e) {
    return (
        e.scrollTop - t.offsetHeight + 10 < t.offsetTop &&
        t.offsetTop < e.scrollTop + e.clientHeight - 30
    );
}
function OutlineHoverOver(t) {
    t.style.backgroundColor = ThemeColors.GreyOutline;
}
function OutlineHoverOut(t) {
    t.style.backgroundColor = "rgb(255, 255, 255, 0)";
}
function isInViewport(t) {
    let e = t.getBoundingClientRect();
    return (
        e.y + t.offsetHeight > 0 &&
        e.y < (window.innerHeight || document.documentElement.clientHeight)
    );
}
function SmoothScrollAnim() {
    let t = document.querySelectorAll("[scrollanim]");
    for (let n = 0; n < t.length; n++) {
        let o = t[n];
        if ((setCSS(o, "opacity", "0"), 1 == isInViewport(o))) {
            o.removeAttribute("scrollanim");
            let t = getCSS(o, "transition");
            if (
                (setCSS(o, "transition", "all 1s ease"),
                    (o.style.opacity = "1"),
                    null != t)
            ) {
                async function e() {
                    await sleep(1500), setCSS(o, "transition", t);
                }
                e();
            }
        }
    }
}
window.addEventListener("scroll", SmoothScrollAnim);
const sleep = (t) => new Promise((e) => setTimeout(e, t));