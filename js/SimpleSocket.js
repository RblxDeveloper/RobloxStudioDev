class SimpleSocket {
    constructor(t) {
        (this.id = t.project_id),
            (this.token = t.project_token),
            (this.socketURL = "wss://simplesocket.net/socket/v2"),
            (this.supportsETF = t.useBinary || "undefined" != typeof TextEncoder),
            (this.operations = {}),
            (this.totalMessages = 0),
            (this.remotes = {}),
            this.connectSocket();
    }
    debug(t, e, s) {
        (1 == this.showDebug || e) &&
            (1 == this.debugStyle
                ? 1 == s
                    ? console.error(
                        "%cSimpleSocket%c " + t,
                        "color: #4F61FF; font-family: Didot, sans-serif; font-weight: 900; font-size: 14px;",
                        "color: white"
                    )
                    : console.log(
                        "%cSimpleSocket%c " + t,
                        "color: #4F61FF; font-family: Didot, sans-serif; font-weight: 900; font-size: 14px;",
                        "color: white"
                    )
                : 1 == s
                    ? console.error(t)
                    : console.log(t));
    }
    send(t, e, s, i) {
        let n = i;
        null == i &&
            ((this.totalMessages += 1),
                (n = parseInt(t.toString() + this.totalMessages.toString())));
        let o = [n];
        for (let t = 0; t < e.length; t++) o[t + 1] = e[t];
        if (t > 1) {
            let i = [t, e, s];
            2 == t && (i[3] = this.hash(e[0])), (this.operations[n] = i);
        }
        if (
            null == this.socket ||
            this.socket.readyState != WebSocket.OPEN ||
            (null == this.clientID && 1 != t)
        )
            this.socket.readyState == WebSocket.CLOSED && this.closed();
        else {
            let e = JSON.stringify(o);
            (e = e.substring(1, e.length - 1)),
                this.debug("SENT: " + e),
                1 == this.supportsETF && (e = new TextEncoder("utf-8").encode(e)),
                this.socket.send(e),
                null == s &&
                null != this.operations[n] &&
                t < 7 &&
                delete this.operations[n];
        }
        return n;
    }
    handleMessage(t) {
        "object" == typeof t && (t = new TextDecoder("utf-8").decode(t)),
            this.debug("RECIEVED: " + t);
        let e = JSON.parse("[" + t + "]");
        switch (e[0]) {
            case 2:
                if (null == e[4]) {
                    let t = Object.keys(this.operations);
                    for (let s = 0; s < t.length; s++) {
                        let i = this.operations[t[s]];
                        null != i && i[3] == e[1] && null != i[2] && i[2](e[2], e[3]);
                    }
                } else null != this.remotes[e[4]] && this.remotes[e[4]](e[2], e[3]);
                break;
            case 3:
                null != this.operations[e[1]] && this.operations[e[1]][2](e[2]);
                break;
            case 1:
                this.debug("CONNECTED: ClientID: " + e[1]),
                    (this.clientID = e[1]),
                    (this.serverID = e[2]),
                    (this.secureID = e[1] + "-" + e[3]),
                    null != this.onopen && this.onopen();
                let t = Object.keys(this.operations);
                for (let e = 0; e < t.length; e++) {
                    let s = { ...this.operations[t[e]] };
                    delete this.operations[t[e]],
                        this.send(s[0], s[1], s[2], parseInt(t[e]));
                }
                break;
            case 0:
                this.debug(e[2], !0, !0),
                    null != this.operations[e[1]] && delete this.operations[e[1]],
                    1 == e[3]
                        ? (this.expectClose = !0)
                        : null != this.operations[e[3]] &&
                        ((this.operations[e[3]][3] = this.hash(e[4])),
                            (this.operations[e[3]][1][0] = e[4]));
        }
    }
    connectSocket() {
        let t = () => {
            this.debug("CONNECTING");
            let t = "";
            1 == this.supportsETF && (t = "?en=etf"),
                null != this.socket &&
                this.socket.readyState == WebSocket.OPEN &&
                this.socket.close(),
                (this.socket = new WebSocket(this.socketURL + t)),
                1 == this.supportsETF && (this.socket.binaryType = "arraybuffer"),
                (this.socket.onopen = () => {
                    (this.socket.onmessage = (t) => {
                        this.handleMessage(t.data),
                            null != this.intervalTryConnect &&
                            (clearInterval(this.intervalTryConnect),
                                (this.intervalTryConnect = null));
                    }),
                        (this.socket.onclose = () => {
                            this.closed();
                        }),
                        this.send(1, [this.id, this.token]);
                });
        };
        clearInterval(this.intervalTryConnect),
            (this.intervalTryConnect = setInterval(t, 1e4)),
            t();
    }
    closed() {
        null != this.socket &&
            ((this.socket = null),
                this.debug("CONNECTION LOST"),
                (this.clientID = null),
                (this.serverID = null),
                (this.secureID = null),
                null != this.onclose && this.onclose(),
                1 != this.expectClose && this.connectSocket());
    }
    hash(t) {
        "object" == typeof t && (t = JSON.stringify(t));
        let e = 0;
        for (let s = 0; s < t.length; s++)
            (e = (e << 5) - e + t.charCodeAt(s)), (e &= e);
        return e;
    }
    setDefaultConfig(t) {
        this.debug("NEW CONFIG: Config: " + JSON.stringify(t)),
            null != this.defaultConfig &&
            null != this.operations[this.defaultConfig] &&
            delete this.operations[this.defaultConfig],
            (this.defaultConfig = this.send(7, [t]));
    }
    setDisconnectEvent(t, e, s) {
        this.debug(
            "Setting Disconnect Event: Filter: " +
            JSON.stringify(t) +
            " | Data: " +
            JSON.stringify(e) +
            " | Config: " +
            JSON.stringify(s)
        );
        let i = [t, e];
        null != s && (i[2] = s),
            null != this.disconnectEvent &&
            null != this.operations[this.disconnectEvent] &&
            (delete this.operations[this.disconnectEvent],
                (this.disconnectEvent = null)),
            null != t
                ? (this.disconnectEvent = this.send(8, i))
                : delete this.operations[this.send(8, [null])];
    }
    subscribe(t, e, s) {
        this.debug("SUBSCRIBING: Filter: " + JSON.stringify(t));
        let i = [t];
        null != s && (i[1] = s),
            e.length < 2 && (null == s ? (i[1] = !0) : (i[2] = !0));
        let n = this.send(2, i, e);
        return {
            id: n,
            edit: (t) => {
                if (null != this.operations[n]) {
                    let e = this.hash(t);
                    this.operations[n][3] != e &&
                        (this.debug("EDITING: Filter: " + JSON.stringify(t)),
                            (this.operations[n][1][0] = t),
                            this.send(4, [n, this.operations[n][3], t]),
                            (this.operations[n][3] = e));
                }
            },
            close: () => {
                null != this.operations[n] &&
                    (this.debug("CLOSING " + n),
                        this.send(5, [this.operations[n][3]]),
                        delete this.operations[n]);
            },
        };
    }
    publish(t, e, s) {
        this.debug(
            "PUBLISHING: Filter: " +
            JSON.stringify(t) +
            " | Data: " +
            JSON.stringify(e)
        );
        let i = [t, e];
        null != s && (i[2] = s), this.send(3, i);
    }
    remote(t) {
        let e = t.split("-");
        return (
            this.debug("REMOTING: ClientID: " + e[0]),
            {
                clientID: e[0],
                secureID: e[1],
                setIdentifier: (e) => {
                    this.debug("REMOTLY SETTING ID: " + e), this.send(6, [t, 0, e]);
                },
                subscribe: (e, s, i) => {
                    this.debug("REMOTLY SUBSCRIBING: Name: " + e);
                    let n = [t, 2, e, s];
                    null != i && (n[4] = i), this.send(6, n);
                },
                closeSubscribe: (e) => {
                    this.debug("REMOTLY UNSUBSCRIBING: Name: " + e),
                        this.send(6, [t, 5, e]);
                },
                valid: () => (
                    this.debug("REMOTLY VALIDATING SecureID: " + t),
                    new Promise((e) => {
                        this.send(9, [0, t], (t) => {
                            e(t);
                        });
                    })
                ),
            }
        );
    }
}