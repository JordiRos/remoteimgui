/*! lz4.js v0.1.0 Released under the MIT license. https://github.com/ukyo/lz4.js/LICENSE */
var lz4 = {};
(function() {
    function e(a) {
        throw a;
    }
    var i = void 0,
        l = !0,
        m = null,
        p = !1;

    function q() {
        return function() {}
    }
    var r = {
            TOTAL_MEMORY: 13656760
        },
        aa = {},
        s;
    for (s in r) r.hasOwnProperty(s) && (aa[s] = r[s]);
    var ba = "object" === typeof process && "function" === typeof require,
        ca = "object" === typeof window,
        ea = "function" === typeof importScripts,
        fa = !ca && !ba && !ea;
    if (ba) {
        r.print = function(a) {
            process.stdout.write(a + "\n")
        };
        r.printErr = function(a) {
            process.stderr.write(a + "\n")
        };
        var ga = require("fs"),
            ha = require("path");
        r.read = function(a, b) {
            var a = ha.normalize(a),
                c = ga.readFileSync(a);
            !c && a != ha.resolve(a) && (a = path.join(__dirname, "..", "src", a), c = ga.readFileSync(a));
            c && !b && (c = c.toString());
            return c
        };
        r.readBinary = function(a) {
            return r.read(a, l)
        };
        r.load = function(a) {
            ia(read(a))
        };
        r.arguments = process.argv.slice(2);
        module.exports = r
    } else fa ? (r.print = print, "undefined" != typeof printErr &&
        (r.printErr = printErr), r.read = "undefined" != typeof read ? read : function() {
            e("no read() available (jsc?)")
        }, r.readBinary = function(a) {
            return read(a, "binary")
        }, "undefined" != typeof scriptArgs ? r.arguments = scriptArgs : "undefined" != typeof arguments && (r.arguments = arguments), this.Module = r, eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined")) : ca || ea ? (r.read = function(a) {
            var b = new XMLHttpRequest;
            b.open("GET", a, p);
            b.send(m);
            return b.responseText
        }, "undefined" != typeof arguments &&
        (r.arguments = arguments), "undefined" !== typeof console ? (r.print = function(a) {
            console.log(a)
        }, r.printErr = function(a) {
            console.log(a)
        }) : r.print = q(), ca ? this.Module = r : r.load = importScripts) : e("Unknown runtime environment. Where are we?");

    function ia(a) {
        eval.call(m, a)
    }
    "undefined" == !r.load && r.read && (r.load = function(a) {
        ia(r.read(a))
    });
    r.print || (r.print = q());
    r.printErr || (r.printErr = r.print);
    r.arguments || (r.arguments = []);
    r.print = r.print;
    r.P = r.printErr;
    r.preRun = [];
    r.postRun = [];
    for (s in aa) aa.hasOwnProperty(s) && (r[s] = aa[s]);

    function ja() {
        return u
    }

    function ka(a) {
        u = a
    }

    function la(a) {
        switch (a) {
            case "i1":
            case "i8":
                return 1;
            case "i16":
                return 2;
            case "i32":
                return 4;
            case "i64":
                return 8;
            case "float":
                return 4;
            case "double":
                return 8;
            default:
                return "*" === a[a.length - 1] ? ma : "i" === a[0] ? (a = parseInt(a.substr(1)), w(0 === a % 8), a / 8) : 0
        }
    }

    function na(a, b, c) {
        c && c.length ? (c.splice || (c = Array.prototype.slice.call(c)), c.splice(0, 0, b), r["dynCall_" + a].apply(m, c)) : r["dynCall_" + a].call(m, b)
    }
    var oa;

    function pa() {
        var a = [],
            b = 0;
        this.ea = function(c) {
            c &= 255;
            if (0 == a.length) {
                if (0 == (c & 128)) return String.fromCharCode(c);
                a.push(c);
                b = 192 == (c & 224) ? 1 : 224 == (c & 240) ? 2 : 3;
                return ""
            }
            if (b && (a.push(c), b--, 0 < b)) return "";
            var c = a[0],
                d = a[1],
                f = a[2],
                g = a[3];
            2 == a.length ? c = String.fromCharCode((c & 31) << 6 | d & 63) : 3 == a.length ? c = String.fromCharCode((c & 15) << 12 | (d & 63) << 6 | f & 63) : (c = (c & 7) << 18 | (d & 63) << 12 | (f & 63) << 6 | g & 63, c = String.fromCharCode(Math.floor((c - 65536) / 1024) + 55296, (c - 65536) % 1024 + 56320));
            a.length = 0;
            return c
        };
        this.Sa = function(a) {
            for (var a =
                    unescape(encodeURIComponent(a)), b = [], f = 0; f < a.length; f++) b.push(a.charCodeAt(f));
            return b
        }
    }

    function qa(a) {
        var b = u;
        u = u + a | 0;
        u = u + 7 & -8;
        return b
    }

    function ra(a) {
        var b = x;
        x = x + a | 0;
        x = x + 7 & -8;
        return b
    }

    function ta(a) {
        var b = y;
        y = y + a | 0;
        y = y + 7 & -8;
        y >= ua && B("Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + ua + ", or (2) set Module.TOTAL_MEMORY before the program runs.");
        return b
    }

    function va(a, b) {
        return Math.ceil(a / (b ? b : 8)) * (b ? b : 8)
    }
    var ma = 4,
        wa = {},
        xa = p,
        C, ya;

    function w(a, b) {
        a || B("Assertion failed: " + b)
    }
    r.ccall = function(a, b, c, d) {
        return za(Aa(a), b, c, d)
    };

    function Aa(a) {
        try {
            var b = r["_" + a];
            b || (b = eval("_" + a))
        } catch (c) {}
        w(b, "Cannot call unknown function " + a + " (perhaps LLVM optimizations or closure removed it?)");
        return b
    }

    function za(a, b, c, d) {
        function f(a, b) {
            if ("string" == b) {
                if (a === m || a === i || 0 === a) return 0;
                a = D(a);
                b = "array"
            }
            if ("array" == b) {
                g || (g = ja());
                var c = qa(a.length);
                Ba(a, c);
                return c
            }
            return a
        }
        var g = 0,
            h = 0,
            d = d ? d.map(function(a) {
                return f(a, c[h++])
            }) : [];
        a = a.apply(m, d);
        "string" == b ? b = Ca(a) : (w("array" != b), b = a);
        g && ka(g);
        return b
    }
    r.cwrap = function(a, b, c) {
        var d = Aa(a);
        return function() {
            return za(d, b, c, Array.prototype.slice.call(arguments))
        }
    };

    function Da(a, b, c) {
        c = c || "i8";
        "*" === c.charAt(c.length - 1) && (c = "i32");
        switch (c) {
            case "i1":
                F[a] = b;
                break;
            case "i8":
                F[a] = b;
                break;
            case "i16":
                G[a >> 1] = b;
                break;
            case "i32":
                H[a >> 2] = b;
                break;
            case "i64":
                ya = [b >>> 0, (C = b, 1 <= +Ea(C) ? 0 < C ? (Fa(+Ga(C / 4294967296), 4294967295) | 0) >>> 0 : ~~+Ha((C - +(~~C >>> 0)) / 4294967296) >>> 0 : 0)];
                H[a >> 2] = ya[0];
                H[a + 4 >> 2] = ya[1];
                break;
            case "float":
                Ia[a >> 2] = b;
                break;
            case "double":
                Ja[a >> 3] = b;
                break;
            default:
                B("invalid type for setValue: " + c)
        }
    }
    r.setValue = Da;
    r.getValue = function(a, b) {
        b = b || "i8";
        "*" === b.charAt(b.length - 1) && (b = "i32");
        switch (b) {
            case "i1":
                return F[a];
            case "i8":
                return F[a];
            case "i16":
                return G[a >> 1];
            case "i32":
                return H[a >> 2];
            case "i64":
                return H[a >> 2];
            case "float":
                return Ia[a >> 2];
            case "double":
                return Ja[a >> 3];
            default:
                B("invalid type for setValue: " + b)
        }
        return m
    };
    var I = 2,
        Ka = 4;
    r.ALLOC_NORMAL = 0;
    r.ALLOC_STACK = 1;
    r.ALLOC_STATIC = I;
    r.ALLOC_DYNAMIC = 3;
    r.ALLOC_NONE = Ka;

    function K(a, b, c, d) {
        var f, g;
        "number" === typeof a ? (f = l, g = a) : (f = p, g = a.length);
        var h = "string" === typeof b ? b : m,
            c = c == Ka ? d : [L, qa, ra, ta][c === i ? I : c](Math.max(g, h ? 1 : b.length));
        if (f) {
            d = c;
            w(0 == (c & 3));
            for (a = c + (g & -4); d < a; d += 4) H[d >> 2] = 0;
            for (a = c + g; d < a;) F[d++ | 0] = 0;
            return c
        }
        if ("i8" === h) return a.subarray || a.slice ? M.set(a, c) : M.set(new Uint8Array(a), c), c;
        for (var d = 0, k, t; d < g;) {
            var j = a[d];
            "function" === typeof j && (j = wa.ld(j));
            f = h || b[d];
            0 === f ? d++ : ("i64" == f && (f = "i32"), Da(c + d, j, f), t !== f && (k = la(f), t = f), d += k)
        }
        return c
    }
    r.allocate = K;

    function Ca(a, b) {
        for (var c = p, d, f = 0;;) {
            d = M[a + f | 0];
            if (128 <= d) c = l;
            else if (0 == d && !b) break;
            f++;
            if (b && f == b) break
        }
        b || (b = f);
        var g = "";
        if (!c) {
            for (; 0 < b;) d = String.fromCharCode.apply(String, M.subarray(a, a + Math.min(b, 1024))), g = g ? g + d : d, a += 1024, b -= 1024;
            return g
        }
        c = new pa;
        for (f = 0; f < b; f++) d = M[a + f | 0], g += c.ea(d);
        return g
    }
    r.Pointer_stringify = Ca;
    r.UTF16ToString = function(a) {
        for (var b = 0, c = "";;) {
            var d = G[a + 2 * b >> 1];
            if (0 == d) return c;
            ++b;
            c += String.fromCharCode(d)
        }
    };
    r.stringToUTF16 = function(a, b) {
        for (var c = 0; c < a.length; ++c) G[b + 2 * c >> 1] = a.charCodeAt(c);
        G[b + 2 * a.length >> 1] = 0
    };
    r.UTF32ToString = function(a) {
        for (var b = 0, c = "";;) {
            var d = H[a + 4 * b >> 2];
            if (0 == d) return c;
            ++b;
            65536 <= d ? (d -= 65536, c += String.fromCharCode(55296 | d >> 10, 56320 | d & 1023)) : c += String.fromCharCode(d)
        }
    };
    r.stringToUTF32 = function(a, b) {
        for (var c = 0, d = 0; d < a.length; ++d) {
            var f = a.charCodeAt(d);
            if (55296 <= f && 57343 >= f) var g = a.charCodeAt(++d),
                f = 65536 + ((f & 1023) << 10) | g & 1023;
            H[b + 4 * c >> 2] = f;
            ++c
        }
        H[b + 4 * c >> 2] = 0
    };

    function La(a) {
        try {
            "number" === typeof a && (a = Ca(a));
            if ("_" !== a[0] || "_" !== a[1] || "Z" !== a[2]) return a;
            switch (a[3]) {
                case "n":
                    return "operator new()";
                case "d":
                    return "operator delete()"
            }
            var b = 3,
                c = {
                    v: "void",
                    b: "bool",
                    c: "char",
                    s: "short",
                    i: "int",
                    l: "long",
                    f: "float",
                    d: "double",
                    w: "wchar_t",
                    a: "signed char",
                    h: "unsigned char",
                    t: "unsigned short",
                    j: "unsigned int",
                    m: "unsigned long",
                    x: "long long",
                    y: "unsigned long long",
                    z: "..."
                },
                d = [],
                f = l,
                g = function(h, t, j) {
                    var t = t || Infinity,
                        z = "",
                        A = [],
                        n;
                    if ("N" === a[b]) {
                        b++;
                        "K" === a[b] && b++;
                        for (n = [];
                            "E" !== a[b];)
                            if ("S" === a[b]) {
                                b++;
                                var v = a.indexOf("_", b);
                                n.push(d[a.substring(b, v) || 0] || "?");
                                b = v + 1
                            } else if ("C" === a[b]) n.push(n[n.length - 1]), b += 2;
                        else {
                            var v = parseInt(a.substr(b)),
                                E = v.toString().length;
                            if (!v || !E) {
                                b--;
                                break
                            }
                            var da = a.substr(b + E, v);
                            n.push(da);
                            d.push(da);
                            b += E + v
                        }
                        b++;
                        n = n.join("::");
                        t--;
                        if (0 === t) return h ? [n] : n
                    } else if (("K" === a[b] || f && "L" === a[b]) && b++, v = parseInt(a.substr(b))) E = v.toString().length, n = a.substr(b + E, v), b += E + v;
                    f = p;
                    "I" === a[b] ? (b++, v = g(l), E = g(l, 1, l), z += E[0] + " " + n + "<" + v.join(", ") +
                        ">") : z = n;
                    a: for (; b < a.length && 0 < t--;)
                        if (n = a[b++], n in c) A.push(c[n]);
                        else switch (n) {
                            case "P":
                                A.push(g(l, 1, l)[0] + "*");
                                break;
                            case "R":
                                A.push(g(l, 1, l)[0] + "&");
                                break;
                            case "L":
                                b++;
                                v = a.indexOf("E", b) - b;
                                A.push(a.substr(b, v));
                                b += v + 2;
                                break;
                            case "A":
                                v = parseInt(a.substr(b));
                                b += v.toString().length;
                                "_" !== a[b] && e("?");
                                b++;
                                A.push(g(l, 1, l)[0] + " [" + v + "]");
                                break;
                            case "E":
                                break a;
                            default:
                                z += "?" + n;
                                break a
                        }!j && (1 === A.length && "void" === A[0]) && (A = []);
                    return h ? A : z + ("(" + A.join(", ") + ")")
                };
            return g()
        } catch (h) {
            return a
        }
    }

    function Ma() {
        var a = Error().stack;
        return a ? a.replace(/__Z[\w\d_]+/g, function(a) {
            var c = La(a);
            return a === c ? a : a + " [" + c + "]"
        }) : "(no stack trace available)"
    }
    var F, M, G, Na, H, Oa, Ia, Ja, Pa = 0,
        x = 0,
        Qa = 0,
        u = 0,
        Ra = 0,
        Sa = 0,
        y = 0,
        ua = r.TOTAL_MEMORY || 16777216;
    w("undefined" !== typeof Int32Array && "undefined" !== typeof Float64Array && !!(new Int32Array(1)).subarray && !!(new Int32Array(1)).set, "Cannot fallback to non-typed array case: Code is too specialized");
    var N = new ArrayBuffer(ua);
    F = new Int8Array(N);
    G = new Int16Array(N);
    H = new Int32Array(N);
    M = new Uint8Array(N);
    Na = new Uint16Array(N);
    Oa = new Uint32Array(N);
    Ia = new Float32Array(N);
    Ja = new Float64Array(N);
    H[0] = 255;
    w(255 === M[0] && 0 === M[3], "Typed arrays 2 must be run on a little-endian system");
    r.HEAP = i;
    r.HEAP8 = F;
    r.HEAP16 = G;
    r.HEAP32 = H;
    r.HEAPU8 = M;
    r.HEAPU16 = Na;
    r.HEAPU32 = Oa;
    r.HEAPF32 = Ia;
    r.HEAPF64 = Ja;

    function O(a) {
        for (; 0 < a.length;) {
            var b = a.shift();
            if ("function" == typeof b) b();
            else {
                var c = b.J;
                "number" === typeof c ? b.aa === i ? na("v", c) : na("vi", c, [b.aa]) : c(b.aa === i ? m : b.aa)
            }
        }
    }
    var Ta = [],
        P = [],
        Ua = [],
        Va = [],
        Wa = [],
        Xa = p;

    function Ya(a) {
        Ta.unshift(a)
    }
    r.addOnPreRun = r.bd = Ya;
    r.addOnInit = r.Zc = function(a) {
        P.unshift(a)
    };
    r.addOnPreMain = r.ad = function(a) {
        Ua.unshift(a)
    };
    r.addOnExit = r.Yc = function(a) {
        Va.unshift(a)
    };

    function Za(a) {
        Wa.unshift(a)
    }
    r.addOnPostRun = r.$c = Za;

    function D(a, b, c) {
        a = (new pa).Sa(a);
        c && (a.length = c);
        b || a.push(0);
        return a
    }
    r.intArrayFromString = D;
    r.intArrayToString = function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            255 < d && (d &= 255);
            b.push(String.fromCharCode(d))
        }
        return b.join("")
    };
    r.writeStringToMemory = function(a, b, c) {
        a = D(a, c);
        for (c = 0; c < a.length;) F[b + c | 0] = a[c], c += 1
    };

    function Ba(a, b) {
        for (var c = 0; c < a.length; c++) F[b + c | 0] = a[c]
    }
    r.writeArrayToMemory = Ba;
    r.writeAsciiToMemory = function(a, b, c) {
        for (var d = 0; d < a.length; d++) F[b + d | 0] = a.charCodeAt(d);
        c || (F[b + a.length | 0] = 0)
    };
    Math.imul || (Math.imul = function(a, b) {
        var c = a & 65535,
            d = b & 65535;
        return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16) | 0
    });
    Math.nd = Math.imul;
    var Ea = Math.abs,
        Ha = Math.ceil,
        Ga = Math.floor,
        Fa = Math.min,
        Q = 0,
        $a = m,
        ab = m;

    function bb() {
        Q++;
        r.monitorRunDependencies && r.monitorRunDependencies(Q)
    }
    r.addRunDependency = bb;

    function cb() {
        Q--;
        r.monitorRunDependencies && r.monitorRunDependencies(Q);
        if (0 == Q && ($a !== m && (clearInterval($a), $a = m), ab)) {
            var a = ab;
            ab = m;
            a()
        }
    }
    r.removeRunDependency = cb;
    r.preloadedImages = {};
    r.preloadedAudios = {};
    Pa = 8;
    x = Pa + 528;
    P.push({
        J: function() {
            db()
        }
    });
    K([0, 0, 0, 0, 3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", Ka, 8);
    var eb = va(K(12, "i8", I), 8);
    w(0 == eb % 8);
    r._memset = fb;
    r._memcpy = gb;
    var hb = K([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0,
        1, 0, 3, 0, 1, 0, 2, 0, 1, 0
    ], "i8", I);
    r._llvm_cttz_i32 = ib;
    var jb = 0;

    function kb(a) {
        return H[jb >> 2] = a
    }

    function lb(a) {
        lb.Ka || (y = y + 4095 & -4096, lb.Ka = l, w(ta), lb.Ia = ta, ta = function() {
            B("cannot dynamically allocate, sbrk now has control")
        });
        var b = y;
        0 != a && lb.Ia(a);
        return b
    }
    var R = {
        L: 1,
        Q: 2,
        Lc: 3,
        Gb: 4,
        D: 5,
        ma: 6,
        Ya: 7,
        dc: 8,
        Da: 9,
        nb: 10,
        ia: 11,
        Vc: 11,
        Fa: 12,
        Ca: 13,
        zb: 14,
        pc: 15,
        lb: 16,
        ja: 17,
        Wc: 18,
        ka: 19,
        rc: 20,
        Y: 21,
        C: 22,
        Zb: 23,
        Ea: 24,
        vc: 25,
        Sc: 26,
        Ab: 27,
        lc: 28,
        $: 29,
        Ic: 30,
        Sb: 31,
        Bc: 32,
        wb: 33,
        Fc: 34,
        hc: 42,
        Db: 43,
        ob: 44,
        Jb: 45,
        Kb: 46,
        Lb: 47,
        Rb: 48,
        Tc: 49,
        bc: 50,
        Ib: 51,
        tb: 35,
        ec: 37,
        eb: 52,
        hb: 53,
        Xc: 54,
        $b: 55,
        ib: 56,
        jb: 57,
        ub: 35,
        kb: 59,
        nc: 60,
        cc: 61,
        Pc: 62,
        mc: 63,
        ic: 64,
        jc: 65,
        Hc: 66,
        fc: 67,
        ab: 68,
        Mc: 69,
        pb: 70,
        Cc: 71,
        Ub: 72,
        xb: 73,
        gb: 74,
        wc: 76,
        fb: 77,
        Gc: 78,
        Mb: 79,
        Nb: 80,
        Qb: 81,
        Pb: 82,
        Ob: 83,
        oc: 38,
        la: 39,
        Vb: 36,
        Z: 40,
        xc: 95,
        Ac: 96,
        sb: 104,
        ac: 105,
        bb: 97,
        Ec: 91,
        tc: 88,
        kc: 92,
        Jc: 108,
        rb: 111,
        Za: 98,
        qb: 103,
        Yb: 101,
        Wb: 100,
        Qc: 110,
        Bb: 112,
        Cb: 113,
        Fb: 115,
        cb: 114,
        vb: 89,
        Tb: 90,
        Dc: 93,
        Kc: 94,
        $a: 99,
        Xb: 102,
        Hb: 106,
        qc: 107,
        Rc: 109,
        Uc: 87,
        yb: 122,
        Nc: 116,
        uc: 95,
        gc: 123,
        Eb: 84,
        yc: 75,
        mb: 125,
        sc: 131,
        zc: 130,
        Oc: 86
    };
    r._strlen = mb;
    var nb = {
            "0": "Success",
            1: "Not super-user",
            2: "No such file or directory",
            3: "No such process",
            4: "Interrupted system call",
            5: "I/O error",
            6: "No such device or address",
            7: "Arg list too long",
            8: "Exec format error",
            9: "Bad file number",
            10: "No children",
            11: "No more processes",
            12: "Not enough core",
            13: "Permission denied",
            14: "Bad address",
            15: "Block device required",
            16: "Mount device busy",
            17: "File exists",
            18: "Cross-device link",
            19: "No such device",
            20: "Not a directory",
            21: "Is a directory",
            22: "Invalid argument",
            23: "Too many open files in system",
            24: "Too many open files",
            25: "Not a typewriter",
            26: "Text file busy",
            27: "File too large",
            28: "No space left on device",
            29: "Illegal seek",
            30: "Read only file system",
            31: "Too many links",
            32: "Broken pipe",
            33: "Math arg out of domain of func",
            34: "Math result not representable",
            35: "File locking deadlock error",
            36: "File or path name too long",
            37: "No record locks available",
            38: "Function not implemented",
            39: "Directory not empty",
            40: "Too many symbolic links",
            42: "No message of desired type",
            43: "Identifier removed",
            44: "Channel number out of range",
            45: "Level 2 not synchronized",
            46: "Level 3 halted",
            47: "Level 3 reset",
            48: "Link number out of range",
            49: "Protocol driver not attached",
            50: "No CSI structure available",
            51: "Level 2 halted",
            52: "Invalid exchange",
            53: "Invalid request descriptor",
            54: "Exchange full",
            55: "No anode",
            56: "Invalid request code",
            57: "Invalid slot",
            59: "Bad font file fmt",
            60: "Device not a stream",
            61: "No data (for no delay io)",
            62: "Timer expired",
            63: "Out of streams resources",
            64: "Machine is not on the network",
            65: "Package not installed",
            66: "The object is remote",
            67: "The link has been severed",
            68: "Advertise error",
            69: "Srmount error",
            70: "Communication error on send",
            71: "Protocol error",
            72: "Multihop attempted",
            73: "Cross mount point (not really error)",
            74: "Trying to read unreadable message",
            75: "Value too large for defined data type",
            76: "Given log. name not unique",
            77: "f.d. invalid for this operation",
            78: "Remote address changed",
            79: "Can   access a needed shared lib",
            80: "Accessing a corrupted shared lib",
            81: ".lib section in a.out corrupted",
            82: "Attempting to link in too many libs",
            83: "Attempting to exec a shared library",
            84: "Illegal byte sequence",
            86: "Streams pipe error",
            87: "Too many users",
            88: "Socket operation on non-socket",
            89: "Destination address required",
            90: "Message too long",
            91: "Protocol wrong type for socket",
            92: "Protocol not available",
            93: "Unknown protocol",
            94: "Socket type not supported",
            95: "Not supported",
            96: "Protocol family not supported",
            97: "Address family not supported by protocol family",
            98: "Address already in use",
            99: "Address not available",
            100: "Network interface is not configured",
            101: "Network is unreachable",
            102: "Connection reset by network",
            103: "Connection aborted",
            104: "Connection reset by peer",
            105: "No buffer space available",
            106: "Socket is already connected",
            107: "Socket is not connected",
            108: "Can't send after socket shutdown",
            109: "Too many references",
            110: "Connection timed out",
            111: "Connection refused",
            112: "Host is down",
            113: "Host is unreachable",
            114: "Socket already connected",
            115: "Connection already in progress",
            116: "Stale file handle",
            122: "Quota exceeded",
            123: "No medium (in tape drive)",
            125: "Operation canceled",
            130: "Previous owner died",
            131: "State not recoverable"
        },
        ob = [];

    function pb(a, b) {
        ob[a] = {
            input: [],
            G: [],
            O: b
        };
        qb[a] = {
            k: rb
        }
    }
    var rb = {
            open: function(a) {
                var b = ob[a.e.U];
                b || e(new S(R.ka));
                a.p = b;
                a.seekable = p
            },
            close: function(a) {
                a.p.G.length && a.p.O.T(a.p, 10)
            },
            H: function(a, b, c, d) {
                (!a.p || !a.p.O.ta) && e(new S(R.ma));
                for (var f = 0, g = 0; g < d; g++) {
                    var h;
                    try {
                        h = a.p.O.ta(a.p)
                    } catch (k) {
                        e(new S(R.D))
                    }
                    h === i && 0 === f && e(new S(R.ia));
                    if (h === m || h === i) break;
                    f++;
                    b[c + g] = h
                }
                f && (a.e.timestamp = Date.now());
                return f
            },
            write: function(a, b, c, d) {
                (!a.p || !a.p.O.T) && e(new S(R.ma));
                for (var f = 0; f < d; f++) try {
                    a.p.O.T(a.p, b[c + f])
                } catch (g) {
                    e(new S(R.D))
                }
                d && (a.e.timestamp =
                    Date.now());
                return f
            }
        },
        T = {
            u: m,
            Ba: 1,
            X: 2,
            ha: 3,
            B: function() {
                return T.createNode(m, "/", 16895, 0)
            },
            createNode: function(a, b, c, d) {
                (24576 === (c & 61440) || 4096 === (c & 61440)) && e(new S(R.L));
                T.u || (T.u = {
                    dir: {
                        e: {
                            A: T.g.A,
                            o: T.g.o,
                            da: T.g.da,
                            K: T.g.K,
                            K: T.g.K,
                            rename: T.g.rename,
                            Aa: T.g.Aa,
                            za: T.g.za,
                            ya: T.g.ya,
                            W: T.g.W
                        },
                        I: {
                            F: T.k.F
                        }
                    },
                    file: {
                        e: {
                            A: T.g.A,
                            o: T.g.o
                        },
                        I: {
                            F: T.k.F,
                            H: T.k.H,
                            write: T.k.write,
                            na: T.k.na,
                            va: T.k.va
                        }
                    },
                    link: {
                        e: {
                            A: T.g.A,
                            o: T.g.o,
                            V: T.g.V
                        },
                        I: {}
                    },
                    qa: {
                        e: {
                            A: T.g.A,
                            o: T.g.o
                        },
                        I: sb
                    }
                });
                c = tb(a, b, c, d);
                16384 === (c.mode & 61440) ? (c.g =
                    T.u.dir.e, c.k = T.u.dir.I, c.n = {}) : 32768 === (c.mode & 61440) ? (c.g = T.u.file.e, c.k = T.u.file.I, c.n = [], c.S = T.X) : 40960 === (c.mode & 61440) ? (c.g = T.u.link.e, c.k = T.u.link.I) : 8192 === (c.mode & 61440) && (c.g = T.u.qa.e, c.k = T.u.qa.I);
                c.timestamp = Date.now();
                a && (a.n[b] = c);
                return c
            },
            ba: function(a) {
                a.S !== T.X && (a.n = Array.prototype.slice.call(a.n), a.S = T.X)
            },
            g: {
                A: function(a) {
                    var b = {};
                    b.hd = 8192 === (a.mode & 61440) ? a.id : 1;
                    b.od = a.id;
                    b.mode = a.mode;
                    b.td = 1;
                    b.uid = 0;
                    b.md = 0;
                    b.U = a.U;
                    b.size = 16384 === (a.mode & 61440) ? 4096 : 32768 === (a.mode & 61440) ? a.n.length :
                        40960 === (a.mode & 61440) ? a.link.length : 0;
                    b.dd = new Date(a.timestamp);
                    b.sd = new Date(a.timestamp);
                    b.gd = new Date(a.timestamp);
                    b.Ja = 4096;
                    b.ed = Math.ceil(b.size / b.Ja);
                    return b
                },
                o: function(a, b) {
                    b.mode !== i && (a.mode = b.mode);
                    b.timestamp !== i && (a.timestamp = b.timestamp);
                    if (b.size !== i) {
                        T.ba(a);
                        var c = a.n;
                        if (b.size < c.length) c.length = b.size;
                        else
                            for (; b.size > c.length;) c.push(0)
                    }
                },
                da: function() {
                    e(ub[R.Q])
                },
                K: function(a, b, c, d) {
                    return T.createNode(a, b, c, d)
                },
                rename: function(a, b, c) {
                    if (16384 === (a.mode & 61440)) {
                        var d;
                        try {
                            d = vb(b,
                                c)
                        } catch (f) {}
                        if (d)
                            for (var g in d.n) e(new S(R.la))
                    }
                    delete a.parent.n[a.name];
                    a.name = c;
                    b.n[c] = a;
                    a.parent = b
                },
                Aa: function(a, b) {
                    delete a.n[b]
                },
                za: function(a, b) {
                    var c = vb(a, b),
                        d;
                    for (d in c.n) e(new S(R.la));
                    delete a.n[b]
                },
                ya: function(a) {
                    var b = [".", ".."],
                        c;
                    for (c in a.n) a.n.hasOwnProperty(c) && b.push(c);
                    return b
                },
                W: function(a, b, c) {
                    a = T.createNode(a, b, 41471, 0);
                    a.link = c;
                    return a
                },
                V: function(a) {
                    40960 !== (a.mode & 61440) && e(new S(R.C));
                    return a.link
                }
            },
            k: {
                H: function(a, b, c, d, f) {
                    a = a.e.n;
                    if (f >= a.length) return 0;
                    d = Math.min(a.length -
                        f, d);
                    w(0 <= d);
                    if (8 < d && a.subarray) b.set(a.subarray(f, f + d), c);
                    else
                        for (var g = 0; g < d; g++) b[c + g] = a[f + g];
                    return d
                },
                write: function(a, b, c, d, f, g) {
                    var h = a.e;
                    h.timestamp = Date.now();
                    a = h.n;
                    if (d && 0 === a.length && 0 === f && b.subarray) return g && 0 === c ? (h.n = b, h.S = b.buffer === F.buffer ? T.Ba : T.ha) : (h.n = new Uint8Array(b.subarray(c, c + d)), h.S = T.ha), d;
                    T.ba(h);
                    for (a = h.n; a.length < f;) a.push(0);
                    for (g = 0; g < d; g++) a[f + g] = b[c + g];
                    return d
                },
                F: function(a, b, c) {
                    1 === c ? b += a.position : 2 === c && 32768 === (a.e.mode & 61440) && (b += a.e.n.length);
                    0 > b && e(new S(R.C));
                    a.Va = [];
                    return a.position = b
                },
                na: function(a, b, c) {
                    T.ba(a.e);
                    a = a.e.n;
                    for (b += c; b > a.length;) a.push(0)
                },
                va: function(a, b, c, d, f, g, h) {
                    32768 !== (a.e.mode & 61440) && e(new S(R.ka));
                    a = a.e.n;
                    if (!(h & 2) && (a.buffer === b || a.buffer === b.buffer)) f = p, d = a.byteOffset;
                    else {
                        if (0 < f || f + d < a.length) a = a.subarray ? a.subarray(f, f + d) : Array.prototype.slice.call(a, f, f + d);
                        f = l;
                        (d = L(d)) || e(new S(R.Fa));
                        b.set(a, d)
                    }
                    return {
                        wd: d,
                        cd: f
                    }
                }
            }
        },
        wb = K(1, "i32*", I),
        xb = K(1, "i32*", I),
        yb = K(1, "i32*", I),
        zb = m,
        qb = [m],
        Ab = [m],
        Bb = 1,
        Cb = m,
        Db = l,
        S = m,
        ub = {};

    function U(a, b) {
        a = Eb("/", a);
        b = b || {
            fa: 0
        };
        8 < b.fa && e(new S(R.Z));
        for (var c = Fb(a.split("/").filter(function(a) {
                return !!a
            }), p), d = zb, f = "/", g = 0; g < c.length; g++) {
            var h = g === c.length - 1;
            if (h && b.parent) break;
            d = vb(d, c[g]);
            f = V(f + "/" + c[g]);
            d.Pa && (d = d.B.root);
            if (!h || b.N)
                for (h = 0; 40960 === (d.mode & 61440);) {
                    d = U(f, {
                        N: p
                    }).e;
                    d.g.V || e(new S(R.C));
                    var d = d.g.V(d),
                        k = Eb;
                    var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(f).slice(1),
                        f = t[0],
                        t = t[1];
                    !f && !t ? f = "." : (t && (t = t.substr(0, t.length - 1)), f += t);
                    f = k(f, d);
                    d = U(f, {
                        fa: b.fa
                    }).e;
                    40 < h++ && e(new S(R.Z))
                }
        }
        return {
            path: f,
            e: d
        }
    }

    function W(a) {
        for (var b;;) {
            if (a === a.parent) return a = a.B.Qa, !b ? a : "/" !== a[a.length - 1] ? a + "/" + b : a + b;
            b = b ? a.name + "/" + b : a.name;
            a = a.parent
        }
    }

    function Gb(a, b) {
        for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
        return (a + c >>> 0) % Cb.length
    }

    function vb(a, b) {
        var c = Hb(a, "x");
        c && e(new S(c));
        for (c = Cb[Gb(a.id, b)]; c; c = c.Ra) {
            var d = c.name;
            if (c.parent.id === a.id && d === b) return c
        }
        return a.g.da(a, b)
    }

    function tb(a, b, c, d) {
        Ib || (Ib = function(a, b, c, d) {
            this.id = Bb++;
            this.name = b;
            this.mode = c;
            this.g = {};
            this.k = {};
            this.U = d;
            this.B = this.parent = m;
            a || (a = this);
            this.parent = a;
            this.B = a.B;
            a = Gb(this.parent.id, this.name);
            this.Ra = Cb[a];
            Cb[a] = this
        }, Ib.prototype = {}, Object.defineProperties(Ib.prototype, {
            H: {
                get: function() {
                    return 365 === (this.mode & 365)
                },
                set: function(a) {
                    a ? this.mode |= 365 : this.mode &= -366
                }
            },
            write: {
                get: function() {
                    return 146 === (this.mode & 146)
                },
                set: function(a) {
                    a ? this.mode |= 146 : this.mode &= -147
                }
            },
            Oa: {
                get: function() {
                    return 16384 ===
                        (this.mode & 61440)
                }
            },
            Na: {
                get: function() {
                    return 8192 === (this.mode & 61440)
                }
            }
        }));
        return new Ib(a, b, c, d)
    }
    var Jb = {
        r: 0,
        rs: 1052672,
        "r+": 2,
        w: 577,
        wx: 705,
        xw: 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        a: 1089,
        ax: 1217,
        xa: 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
    };

    function Hb(a, b) {
        return Db ? 0 : -1 !== b.indexOf("r") && !(a.mode & 292) || -1 !== b.indexOf("w") && !(a.mode & 146) || -1 !== b.indexOf("x") && !(a.mode & 73) ? R.Ca : 0
    }

    function Kb(a, b) {
        try {
            return vb(a, b), R.ja
        } catch (c) {}
        return Hb(a, "wx")
    }
    var sb = {
        open: function(a) {
            a.k = qb[a.e.U].k;
            a.k.open && a.k.open(a)
        },
        F: function() {
            e(new S(R.$))
        }
    };

    function Lb(a, b, c) {
        var d = U(a, {
                parent: l
            }).e,
            a = Mb(a),
            f = Kb(d, a);
        f && e(new S(f));
        d.g.K || e(new S(R.L));
        return d.g.K(d, a, b, c)
    }

    function Nb(a, b) {
        b = (b !== i ? b : 438) & 4095;
        b |= 32768;
        return Lb(a, b, 0)
    }

    function X(a, b) {
        b = (b !== i ? b : 511) & 1023;
        b |= 16384;
        return Lb(a, b, 0)
    }

    function Ob(a, b, c) {
        "undefined" === typeof c && (c = b, b = 438);
        return Lb(a, b | 8192, c)
    }

    function Pb(a, b) {
        var c = U(b, {
                parent: l
            }).e,
            d = Mb(b),
            f = Kb(c, d);
        f && e(new S(f));
        c.g.W || e(new S(R.L));
        return c.g.W(c, d, a)
    }

    function Qb(a, b) {
        var c;
        c = "string" === typeof a ? U(a, {
            N: l
        }).e : a;
        c.g.o || e(new S(R.L));
        c.g.o(c, {
            mode: b & 4095 | c.mode & -4096,
            timestamp: Date.now()
        })
    }

    function Rb(a, b) {
        var c, d;
        "string" === typeof b ? (d = Jb[b], "undefined" === typeof d && e(Error("Unknown file open mode: " + b))) : d = b;
        b = d;
        c = b & 64 ? ("undefined" === typeof c ? 438 : c) & 4095 | 32768 : 0;
        var f;
        if ("object" === typeof a) f = a;
        else {
            a = V(a);
            try {
                f = U(a, {
                    N: !(b & 131072)
                }).e
            } catch (g) {}
        }
        b & 64 && (f ? b & 128 && e(new S(R.ja)) : f = Lb(a, c, 0));
        f || e(new S(R.Q));
        8192 === (f.mode & 61440) && (b &= -513);
        f ? 40960 === (f.mode & 61440) ? c = R.Z : 16384 === (f.mode & 61440) && (0 !== (b & 2097155) || b & 512) ? c = R.Y : (c = ["r", "w", "rw"][b & 2097155], b & 512 && (c += "w"), c = Hb(f, c)) : c = R.Q;
        c && e(new S(c));
        b & 512 && (c = f, c = "string" === typeof c ? U(c, {
            N: l
        }).e : c, c.g.o || e(new S(R.L)), 16384 === (c.mode & 61440) && e(new S(R.Y)), 32768 !== (c.mode & 61440) && e(new S(R.C)), (d = Hb(c, "w")) && e(new S(d)), c.g.o(c, {
            size: 0,
            timestamp: Date.now()
        }));
        var b = b & -641,
            h;
        f = {
            e: f,
            path: W(f),
            M: b,
            seekable: l,
            position: 0,
            k: f.k,
            Va: [],
            error: p
        };
        Y || (Y = q(), Y.prototype = {}, Object.defineProperties(Y.prototype, {
            object: {
                get: function() {
                    return this.e
                },
                set: function(a) {
                    this.e = a
                }
            },
            qd: {
                get: function() {
                    return 1 !== (this.M & 2097155)
                }
            },
            rd: {
                get: function() {
                    return 0 !==
                        (this.M & 2097155)
                }
            },
            pd: {
                get: function() {
                    return this.M & 1024
                }
            }
        }));
        if (f.__proto__) f.__proto__ = Y.prototype;
        else {
            c = new Y;
            for (var k in f) c[k] = f[k];
            f = c
        }
        a: {
            k = i || 4096;
            for (c = i || 1; c <= k; c++)
                if (!Ab[c]) {
                    h = c;
                    break a
                }
            e(new S(R.Ea))
        }
        f.q = h;
        h = Ab[h] = f;
        h.k.open && h.k.open(h);
        r.logReadFiles && !(b & 1) && (Sb || (Sb = {}), a in Sb || (Sb[a] = 1, r.printErr("read file: " + a)));
        return h
    }

    function Tb(a) {
        try {
            a.k.close && a.k.close(a)
        } catch (b) {
            e(b)
        } finally {
            Ab[a.q] = m
        }
    }

    function Ub() {
        S || (S = function(a) {
            this.jd = a;
            for (var b in R)
                if (R[b] === a) {
                    this.code = b;
                    break
                }
            this.message = nb[a];
            this.stack = Ma()
        }, S.prototype = Error(), [R.Q].forEach(function(a) {
            ub[a] = new S(a);
            ub[a].stack = "<generic error, no stack>"
        }))
    }
    var Vb;

    function Wb(a, b) {
        var c = 0;
        a && (c |= 365);
        b && (c |= 146);
        return c
    }

    function Xb(a, b, c, d, f, g) {
        a = b ? V(("string" === typeof a ? a : W(a)) + "/" + b) : a;
        d = Wb(d, f);
        f = Nb(a, d);
        if (c) {
            if ("string" === typeof c) {
                for (var a = Array(c.length), b = 0, h = c.length; b < h; ++b) a[b] = c.charCodeAt(b);
                c = a
            }
            Qb(f, d | 146);
            var a = Rb(f, "w"),
                b = c,
                h = c.length,
                k = 0;
            (0 > h || 0 > k) && e(new S(R.C));
            0 === (a.M & 2097155) && e(new S(R.Da));
            16384 === (a.e.mode & 61440) && e(new S(R.Y));
            a.k.write || e(new S(R.C));
            c = l;
            "undefined" === typeof k ? (k = a.position, c = p) : a.seekable || e(new S(R.$));
            a.M & 1024 && ((!a.seekable || !a.k.F) && e(new S(R.$)), a.k.F(a, 0, 2));
            g =
                a.k.write(a, b, 0, h, k, g);
            c || (a.position += g);
            Tb(a);
            Qb(f, d)
        }
        return f
    }

    function Z(a, b, c, d) {
        a = V(("string" === typeof a ? a : W(a)) + "/" + b);
        b = Wb(!!c, !!d);
        Z.ua || (Z.ua = 64);
        var f;
        f = Z.ua++ << 8 | 0;
        qb[f] = {
            k: {
                open: function(a) {
                    a.seekable = p
                },
                close: function() {
                    d && (d.buffer && d.buffer.length) && d(10)
                },
                H: function(a, b, d, f) {
                    for (var j = 0, z = 0; z < f; z++) {
                        var A;
                        try {
                            A = c()
                        } catch (n) {
                            e(new S(R.D))
                        }
                        A === i && 0 === j && e(new S(R.ia));
                        if (A === m || A === i) break;
                        j++;
                        b[d + z] = A
                    }
                    j && (a.e.timestamp = Date.now());
                    return j
                },
                write: function(a, b, c, f) {
                    for (var j = 0; j < f; j++) try {
                        d(b[c + j])
                    } catch (z) {
                        e(new S(R.D))
                    }
                    f && (a.e.timestamp = Date.now());
                    return j
                }
            }
        };
        return Ob(a, b, f)
    }

    function Yb(a) {
        if (a.Na || a.Oa || a.link || a.n) return l;
        var b = l;
        "undefined" !== typeof XMLHttpRequest && e(Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."));
        if (r.read) try {
            a.n = D(r.read(a.url), l)
        } catch (c) {
            b = p
        } else e(Error("Cannot load without read() or XMLHttpRequest."));
        b || kb(R.D);
        return b
    }
    var Ib, Y, Sb;

    function Fb(a, b) {
        for (var c = 0, d = a.length - 1; 0 <= d; d--) {
            var f = a[d];
            "." === f ? a.splice(d, 1) : ".." === f ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
        }
        if (b)
            for (; c--; c) a.unshift("..");
        return a
    }

    function V(a) {
        var b = "/" === a.charAt(0),
            c = "/" === a.substr(-1),
            a = Fb(a.split("/").filter(function(a) {
                return !!a
            }), !b).join("/");
        !a && !b && (a = ".");
        a && c && (a += "/");
        return (b ? "/" : "") + a
    }

    function Mb(a) {
        if ("/" === a) return "/";
        var b = a.lastIndexOf("/");
        return -1 === b ? a : a.substr(b + 1)
    }

    function Eb() {
        for (var a = "", b = p, c = arguments.length - 1; - 1 <= c && !b; c--) {
            var d = 0 <= c ? arguments[c] : "/";
            "string" !== typeof d && e(new TypeError("Arguments to path.resolve must be strings"));
            d && (a = d + "/" + a, b = "/" === d.charAt(0))
        }
        a = Fb(a.split("/").filter(function(a) {
            return !!a
        }), !b).join("/");
        return (b ? "/" : "") + a || "."
    }
    var Zb = p,
        $b = p,
        ac = p,
        bc = p,
        cc = i,
        dc = i;

    function ec(a) {
        return {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            bmp: "image/bmp",
            ogg: "audio/ogg",
            wav: "audio/wav",
            mp3: "audio/mpeg"
        }[a.substr(a.lastIndexOf(".") + 1)]
    }
    var fc = [];

    function gc() {
        var a = r.canvas;
        fc.forEach(function(b) {
            b(a.width, a.height)
        })
    }

    function hc() {
        var a = r.canvas;
        this.Xa = a.width;
        this.Wa = a.height;
        a.width = screen.width;
        a.height = screen.height;
        "undefined" != typeof SDL && (a = Oa[SDL.screen + 0 * ma >> 2], H[SDL.screen + 0 * ma >> 2] = a | 8388608);
        gc()
    }

    function ic() {
        var a = r.canvas;
        a.width = this.Xa;
        a.height = this.Wa;
        "undefined" != typeof SDL && (a = Oa[SDL.screen + 0 * ma >> 2], H[SDL.screen + 0 * ma >> 2] = a & -8388609);
        gc()
    }
    var jc, kc, lc, mc, jb = ra(4);
    H[jb >> 2] = 0;
    r.requestFullScreen = function(a, b) {
        function c() {
            $b = p;
            (document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement) === d ? (d.pa = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen, d.pa = d.pa.bind(document), cc && d.ga(), $b = l, dc && hc()) : dc && ic();
            if (r.onFullScreen) r.onFullScreen($b)
        }
        cc = a;
        dc = b;
        "undefined" === typeof cc && (cc = l);
        "undefined" === typeof dc &&
            (dc = p);
        var d = r.canvas;
        bc || (bc = l, document.addEventListener("fullscreenchange", c, p), document.addEventListener("mozfullscreenchange", c, p), document.addEventListener("webkitfullscreenchange", c, p));
        d.Ta = d.requestFullScreen || d.mozRequestFullScreen || (d.webkitRequestFullScreen ? function() {
            d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
        } : m);
        d.Ta()
    };
    r.requestAnimationFrame = function(a) {
        "undefined" === typeof window ? setTimeout(a, 1E3 / 60) : (window.requestAnimationFrame || (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || window.setTimeout), window.requestAnimationFrame(a))
    };
    r.setCanvasSize = function(a, b, c) {
        var d = r.canvas;
        d.width = a;
        d.height = b;
        c || gc()
    };
    r.pauseMainLoop = q();
    r.resumeMainLoop = function() {
        Zb && (Zb = p, m())
    };
    r.getUserMedia = function() {
        window.sa || (window.sa = navigator.getUserMedia || navigator.mozGetUserMedia);
        window.sa(i)
    };
    Ub();
    var Cb = Array(4096),
        zb = tb(m, "/", 16895, 0),
        nc = T,
        oc = "/",
        pc;
    oc && (pc = U(oc, {
        N: p
    }), oc = pc.path);
    var qc = {
            type: nc,
            vd: {},
            Qa: oc,
            root: m
        },
        rc = nc.B(qc);
    rc.B = qc;
    qc.root = rc;
    pc && (pc.e.B = qc, pc.e.Pa = l, "/" === oc && (zb = qc.root));
    X("/tmp");
    X("/dev");
    qb[259] = {
        k: {
            H: function() {
                return 0
            },
            write: function() {
                return 0
            }
        }
    };
    Ob("/dev/null", 259);
    pb(1280, {
        ta: function(a) {
            if (!a.input.length) {
                var b = m;
                if (ba) {
                    if (b = process.stdin.read(), !b) {
                        if (process.stdin._readableState && process.stdin._readableState.ended) return m;
                        return
                    }
                } else "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "), b !== m && (b += "\n")) : "function" == typeof readline && (b = readline(), b !== m && (b += "\n"));
                if (!b) return m;
                a.input = D(b, l)
            }
            return a.input.shift()
        },
        T: function(a, b) {
            b === m || 10 === b ? (r.print(a.G.join("")), a.G = []) : a.G.push(sc.ea(b))
        }
    });
    pb(1536, {
        T: function(a, b) {
            b === m || 10 === b ? (r.printErr(a.G.join("")), a.G = []) : a.G.push(sc.ea(b))
        }
    });
    Ob("/dev/tty", 1280);
    Ob("/dev/tty1", 1536);
    X("/dev/shm");
    X("/dev/shm/tmp");
    P.unshift({
        J: function() {
            if (!r.noFSInit && !Vb) {
                w(!Vb, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
                Vb = l;
                Ub();
                r.stdin = r.stdin;
                r.stdout = r.stdout;
                r.stderr = r.stderr;
                r.stdin ? Z("/dev", "stdin", r.stdin) : Pb("/dev/tty", "/dev/stdin");
                r.stdout ? Z("/dev", "stdout", m, r.stdout) : Pb("/dev/tty", "/dev/stdout");
                r.stderr ? Z("/dev", "stderr", m, r.stderr) : Pb("/dev/tty1", "/dev/stderr");
                var a = Rb("/dev/stdin",
                    "r");
                H[wb >> 2] = a.q;
                w(1 === a.q, "invalid handle for stdin (" + a.q + ")");
                a = Rb("/dev/stdout", "w");
                H[xb >> 2] = a.q;
                w(2 === a.q, "invalid handle for stdout (" + a.q + ")");
                a = Rb("/dev/stderr", "w");
                H[yb >> 2] = a.q;
                w(3 === a.q, "invalid handle for stderr (" + a.q + ")")
            }
        }
    });
    Ua.push({
        J: function() {
            Db = p
        }
    });
    Va.push({
        J: function() {
            Vb = p;
            for (var a = 0; a < Ab.length; a++) {
                var b = Ab[a];
                b && Tb(b)
            }
        }
    });
    r.FS_createFolder = function(a, b, c, d) {
        a = V(("string" === typeof a ? a : W(a)) + "/" + b);
        return X(a, Wb(c, d))
    };
    r.FS_createPath = function(a, b) {
        for (var a = "string" === typeof a ? a : W(a), c = b.split("/").reverse(); c.length;) {
            var d = c.pop();
            if (d) {
                var f = V(a + "/" + d);
                try {
                    X(f)
                } catch (g) {}
                a = f
            }
        }
        return f
    };
    r.FS_createDataFile = Xb;
    r.FS_createPreloadedFile = function(a, b, c, d, f, g, h, k, t) {
        function j() {
            ac = document.pointerLockElement === n || document.mozPointerLockElement === n || document.webkitPointerLockElement === n
        }

        function z(c) {
            function j(c) {
                k || Xb(a, b, c, d, f, t);
                g && g();
                cb()
            }
            var n = p;
            r.preloadPlugins.forEach(function(a) {
                !n && a.canHandle(v) && (a.handle(c, v, j, function() {
                    h && h();
                    cb()
                }), n = l)
            });
            n || j(c)
        }
        r.preloadPlugins || (r.preloadPlugins = []);
        if (!jc && !ea) {
            jc = l;
            try {
                new Blob, kc = l
            } catch (A) {
                kc = p, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
            }
            lc =
                "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : !kc ? console.log("warning: no BlobBuilder") : m;
            mc = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : i;
            !r.wa && "undefined" === typeof mc && (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), r.wa = l);
            r.preloadPlugins.push({
                canHandle: function(a) {
                    return !r.wa && /\.(jpg|jpeg|png|bmp)$/i.test(a)
                },
                handle: function(a, b,
                    c, d) {
                    var f = m;
                    if (kc) try {
                        f = new Blob([a], {
                            type: ec(b)
                        }), f.size !== a.length && (f = new Blob([(new Uint8Array(a)).buffer], {
                            type: ec(b)
                        }))
                    } catch (g) {
                        var h = "Blob constructor present but fails: " + g + "; falling back to blob builder";
                        oa || (oa = {});
                        oa[h] || (oa[h] = 1, r.P(h))
                    }
                    f || (f = new lc, f.append((new Uint8Array(a)).buffer), f = f.getBlob());
                    var j = mc.createObjectURL(f),
                        n = new Image;
                    n.onload = function() {
                        w(n.complete, "Image " + b + " could not be decoded");
                        var d = document.createElement("canvas");
                        d.width = n.width;
                        d.height = n.height;
                        d.getContext("2d").drawImage(n,
                            0, 0);
                        r.preloadedImages[b] = d;
                        mc.revokeObjectURL(j);
                        c && c(a)
                    };
                    n.onerror = function() {
                        console.log("Image " + j + " could not be decoded");
                        d && d()
                    };
                    n.src = j
                }
            });
            r.preloadPlugins.push({
                canHandle: function(a) {
                    return !r.ud && a.substr(-4) in {
                        ".ogg": 1,
                        ".wav": 1,
                        ".mp3": 1
                    }
                },
                handle: function(a, b, c, d) {
                    function f(d) {
                        h || (h = l, r.preloadedAudios[b] = d, c && c(a))
                    }

                    function g() {
                        h || (h = l, r.preloadedAudios[b] = new Audio, d && d())
                    }
                    var h = p;
                    if (kc) {
                        try {
                            var j = new Blob([a], {
                                type: ec(b)
                            })
                        } catch (n) {
                            return g()
                        }
                        var j = mc.createObjectURL(j),
                            k = new Audio;
                        k.addEventListener("canplaythrough",
                            function() {
                                f(k)
                            }, p);
                        k.onerror = function() {
                            if (!h) {
                                console.log("warning: browser could not fully decode audio " + b + ", trying slower base64 approach");
                                for (var c = "", d = 0, g = 0, j = 0; j < a.length; j++) {
                                    d = d << 8 | a[j];
                                    for (g += 8; 6 <= g;) var n = d >> g - 6 & 63,
                                        g = g - 6,
                                        c = c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [n]
                                }
                                2 == g ? (c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(d & 3) << 4], c += "==") : 4 == g && (c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" [(d & 15) << 2], c += "=");
                                k.src = "data:audio/x-" + b.substr(-3) + ";base64," + c;
                                f(k)
                            }
                        };
                        k.src = j;
                        setTimeout(function() {
                            xa || f(k)
                        }, 1E4)
                    } else return g()
                }
            });
            var n = r.canvas;
            n.ga = n.requestPointerLock || n.mozRequestPointerLock || n.webkitRequestPointerLock;
            n.ra = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || q();
            n.ra = n.ra.bind(document);
            document.addEventListener("pointerlockchange", j, p);
            document.addEventListener("mozpointerlockchange", j, p);
            document.addEventListener("webkitpointerlockchange", j, p);
            r.elementPointerLock &&
                n.addEventListener("click", function(a) {
                    !ac && n.ga && (n.ga(), a.preventDefault())
                }, p)
        }
        var v = b ? Eb(V(a + "/" + b)) : a;
        bb();
        if ("string" == typeof c) {
            var E = h,
                da = function() {
                    E ? E() : e('Loading data file "' + c + '" failed.')
                },
                J = new XMLHttpRequest;
            J.open("GET", c, l);
            J.responseType = "arraybuffer";
            J.onload = function() {
                if (200 == J.status || 0 == J.status && J.response) {
                    var a = J.response;
                    w(a, 'Loading data file "' + c + '" failed (no arrayBuffer).');
                    a = new Uint8Array(a);
                    z(a);
                    cb()
                } else da()
            };
            J.onerror = da;
            J.send(m);
            bb()
        } else z(c)
    };
    r.FS_createLazyFile = function(a, b, c, d, f) {
        var g, h;
        "undefined" !== typeof XMLHttpRequest ? (ea || e("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"), g = function() {
            this.ca = p;
            this.R = []
        }, g.prototype.get = function(a) {
            if (!(a > this.length - 1 || 0 > a)) {
                var b = a % this.La;
                return this.Ma(Math.floor(a / this.La))[b]
            }
        }, g.prototype.Ua = function(a) {
            this.Ma = a
        }, g.prototype.oa = function() {
            var a = new XMLHttpRequest;
            a.open("HEAD", c, p);
            a.send(m);
            200 <= a.status && 300 > a.status ||
                304 === a.status || e(Error("Couldn't load " + c + ". Status: " + a.status));
            var b = Number(a.getResponseHeader("Content-length")),
                d, f = 1048576;
            if (!((d = a.getResponseHeader("Accept-Ranges")) && "bytes" === d)) f = b;
            var g = this;
            g.Ua(function(a) {
                var d = a * f,
                    h = (a + 1) * f - 1,
                    h = Math.min(h, b - 1);
                if ("undefined" === typeof g.R[a]) {
                    var k = g.R;
                    d > h && e(Error("invalid range (" + d + ", " + h + ") or no bytes requested!"));
                    h > b - 1 && e(Error("only " + b + " bytes available! programmer error!"));
                    var j = new XMLHttpRequest;
                    j.open("GET", c, p);
                    b !== f && j.setRequestHeader("Range",
                        "bytes=" + d + "-" + h);
                    "undefined" != typeof Uint8Array && (j.responseType = "arraybuffer");
                    j.overrideMimeType && j.overrideMimeType("text/plain; charset=x-user-defined");
                    j.send(m);
                    200 <= j.status && 300 > j.status || 304 === j.status || e(Error("Couldn't load " + c + ". Status: " + j.status));
                    d = j.response !== i ? new Uint8Array(j.response || []) : D(j.responseText || "", l);
                    k[a] = d
                }
                "undefined" === typeof g.R[a] && e(Error("doXHR failed!"));
                return g.R[a]
            });
            this.Ha = b;
            this.Ga = f;
            this.ca = l
        }, g = new g, Object.defineProperty(g, "length", {
            get: function() {
                this.ca ||
                    this.oa();
                return this.Ha
            }
        }), Object.defineProperty(g, "chunkSize", {
            get: function() {
                this.ca || this.oa();
                return this.Ga
            }
        }), h = i) : (h = c, g = i);
        var k, a = V(("string" === typeof a ? a : W(a)) + "/" + b);
        k = Nb(a, Wb(d, f));
        g ? k.n = g : h && (k.n = m, k.url = h);
        var t = {};
        Object.keys(k.k).forEach(function(a) {
            var b = k.k[a];
            t[a] = function() {
                Yb(k) || e(new S(R.D));
                return b.apply(m, arguments)
            }
        });
        t.H = function(a, b, c, d, f) {
            Yb(k) || e(new S(R.D));
            a = a.e.n;
            if (f >= a.length) return 0;
            d = Math.min(a.length - f, d);
            w(0 <= d);
            if (a.slice)
                for (var g = 0; g < d; g++) b[c + g] = a[f + g];
            else
                for (g = 0; g < d; g++) b[c + g] = a.get(f + g);
            return d
        };
        k.k = t;
        return k
    };
    r.FS_createLink = function(a, b, c) {
        a = V(("string" === typeof a ? a : W(a)) + "/" + b);
        return Pb(c, a)
    };
    r.FS_createDevice = Z;
    P.unshift({
        J: q()
    });
    Va.push({
        J: q()
    });
    var sc = new pa;
    ba && (require("fs"), process.platform.match(/^win/));
    Qa = u = va(x);
    Ra = Qa + 5242880;
    Sa = y = va(Ra);
    w(Sa < ua);
    Fa = Math.min;
    var $ = (function(global, env, buffer) {
            // EMSCRIPTEN_START_ASM
            "use asm";
            var a = new global.Int8Array(buffer);
            var b = new global.Int16Array(buffer);
            var c = new global.Int32Array(buffer);
            var d = new global.Uint8Array(buffer);
            var e = new global.Uint16Array(buffer);
            var f = new global.Uint32Array(buffer);
            var g = new global.Float32Array(buffer);
            var h = new global.Float64Array(buffer);
            var i = env.STACKTOP | 0;
            var j = env.STACK_MAX | 0;
            var k = env.tempDoublePtr | 0;
            var l = env.ABORT | 0;
            var m = env.cttz_i8 | 0;
            var n = env.ctlz_i8 | 0;
            var o = +env.NaN;
            var p = +env.Infinity;
            var q = 0;
            var r = 0;
            var s = 0;
            var t = 0;
            var u = 0,
                v = 0,
                w = 0,
                x = 0,
                y = 0.0,
                z = 0,
                A = 0,
                B = 0,
                C = 0.0;
            var D = 0;
            var E = 0;
            var F = 0;
            var G = 0;
            var H = 0;
            var I = 0;
            var J = 0;
            var K = 0;
            var L = 0;
            var M = 0;
            var N = global.Math.floor;
            var O = global.Math.abs;
            var P = global.Math.sqrt;
            var Q = global.Math.pow;
            var R = global.Math.cos;
            var S = global.Math.sin;
            var T = global.Math.tan;
            var U = global.Math.acos;
            var V = global.Math.asin;
            var W = global.Math.atan;
            var X = global.Math.atan2;
            var Y = global.Math.exp;
            var Z = global.Math.log;
            var _ = global.Math.ceil;
            var $ = global.Math.imul;
            var aa = env.abort;
            var ab = env.assert;
            var ac = env.asmPrintInt;
            var ad = env.asmPrintFloat;
            var ae = env.min;
            var af = env.invoke_ii;
            var ag = env.invoke_v;
            var ah = env.invoke_iii;
            var ai = env.invoke_vi;
            var aj = env._sysconf;
            var ak = env._sbrk;
            var al = env.___setErrNo;
            var am = env.___errno_location;
            var an = env._abort;
            var ao = env._time;
            var ap = env._fflush;
            var aq = 0.0;
            // EMSCRIPTEN_START_FUNCS
            function av(a) {
                a = a | 0;
                var b = 0;
                b = i;
                i = i + a | 0;
                i = i + 7 & -8;
                return b | 0
            }

            function aw() {
                return i | 0
            }

            function ax(a) {
                a = a | 0;
                i = a
            }

            function ay(a, b) {
                a = a | 0;
                b = b | 0;
                if ((q | 0) == 0) {
                    q = a;
                    r = b
                }
            }

            function az(b) {
                b = b | 0;
                a[k] = a[b];
                a[k + 1 | 0] = a[b + 1 | 0];
                a[k + 2 | 0] = a[b + 2 | 0];
                a[k + 3 | 0] = a[b + 3 | 0]
            }

            function aA(b) {
                b = b | 0;
                a[k] = a[b];
                a[k + 1 | 0] = a[b + 1 | 0];
                a[k + 2 | 0] = a[b + 2 | 0];
                a[k + 3 | 0] = a[b + 3 | 0];
                a[k + 4 | 0] = a[b + 4 | 0];
                a[k + 5 | 0] = a[b + 5 | 0];
                a[k + 6 | 0] = a[b + 6 | 0];
                a[k + 7 | 0] = a[b + 7 | 0]
            }

            function aB(a) {
                a = a | 0;
                D = a
            }

            function aC(a) {
                a = a | 0;
                E = a
            }

            function aD(a) {
                a = a | 0;
                F = a
            }

            function aE(a) {
                a = a | 0;
                G = a
            }

            function aF(a) {
                a = a | 0;
                H = a
            }

            function aG(a) {
                a = a | 0;
                I = a
            }

            function aH(a) {
                a = a | 0;
                J = a
            }

            function aI(a) {
                a = a | 0;
                K = a
            }

            function aJ(a) {
                a = a | 0;
                L = a
            }

            function aK(a) {
                a = a | 0;
                M = a
            }

            function aL() {}

            function aM(f, g, h) {
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0,
                    k = 0,
                    l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0,
                    t = 0,
                    u = 0,
                    w = 0,
                    x = 0,
                    y = 0,
                    z = 0,
                    A = 0,
                    B = 0,
                    C = 0,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0,
                    I = 0,
                    J = 0,
                    K = 0,
                    L = 0,
                    M = 0,
                    N = 0,
                    O = 0,
                    P = 0,
                    Q = 0,
                    R = 0,
                    S = 0,
                    T = 0,
                    U = 0,
                    V = 0,
                    W = 0,
                    X = 0,
                    Y = 0,
                    Z = 0,
                    _ = 0,
                    aa = 0,
                    ab = 0,
                    ac = 0,
                    ad = 0,
                    ae = 0,
                    af = 0,
                    ag = 0,
                    ah = 0,
                    ai = 0,
                    aj = 0,
                    ak = 0,
                    al = 0,
                    am = 0,
                    an = 0,
                    ao = 0,
                    ap = 0,
                    aq = 0,
                    ar = 0,
                    as = 0,
                    at = 0,
                    au = 0,
                    av = 0,
                    aw = 0,
                    ax = 0,
                    ay = 0,
                    az = 0,
                    aA = 0,
                    aB = 0,
                    aC = 0,
                    aD = 0,
                    aE = 0,
                    aF = 0,
                    aG = 0;
                j = i;
                i = i + 16384 | 0;
                k = j | 0;
                l = k;
                aR(l | 0, 0, 16384) | 0;
                l = f + h | 0;
                m = h - 12 | 0;
                n = f + m | 0;
                o = f + (h - 5) | 0;
                p = h >>> 0 > 2113929216 >>> 0;
                if ((h | 0) >= 65547) {
                    if (p) {
                        q = 0;
                        i = j;
                        return q | 0
                    }
                    r = f;
                    c[k + (($(d[r] | d[r + 1 | 0] << 8 | d[r + 2 | 0] << 16 | d[r + 3 | 0] << 24 | 0, -1640531535) | 0) >>> 20 << 2) >> 2] = f;
                    L6: do {
                        if ((m | 0) < 2) {
                            s = f;
                            t = g
                        } else {
                            r = f + (h - 8) | 0;
                            u = f + (h - 6) | 0;
                            w = g;
                            x = f;
                            y = f;
                            z = f + 2 | 0;
                            while (1) {
                                A = y + 1 | 0;
                                B = A;
                                C = A;
                                A = d[B] | d[B + 1 | 0] << 8 | d[B + 2 | 0] << 16 | d[B + 3 | 0] << 24 | 0;
                                B = 68;
                                D = z;
                                while (1) {
                                    E = ($(A, -1640531535) | 0) >>> 20;
                                    F = D;
                                    G = d[F] | d[F + 1 | 0] << 8 | d[F + 2 | 0] << 16 | d[F + 3 | 0] << 24 | 0;
                                    F = k + (E << 2) | 0;
                                    E = c[F >> 2] | 0;
                                    c[F >> 2] = C;
                                    if ((E + 65535 | 0) >>> 0 >= C >>> 0) {
                                        F = E;
                                        H = C;
                                        if ((d[F] | d[F + 1 | 0] << 8 | d[F + 2 | 0] << 16 | d[F + 3 | 0] << 24 | 0) == (d[H] | d[H + 1 | 0] << 8 | d[H + 2 | 0] << 16 | d[H + 3 | 0] << 24 | 0)) {
                                            I = C;
                                            J = E;
                                            break
                                        }
                                    }
                                    E = D + (B >> 6) | 0;
                                    if (E >>> 0 > n >>> 0) {
                                        s = x;
                                        t = w;
                                        break L6
                                    } else {
                                        C = D;
                                        A = G;
                                        B = B + 1 | 0;
                                        D = E
                                    }
                                }
                                while (1) {
                                    if (!(I >>> 0 > x >>> 0 & J >>> 0 > f >>> 0)) {
                                        break
                                    }
                                    D = I - 1 | 0;
                                    B = J - 1 | 0;
                                    if ((a[D] | 0) == (a[B] | 0)) {
                                        I = D;
                                        J = B
                                    } else {
                                        break
                                    }
                                }
                                B = I;
                                D = x;
                                A = B - D | 0;
                                C = w + 1 | 0;
                                if ((A | 0) > 14) {
                                    E = A - 15 | 0;
                                    a[w] = -16;
                                    if ((E | 0) > 254) {
                                        G = B - 270 - D | 0;
                                        D = (G >>> 0) / 255 | 0;
                                        B = D + 1 | 0;
                                        aR(C | 0, -1 | 0, B | 0) | 0;
                                        K = G + (D * -255 | 0) & 255;
                                        L = w + (D + 2) | 0
                                    } else {
                                        K = E & 255;
                                        L = C
                                    }
                                    a[L] = K;
                                    M = L + 1 | 0
                                } else {
                                    a[w] = A << 4 & 255;
                                    M = C
                                }
                                C = M + A | 0;
                                A = x;
                                E = M;
                                while (1) {
                                    D = A;
                                    G = E;
                                    v = d[D] | d[D + 1 | 0] << 8 | d[D + 2 | 0] << 16 | d[D + 3 | 0] << 24 | 0;
                                    a[G] = v & 255;
                                    v = v >> 8;
                                    a[G + 1 | 0] = v & 255;
                                    v = v >> 8;
                                    a[G + 2 | 0] = v & 255;
                                    v = v >> 8;
                                    a[G + 3 | 0] = v & 255;
                                    G = A + 4 | 0;
                                    D = E + 4 | 0;
                                    v = d[G] | d[G + 1 | 0] << 8 | d[G + 2 | 0] << 16 | d[G + 3 | 0] << 24 | 0;
                                    a[D] = v & 255;
                                    v = v >> 8;
                                    a[D + 1 | 0] = v & 255;
                                    v = v >> 8;
                                    a[D + 2 | 0] = v & 255;
                                    v = v >> 8;
                                    a[D + 3 | 0] = v & 255;
                                    D = E + 8 | 0;
                                    if (D >>> 0 < C >>> 0) {
                                        A = A + 8 | 0;
                                        E = D
                                    } else {
                                        N = I;
                                        O = C;
                                        P = J;
                                        Q = w;
                                        break
                                    }
                                }
                                while (1) {
                                    C = O;
                                    v = N - P & 65535;
                                    a[C] = v & 255;
                                    v = v >> 8;
                                    a[C + 1 | 0] = v & 255;
                                    C = O + 2 | 0;
                                    E = N + 4 | 0;
                                    A = E;
                                    D = P;
                                    while (1) {
                                        R = D + 4 | 0;
                                        if (A >>> 0 >= r >>> 0) {
                                            S = 68;
                                            break
                                        }
                                        G = R;
                                        T = d[G] | d[G + 1 | 0] << 8 | d[G + 2 | 0] << 16 | d[G + 3 | 0] << 24 | 0;
                                        G = A;
                                        U = d[G] | d[G + 1 | 0] << 8 | d[G + 2 | 0] << 16 | d[G + 3 | 0] << 24 | 0;
                                        if ((T | 0) == (U | 0)) {
                                            A = A + 4 | 0;
                                            D = R
                                        } else {
                                            S = 67;
                                            break
                                        }
                                    }
                                    do {
                                        if ((S | 0) == 67) {
                                            S = 0;
                                            V = A + ((aT(U ^ T | 0) | 0) >>> 3) | 0
                                        } else if ((S | 0) == 68) {
                                            S = 0;
                                            do {
                                                if (A >>> 0 < u >>> 0) {
                                                    G = R;
                                                    B = A;
                                                    if ((d[G] | d[G + 1 | 0] << 8) << 16 >> 16 << 16 >> 16 != (d[B] | d[B + 1 | 0] << 8) << 16 >> 16 << 16 >> 16) {
                                                        W = A;
                                                        X = R;
                                                        break
                                                    }
                                                    W = A + 2 | 0;
                                                    X = D + 6 | 0
                                                } else {
                                                    W = A;
                                                    X = R
                                                }
                                            } while (0);
                                            if (W >>> 0 >= o >>> 0) {
                                                V = W;
                                                break
                                            }
                                            V = (a[X] | 0) == (a[W] | 0) ? W + 1 | 0 : W
                                        }
                                    } while (0);
                                    A = V;
                                    D = E;
                                    B = A - D | 0;
                                    G = a[Q] | 0;
                                    if ((B | 0) > 14) {
                                        a[Q] = G + 15 & 255;
                                        H = B - 15 | 0;
                                        if ((H | 0) > 509) {
                                            F = A - 525 - D | 0;
                                            D = (F >>> 0) / 510 | 0;
                                            Y = F + (D * -510 | 0) | 0;
                                            F = D << 1;
                                            D = H;
                                            Z = C;
                                            while (1) {
                                                a[Z] = -1;
                                                a[Z + 1 | 0] = -1;
                                                _ = D - 510 | 0;
                                                if ((_ | 0) > 509) {
                                                    D = _;
                                                    Z = Z + 2 | 0
                                                } else {
                                                    break
                                                }
                                            }
                                            aa = Y;
                                            ab = O + (F + 4) | 0
                                        } else {
                                            aa = H;
                                            ab = C
                                        }
                                        if ((aa | 0) > 254) {
                                            a[ab] = -1;
                                            ac = ab + 1 | 0;
                                            ad = aa + 1 & 255
                                        } else {
                                            ac = ab;
                                            ad = aa & 255
                                        }
                                        a[ac] = ad;
                                        ae = ac + 1 | 0
                                    } else {
                                        a[Q] = (G & 255) + B & 255;
                                        ae = C
                                    }
                                    if (V >>> 0 > n >>> 0) {
                                        s = V;
                                        t = ae;
                                        break L6
                                    }
                                    Z = V - 2 | 0;
                                    D = Z;
                                    c[k + (($(d[D] | d[D + 1 | 0] << 8 | d[D + 2 | 0] << 16 | d[D + 3 | 0] << 24 | 0, -1640531535) | 0) >>> 20 << 2) >> 2] = Z;
                                    Z = V;
                                    D = k + (($(d[Z] | d[Z + 1 | 0] << 8 | d[Z + 2 | 0] << 16 | d[Z + 3 | 0] << 24 | 0, -1640531535) | 0) >>> 20 << 2) | 0;
                                    E = c[D >> 2] | 0;
                                    c[D >> 2] = A;
                                    if ((E + 65535 | 0) >>> 0 < V >>> 0) {
                                        break
                                    }
                                    D = E;
                                    if ((d[D] | d[D + 1 | 0] << 8 | d[D + 2 | 0] << 16 | d[D + 3 | 0] << 24 | 0) != (d[Z] | d[Z + 1 | 0] << 8 | d[Z + 2 | 0] << 16 | d[Z + 3 | 0] << 24 | 0)) {
                                        break
                                    }
                                    a[ae] = 0;
                                    N = V;
                                    O = ae + 1 | 0;
                                    P = E;
                                    Q = ae
                                }
                                E = V + 2 | 0;
                                if (E >>> 0 > n >>> 0) {
                                    s = V;
                                    t = ae;
                                    break
                                } else {
                                    w = ae;
                                    x = V;
                                    y = V;
                                    z = E
                                }
                            }
                        }
                    } while (0);
                    V = l;
                    ae = s;
                    Q = V - ae | 0;
                    if ((Q | 0) > 14) {
                        a[t] = -16;
                        P = Q - 15 | 0;
                        O = t + 1 | 0;
                        if ((P | 0) > 254) {
                            N = V - 270 - ae | 0;
                            ae = (N >>> 0) / 255 | 0;
                            V = ae + 2 | 0;
                            ac = ae + 1 | 0;
                            aR(O | 0, -1 | 0, ac | 0) | 0;
                            af = N + (ae * -255 | 0) & 255;
                            ag = t + V | 0
                        } else {
                            af = P & 255;
                            ag = O
                        }
                        a[ag] = af;
                        ah = ag
                    } else {
                        a[t] = Q << 4 & 255;
                        ah = t
                    }
                    t = ah + 1 | 0;
                    aS(t | 0, s | 0, Q) | 0;
                    q = ah + (Q + 1) - g | 0;
                    i = j;
                    return q | 0
                }
                if (p) {
                    q = 0;
                    i = j;
                    return q | 0
                }
                L72: do {
                    if ((h | 0) < 13) {
                        ai = g;
                        aj = f
                    } else {
                        p = f;
                        Q = k;
                        b[Q + (($(d[p] | d[p + 1 | 0] << 8 | d[p + 2 | 0] << 16 | d[p + 3 | 0] << 24 | 0, -1640531535) | 0) >>> 19 << 1) >> 1] = 0;
                        if ((m | 0) < 2) {
                            ai = g;
                            aj = f;
                            break
                        }
                        p = f;
                        ah = f + (h - 8) | 0;
                        s = f + (h - 6) | 0;
                        t = f;
                        ag = g;
                        af = f;
                        O = f + 2 | 0;
                        while (1) {
                            P = af + 1 | 0;
                            V = P;
                            ae = d[V] | d[V + 1 | 0] << 8 | d[V + 2 | 0] << 16 | d[V + 3 | 0] << 24 | 0;
                            V = P;
                            P = 68;
                            N = O;
                            while (1) {
                                ac = ($(ae, -1640531535) | 0) >>> 19;
                                ad = N;
                                aa = d[ad] | d[ad + 1 | 0] << 8 | d[ad + 2 | 0] << 16 | d[ad + 3 | 0] << 24 | 0;
                                ad = Q + (ac << 1) | 0;
                                ac = e[ad >> 1] | 0;
                                ab = f + ac | 0;
                                b[ad >> 1] = V - p & 65535;
                                if ((f + (ac + 65535) | 0) >>> 0 >= V >>> 0) {
                                    ac = ab;
                                    ad = V;
                                    if ((d[ac] | d[ac + 1 | 0] << 8 | d[ac + 2 | 0] << 16 | d[ac + 3 | 0] << 24 | 0) == (d[ad] | d[ad + 1 | 0] << 8 | d[ad + 2 | 0] << 16 | d[ad + 3 | 0] << 24 | 0)) {
                                        ak = ab;
                                        al = V;
                                        break
                                    }
                                }
                                ab = N + (P >> 6) | 0;
                                if (ab >>> 0 > n >>> 0) {
                                    ai = ag;
                                    aj = t;
                                    break L72
                                } else {
                                    ae = aa;
                                    V = N;
                                    P = P + 1 | 0;
                                    N = ab
                                }
                            }
                            while (1) {
                                if (!(al >>> 0 > t >>> 0 & ak >>> 0 > f >>> 0)) {
                                    break
                                }
                                N = al - 1 | 0;
                                P = ak - 1 | 0;
                                if ((a[N] | 0) == (a[P] | 0)) {
                                    ak = P;
                                    al = N
                                } else {
                                    break
                                }
                            }
                            N = al;
                            P = t;
                            V = N - P | 0;
                            ae = ag + 1 | 0;
                            if ((V | 0) > 14) {
                                ab = V - 15 | 0;
                                a[ag] = -16;
                                if ((ab | 0) > 254) {
                                    aa = N - 270 - P | 0;
                                    P = (aa >>> 0) / 255 | 0;
                                    N = P + 1 | 0;
                                    aR(ae | 0, -1 | 0, N | 0) | 0;
                                    am = ag + (P + 2) | 0;
                                    an = aa + (P * -255 | 0) & 255
                                } else {
                                    am = ae;
                                    an = ab & 255
                                }
                                a[am] = an;
                                ao = am + 1 | 0
                            } else {
                                a[ag] = V << 4 & 255;
                                ao = ae
                            }
                            ae = ao + V | 0;
                            V = ao;
                            ab = t;
                            while (1) {
                                P = ab;
                                aa = V;
                                v = d[P] | d[P + 1 | 0] << 8 | d[P + 2 | 0] << 16 | d[P + 3 | 0] << 24 | 0;
                                a[aa] = v & 255;
                                v = v >> 8;
                                a[aa + 1 | 0] = v & 255;
                                v = v >> 8;
                                a[aa + 2 | 0] = v & 255;
                                v = v >> 8;
                                a[aa + 3 | 0] = v & 255;
                                aa = ab + 4 | 0;
                                P = V + 4 | 0;
                                v = d[aa] | d[aa + 1 | 0] << 8 | d[aa + 2 | 0] << 16 | d[aa + 3 | 0] << 24 | 0;
                                a[P] = v & 255;
                                v = v >> 8;
                                a[P + 1 | 0] = v & 255;
                                v = v >> 8;
                                a[P + 2 | 0] = v & 255;
                                v = v >> 8;
                                a[P + 3 | 0] = v & 255;
                                P = V + 8 | 0;
                                if (P >>> 0 < ae >>> 0) {
                                    V = P;
                                    ab = ab + 8 | 0
                                } else {
                                    ap = ag;
                                    aq = ak;
                                    ar = ae;
                                    as = al;
                                    break
                                }
                            }
                            while (1) {
                                ae = ar;
                                v = as - aq & 65535;
                                a[ae] = v & 255;
                                v = v >> 8;
                                a[ae + 1 | 0] = v & 255;
                                ae = ar + 2 | 0;
                                ab = as + 4 | 0;
                                V = aq;
                                P = ab;
                                while (1) {
                                    at = V + 4 | 0;
                                    if (P >>> 0 >= ah >>> 0) {
                                        S = 23;
                                        break
                                    }
                                    aa = at;
                                    au = d[aa] | d[aa + 1 | 0] << 8 | d[aa + 2 | 0] << 16 | d[aa + 3 | 0] << 24 | 0;
                                    aa = P;
                                    av = d[aa] | d[aa + 1 | 0] << 8 | d[aa + 2 | 0] << 16 | d[aa + 3 | 0] << 24 | 0;
                                    if ((au | 0) == (av | 0)) {
                                        V = at;
                                        P = P + 4 | 0
                                    } else {
                                        S = 22;
                                        break
                                    }
                                }
                                do {
                                    if ((S | 0) == 22) {
                                        S = 0;
                                        aw = P + ((aT(av ^ au | 0) | 0) >>> 3) | 0
                                    } else if ((S | 0) == 23) {
                                        S = 0;
                                        do {
                                            if (P >>> 0 < s >>> 0) {
                                                A = at;
                                                C = P;
                                                if ((d[A] | d[A + 1 | 0] << 8) << 16 >> 16 << 16 >> 16 != (d[C] | d[C + 1 | 0] << 8) << 16 >> 16 << 16 >> 16) {
                                                    ax = at;
                                                    ay = P;
                                                    break
                                                }
                                                ax = V + 6 | 0;
                                                ay = P + 2 | 0
                                            } else {
                                                ax = at;
                                                ay = P
                                            }
                                        } while (0);
                                        if (ay >>> 0 >= o >>> 0) {
                                            aw = ay;
                                            break
                                        }
                                        aw = (a[ax] | 0) == (a[ay] | 0) ? ay + 1 | 0 : ay
                                    }
                                } while (0);
                                P = aw;
                                V = ab;
                                C = P - V | 0;
                                A = a[ap] | 0;
                                if ((C | 0) > 14) {
                                    a[ap] = A + 15 & 255;
                                    B = C - 15 | 0;
                                    if ((B | 0) > 509) {
                                        G = P - 525 - V | 0;
                                        V = (G >>> 0) / 510 | 0;
                                        H = G + (V * -510 | 0) | 0;
                                        G = V << 1;
                                        V = ae;
                                        F = B;
                                        while (1) {
                                            a[V] = -1;
                                            a[V + 1 | 0] = -1;
                                            Y = F - 510 | 0;
                                            if ((Y | 0) > 509) {
                                                V = V + 2 | 0;
                                                F = Y
                                            } else {
                                                break
                                            }
                                        }
                                        az = ar + (G + 4) | 0;
                                        aA = H
                                    } else {
                                        az = ae;
                                        aA = B
                                    }
                                    if ((aA | 0) > 254) {
                                        a[az] = -1;
                                        aB = aA + 1 & 255;
                                        aC = az + 1 | 0
                                    } else {
                                        aB = aA & 255;
                                        aC = az
                                    }
                                    a[aC] = aB;
                                    aD = aC + 1 | 0
                                } else {
                                    a[ap] = (A & 255) + C & 255;
                                    aD = ae
                                }
                                if (aw >>> 0 > n >>> 0) {
                                    ai = aD;
                                    aj = aw;
                                    break L72
                                }
                                F = aw - 2 | 0;
                                V = F;
                                b[Q + (($(d[V] | d[V + 1 | 0] << 8 | d[V + 2 | 0] << 16 | d[V + 3 | 0] << 24 | 0, -1640531535) | 0) >>> 19 << 1) >> 1] = F - p & 65535;
                                F = aw;
                                V = Q + (($(d[F] | d[F + 1 | 0] << 8 | d[F + 2 | 0] << 16 | d[F + 3 | 0] << 24 | 0, -1640531535) | 0) >>> 19 << 1) | 0;
                                ab = e[V >> 1] | 0;
                                Y = f + ab | 0;
                                b[V >> 1] = P - p & 65535;
                                if ((f + (ab + 65535) | 0) >>> 0 < aw >>> 0) {
                                    break
                                }
                                ab = Y;
                                if ((d[ab] | d[ab + 1 | 0] << 8 | d[ab + 2 | 0] << 16 | d[ab + 3 | 0] << 24 | 0) != (d[F] | d[F + 1 | 0] << 8 | d[F + 2 | 0] << 16 | d[F + 3 | 0] << 24 | 0)) {
                                    break
                                }
                                a[aD] = 0;
                                ap = aD;
                                aq = Y;
                                ar = aD + 1 | 0;
                                as = aw
                            }
                            Y = aw + 2 | 0;
                            if (Y >>> 0 > n >>> 0) {
                                ai = aD;
                                aj = aw;
                                break
                            } else {
                                t = aw;
                                ag = aD;
                                af = aw;
                                O = Y
                            }
                        }
                    }
                } while (0);
                aw = l;
                l = aj;
                aD = aw - l | 0;
                if ((aD | 0) > 14) {
                    a[ai] = -16;
                    n = aD - 15 | 0;
                    as = ai + 1 | 0;
                    if ((n | 0) > 254) {
                        ar = aw - 270 - l | 0;
                        l = (ar >>> 0) / 255 | 0;
                        aw = l + 2 | 0;
                        aq = l + 1 | 0;
                        aR(as | 0, -1 | 0, aq | 0) | 0;
                        aE = ar + (l * -255 | 0) & 255;
                        aF = ai + aw | 0
                    } else {
                        aE = n & 255;
                        aF = as
                    }
                    a[aF] = aE;
                    aG = aF
                } else {
                    a[ai] = aD << 4 & 255;
                    aG = ai
                }
                ai = aG + 1 | 0;
                aS(ai | 0, aj | 0, aD) | 0;
                q = aG + (aD + 1) - g | 0;
                i = j;
                return q | 0
            }

            function aN(b, e, f, g) {
                b = b | 0;
                e = e | 0;
                f = f | 0;
                g = g | 0;
                var h = 0,
                    i = 0,
                    j = 0,
                    k = 0,
                    l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0,
                    t = 0,
                    u = 0,
                    w = 0,
                    x = 0,
                    y = 0,
                    z = 0,
                    A = 0,
                    B = 0,
                    C = 0,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0,
                    I = 0,
                    J = 0,
                    K = 0,
                    L = 0,
                    M = 0,
                    N = 0,
                    O = 0,
                    P = 0,
                    Q = 0,
                    R = 0,
                    S = 0,
                    T = 0;
                h = b + f | 0;
                i = e + g | 0;
                if ((g | 0) == 0) {
                    if ((f | 0) != 1) {
                        j = -1;
                        return j | 0
                    }
                    j = ((a[b] | 0) != 0) << 31 >> 31;
                    return j | 0
                }
                k = e + (g - 12) | 0;
                l = b + (f - 8) | 0;
                m = e + (g - 8) | 0;
                n = e + (g - 5) | 0;
                g = b + (f - 6) | 0;
                f = b;
                o = e;
                L143: while (1) {
                    p = f + 1 | 0;
                    q = d[f] | 0;
                    r = q >>> 4;
                    do {
                        if ((r | 0) == 15) {
                            if (p >>> 0 < h >>> 0) {
                                s = 15;
                                t = p
                            } else {
                                u = p;
                                w = 15;
                                break
                            }
                            while (1) {
                                x = t + 1 | 0;
                                y = a[t] | 0;
                                z = (y & 255) + s | 0;
                                if (x >>> 0 < h >>> 0 & y << 24 >> 24 == -1) {
                                    s = z;
                                    t = x
                                } else {
                                    u = x;
                                    w = z;
                                    break
                                }
                            }
                        } else {
                            u = p;
                            w = r
                        }
                    } while (0);
                    A = o + w | 0;
                    B = u + w | 0;
                    if (A >>> 0 > k >>> 0 | B >>> 0 > l >>> 0) {
                        C = 106;
                        break
                    } else {
                        D = u;
                        E = o
                    }
                    while (1) {
                        r = D;
                        p = E;
                        v = d[r] | d[r + 1 | 0] << 8 | d[r + 2 | 0] << 16 | d[r + 3 | 0] << 24 | 0;
                        a[p] = v & 255;
                        v = v >> 8;
                        a[p + 1 | 0] = v & 255;
                        v = v >> 8;
                        a[p + 2 | 0] = v & 255;
                        v = v >> 8;
                        a[p + 3 | 0] = v & 255;
                        p = D + 4 | 0;
                        r = E + 4 | 0;
                        v = d[p] | d[p + 1 | 0] << 8 | d[p + 2 | 0] << 16 | d[p + 3 | 0] << 24 | 0;
                        a[r] = v & 255;
                        v = v >> 8;
                        a[r + 1 | 0] = v & 255;
                        v = v >> 8;
                        a[r + 2 | 0] = v & 255;
                        v = v >> 8;
                        a[r + 3 | 0] = v & 255;
                        F = E + 8 | 0;
                        if (F >>> 0 < A >>> 0) {
                            D = D + 8 | 0;
                            E = F
                        } else {
                            break
                        }
                    }
                    r = A;
                    p = r - F | 0;
                    z = D + (p + 8) | 0;
                    x = w - ((d[z] | d[z + 1 | 0] << 8) << 16 >> 16 & 65535) | 0;
                    z = o + x | 0;
                    y = D + (p + 10) | 0;
                    if (z >>> 0 < e >>> 0) {
                        G = y;
                        break
                    }
                    p = q & 15;
                    L154: do {
                        if ((p | 0) == 15) {
                            H = y;
                            I = 15;
                            while (1) {
                                if (H >>> 0 >= g >>> 0) {
                                    J = H;
                                    K = I;
                                    break L154
                                }
                                L = H + 1 | 0;
                                M = a[H] | 0;
                                N = (M & 255) + I | 0;
                                if (M << 24 >> 24 == -1) {
                                    H = L;
                                    I = N
                                } else {
                                    J = L;
                                    K = N;
                                    break
                                }
                            }
                        } else {
                            J = y;
                            K = p
                        }
                    } while (0);
                    if ((r - z | 0) < 4) {
                        a[A] = a[z] | 0;
                        a[o + (w + 1) | 0] = a[o + (x + 1) | 0] | 0;
                        a[o + (w + 2) | 0] = a[o + (x + 2) | 0] | 0;
                        a[o + (w + 3) | 0] = a[o + (x + 3) | 0] | 0;
                        p = o + (w + 4) | 0;
                        y = x + 4 | 0;
                        q = o + (y - (c[8 + (p - (o + y) << 2) >> 2] | 0)) | 0;
                        y = q;
                        I = p;
                        v = d[y] | d[y + 1 | 0] << 8 | d[y + 2 | 0] << 16 | d[y + 3 | 0] << 24 | 0;
                        a[I] = v & 255;
                        v = v >> 8;
                        a[I + 1 | 0] = v & 255;
                        v = v >> 8;
                        a[I + 2 | 0] = v & 255;
                        v = v >> 8;
                        a[I + 3 | 0] = v & 255;
                        O = q;
                        P = p
                    } else {
                        p = z;
                        q = A;
                        v = d[p] | d[p + 1 | 0] << 8 | d[p + 2 | 0] << 16 | d[p + 3 | 0] << 24 | 0;
                        a[q] = v & 255;
                        v = v >> 8;
                        a[q + 1 | 0] = v & 255;
                        v = v >> 8;
                        a[q + 2 | 0] = v & 255;
                        v = v >> 8;
                        a[q + 3 | 0] = v & 255;
                        O = o + (x + 4) | 0;
                        P = o + (w + 4) | 0
                    }
                    q = P + K | 0;
                    if (q >>> 0 <= m >>> 0) {
                        p = O;
                        I = P;
                        while (1) {
                            y = p;
                            H = I;
                            v = d[y] | d[y + 1 | 0] << 8 | d[y + 2 | 0] << 16 | d[y + 3 | 0] << 24 | 0;
                            a[H] = v & 255;
                            v = v >> 8;
                            a[H + 1 | 0] = v & 255;
                            v = v >> 8;
                            a[H + 2 | 0] = v & 255;
                            v = v >> 8;
                            a[H + 3 | 0] = v & 255;
                            H = p + 4 | 0;
                            y = I + 4 | 0;
                            v = d[H] | d[H + 1 | 0] << 8 | d[H + 2 | 0] << 16 | d[H + 3 | 0] << 24 | 0;
                            a[y] = v & 255;
                            v = v >> 8;
                            a[y + 1 | 0] = v & 255;
                            v = v >> 8;
                            a[y + 2 | 0] = v & 255;
                            v = v >> 8;
                            a[y + 3 | 0] = v & 255;
                            y = I + 8 | 0;
                            if (y >>> 0 < q >>> 0) {
                                p = p + 8 | 0;
                                I = y
                            } else {
                                f = J;
                                o = q;
                                continue L143
                            }
                        }
                    }
                    if (q >>> 0 > n >>> 0) {
                        G = J;
                        break
                    } else {
                        Q = O;
                        R = P
                    }
                    do {
                        I = Q;
                        p = R;
                        v = d[I] | d[I + 1 | 0] << 8 | d[I + 2 | 0] << 16 | d[I + 3 | 0] << 24 | 0;
                        a[p] = v & 255;
                        v = v >> 8;
                        a[p + 1 | 0] = v & 255;
                        v = v >> 8;
                        a[p + 2 | 0] = v & 255;
                        v = v >> 8;
                        a[p + 3 | 0] = v & 255;
                        p = Q + 4 | 0;
                        I = R + 4 | 0;
                        v = d[p] | d[p + 1 | 0] << 8 | d[p + 2 | 0] << 16 | d[p + 3 | 0] << 24 | 0;
                        a[I] = v & 255;
                        v = v >> 8;
                        a[I + 1 | 0] = v & 255;
                        v = v >> 8;
                        a[I + 2 | 0] = v & 255;
                        v = v >> 8;
                        a[I + 3 | 0] = v & 255;
                        R = R + 8 | 0;
                        Q = Q + 8 | 0;
                    } while (R >>> 0 < m >>> 0);
                    if (R >>> 0 < q >>> 0) {
                        S = R;
                        T = Q
                    } else {
                        f = J;
                        o = q;
                        continue
                    }
                    while (1) {
                        I = S + 1 | 0;
                        a[S] = a[T] | 0;
                        if (I >>> 0 < q >>> 0) {
                            S = I;
                            T = T + 1 | 0
                        } else {
                            f = J;
                            o = q;
                            continue L143
                        }
                    }
                }
                do {
                    if ((C | 0) == 106) {
                        if ((B | 0) != (h | 0) | A >>> 0 > i >>> 0) {
                            G = u;
                            break
                        }
                        aS(o | 0, u | 0, w) | 0;
                        j = A - e | 0;
                        return j | 0
                    }
                } while (0);
                j = b - 1 - G | 0;
                return j | 0
            }

            function aO(a, b, e) {
                a = a | 0;
                b = b | 0;
                e = e | 0;
                var f = 0,
                    g = 0,
                    h = 0,
                    i = 0,
                    j = 0,
                    k = 0,
                    l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0,
                    t = 0,
                    u = 0,
                    v = 0,
                    w = 0,
                    x = 0,
                    y = 0,
                    z = 0,
                    A = 0,
                    B = 0,
                    C = 0,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0;
                f = a + b | 0;
                g = (b | 0) > 15;
                if ((a & 3 | 0) == 0) {
                    if (g) {
                        h = a + (b - 16) | 0;
                        i = a;
                        j = e + 606290984 | 0;
                        k = e - 2048144777 | 0;
                        l = e;
                        m = e + 1640531535 | 0;
                        do {
                            n = i;
                            o = ($(d[n] | d[n + 1 | 0] << 8 | d[n + 2 | 0] << 16 | d[n + 3 | 0] << 24 | 0, -2048144777) | 0) + j | 0;
                            p = o << 13 | o >>> 19;
                            j = $(p, -1640531535) | 0;
                            o = i + 4 | 0;
                            n = ($(d[o] | d[o + 1 | 0] << 8 | d[o + 2 | 0] << 16 | d[o + 3 | 0] << 24 | 0, -2048144777) | 0) + k | 0;
                            q = n << 13 | n >>> 19;
                            k = $(q, -1640531535) | 0;
                            n = i + 8 | 0;
                            o = ($(d[n] | d[n + 1 | 0] << 8 | d[n + 2 | 0] << 16 | d[n + 3 | 0] << 24 | 0, -2048144777) | 0) + l | 0;
                            r = o << 13 | o >>> 19;
                            l = $(r, -1640531535) | 0;
                            o = i + 12 | 0;
                            n = ($(d[o] | d[o + 1 | 0] << 8 | d[o + 2 | 0] << 16 | d[o + 3 | 0] << 24 | 0, -2048144777) | 0) + m | 0;
                            s = n << 13 | n >>> 19;
                            m = $(s, -1640531535) | 0;
                            i = i + 16 | 0;
                        } while (i >>> 0 <= h >>> 0);
                        t = i;
                        u = (k >>> 25 | ($(q, 465361024) | 0)) + (j >>> 31 | ($(p, 1013904226) | 0)) + (l >>> 20 | ($(r, 2006650880) | 0)) + (m >>> 14 | ($(s, -423362560) | 0)) | 0
                    } else {
                        t = a;
                        u = e + 374761393 | 0
                    }
                    s = u + b | 0;
                    u = a + (b - 4) | 0;
                    if (t >>> 0 > u >>> 0) {
                        v = s;
                        w = t
                    } else {
                        m = s;
                        s = t;
                        while (1) {
                            t = s;
                            r = ($(d[t] | d[t + 1 | 0] << 8 | d[t + 2 | 0] << 16 | d[t + 3 | 0] << 24 | 0, -1028477379) | 0) + m | 0;
                            t = $(r << 17 | r >>> 15, 668265263) | 0;
                            r = s + 4 | 0;
                            if (r >>> 0 > u >>> 0) {
                                v = t;
                                w = r;
                                break
                            } else {
                                m = t;
                                s = r
                            }
                        }
                    }
                    if (w >>> 0 < f >>> 0) {
                        s = v;
                        m = w;
                        while (1) {
                            w = ($(d[m] | 0, 374761393) | 0) + s | 0;
                            u = $(w << 11 | w >>> 21, -1640531535) | 0;
                            w = m + 1 | 0;
                            if (w >>> 0 < f >>> 0) {
                                s = u;
                                m = w
                            } else {
                                x = u;
                                break
                            }
                        }
                    } else {
                        x = v
                    }
                    v = $(x >>> 15 ^ x, -2048144777) | 0;
                    x = $(v >>> 13 ^ v, -1028477379) | 0;
                    y = x >>> 16 ^ x;
                    return y | 0
                } else {
                    if (g) {
                        g = a + (b - 16) | 0;
                        x = e + 1640531535 | 0;
                        v = e;
                        m = e - 2048144777 | 0;
                        s = e + 606290984 | 0;
                        u = a;
                        do {
                            w = ($(c[u >> 2] | 0, -2048144777) | 0) + s | 0;
                            z = w << 13 | w >>> 19;
                            s = $(z, -1640531535) | 0;
                            w = ($(c[u + 4 >> 2] | 0, -2048144777) | 0) + m | 0;
                            A = w << 13 | w >>> 19;
                            m = $(A, -1640531535) | 0;
                            w = ($(c[u + 8 >> 2] | 0, -2048144777) | 0) + v | 0;
                            B = w << 13 | w >>> 19;
                            v = $(B, -1640531535) | 0;
                            w = ($(c[u + 12 >> 2] | 0, -2048144777) | 0) + x | 0;
                            C = w << 13 | w >>> 19;
                            x = $(C, -1640531535) | 0;
                            u = u + 16 | 0;
                        } while (u >>> 0 <= g >>> 0);
                        D = (m >>> 25 | ($(A, 465361024) | 0)) + (s >>> 31 | ($(z, 1013904226) | 0)) + (v >>> 20 | ($(B, 2006650880) | 0)) + (x >>> 14 | ($(C, -423362560) | 0)) | 0;
                        E = u
                    } else {
                        D = e + 374761393 | 0;
                        E = a
                    }
                    e = D + b | 0;
                    D = a + (b - 4) | 0;
                    if (E >>> 0 > D >>> 0) {
                        F = E;
                        G = e
                    } else {
                        b = E;
                        E = e;
                        while (1) {
                            e = ($(c[b >> 2] | 0, -1028477379) | 0) + E | 0;
                            a = $(e << 17 | e >>> 15, 668265263) | 0;
                            e = b + 4 | 0;
                            if (e >>> 0 > D >>> 0) {
                                F = e;
                                G = a;
                                break
                            } else {
                                b = e;
                                E = a
                            }
                        }
                    }
                    if (F >>> 0 < f >>> 0) {
                        E = F;
                        F = G;
                        while (1) {
                            b = ($(d[E] | 0, 374761393) | 0) + F | 0;
                            D = $(b << 11 | b >>> 21, -1640531535) | 0;
                            b = E + 1 | 0;
                            if (b >>> 0 < f >>> 0) {
                                E = b;
                                F = D
                            } else {
                                H = D;
                                break
                            }
                        }
                    } else {
                        H = G
                    }
                    G = $(H >>> 15 ^ H, -2048144777) | 0;
                    H = $(G >>> 13 ^ G, -1028477379) | 0;
                    y = H >>> 16 ^ H;
                    return y | 0
                }
                return 0
            }

            function aP(a) {
                a = a | 0;
                var b = 0,
                    d = 0,
                    e = 0,
                    f = 0,
                    g = 0,
                    h = 0,
                    i = 0,
                    j = 0,
                    k = 0,
                    l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0,
                    t = 0,
                    u = 0,
                    v = 0,
                    w = 0,
                    x = 0,
                    y = 0,
                    z = 0,
                    A = 0,
                    B = 0,
                    C = 0,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0,
                    I = 0,
                    J = 0,
                    K = 0,
                    L = 0,
                    M = 0,
                    N = 0,
                    O = 0,
                    P = 0,
                    Q = 0,
                    R = 0,
                    S = 0,
                    T = 0,
                    U = 0,
                    V = 0,
                    W = 0,
                    X = 0,
                    Y = 0,
                    Z = 0,
                    _ = 0,
                    $ = 0,
                    aa = 0,
                    ab = 0,
                    ac = 0,
                    ad = 0,
                    ae = 0,
                    af = 0,
                    ag = 0,
                    ah = 0,
                    ai = 0,
                    al = 0,
                    ap = 0,
                    aq = 0,
                    ar = 0,
                    as = 0,
                    at = 0,
                    au = 0,
                    av = 0,
                    aw = 0,
                    ax = 0,
                    ay = 0,
                    az = 0,
                    aA = 0,
                    aB = 0,
                    aC = 0,
                    aD = 0,
                    aE = 0,
                    aF = 0,
                    aG = 0,
                    aH = 0,
                    aI = 0,
                    aJ = 0,
                    aK = 0,
                    aL = 0;
                do {
                    if (a >>> 0 < 245 >>> 0) {
                        if (a >>> 0 < 11 >>> 0) {
                            b = 16
                        } else {
                            b = a + 11 & -8
                        }
                        d = b >>> 3;
                        e = c[16] | 0;
                        f = e >>> (d >>> 0);
                        if ((f & 3 | 0) != 0) {
                            g = (f & 1 ^ 1) + d | 0;
                            h = g << 1;
                            i = 104 + (h << 2) | 0;
                            j = 104 + (h + 2 << 2) | 0;
                            h = c[j >> 2] | 0;
                            k = h + 8 | 0;
                            l = c[k >> 2] | 0;
                            do {
                                if ((i | 0) == (l | 0)) {
                                    c[16] = e & ~(1 << g)
                                } else {
                                    if (l >>> 0 < (c[20] | 0) >>> 0) {
                                        an();
                                        return 0
                                    }
                                    m = l + 12 | 0;
                                    if ((c[m >> 2] | 0) == (h | 0)) {
                                        c[m >> 2] = i;
                                        c[j >> 2] = l;
                                        break
                                    } else {
                                        an();
                                        return 0
                                    }
                                }
                            } while (0);
                            l = g << 3;
                            c[h + 4 >> 2] = l | 3;
                            j = h + (l | 4) | 0;
                            c[j >> 2] = c[j >> 2] | 1;
                            n = k;
                            return n | 0
                        }
                        if (b >>> 0 <= (c[18] | 0) >>> 0) {
                            o = b;
                            break
                        }
                        if ((f | 0) != 0) {
                            j = 2 << d;
                            l = f << d & (j | -j);
                            j = (l & -l) - 1 | 0;
                            l = j >>> 12 & 16;
                            i = j >>> (l >>> 0);
                            j = i >>> 5 & 8;
                            m = i >>> (j >>> 0);
                            i = m >>> 2 & 4;
                            p = m >>> (i >>> 0);
                            m = p >>> 1 & 2;
                            q = p >>> (m >>> 0);
                            p = q >>> 1 & 1;
                            r = (j | l | i | m | p) + (q >>> (p >>> 0)) | 0;
                            p = r << 1;
                            q = 104 + (p << 2) | 0;
                            m = 104 + (p + 2 << 2) | 0;
                            p = c[m >> 2] | 0;
                            i = p + 8 | 0;
                            l = c[i >> 2] | 0;
                            do {
                                if ((q | 0) == (l | 0)) {
                                    c[16] = e & ~(1 << r)
                                } else {
                                    if (l >>> 0 < (c[20] | 0) >>> 0) {
                                        an();
                                        return 0
                                    }
                                    j = l + 12 | 0;
                                    if ((c[j >> 2] | 0) == (p | 0)) {
                                        c[j >> 2] = q;
                                        c[m >> 2] = l;
                                        break
                                    } else {
                                        an();
                                        return 0
                                    }
                                }
                            } while (0);
                            l = r << 3;
                            m = l - b | 0;
                            c[p + 4 >> 2] = b | 3;
                            q = p;
                            e = q + b | 0;
                            c[q + (b | 4) >> 2] = m | 1;
                            c[q + l >> 2] = m;
                            l = c[18] | 0;
                            if ((l | 0) != 0) {
                                q = c[21] | 0;
                                d = l >>> 3;
                                l = d << 1;
                                f = 104 + (l << 2) | 0;
                                k = c[16] | 0;
                                h = 1 << d;
                                do {
                                    if ((k & h | 0) == 0) {
                                        c[16] = k | h;
                                        s = f;
                                        t = 104 + (l + 2 << 2) | 0
                                    } else {
                                        d = 104 + (l + 2 << 2) | 0;
                                        g = c[d >> 2] | 0;
                                        if (g >>> 0 >= (c[20] | 0) >>> 0) {
                                            s = g;
                                            t = d;
                                            break
                                        }
                                        an();
                                        return 0
                                    }
                                } while (0);
                                c[t >> 2] = q;
                                c[s + 12 >> 2] = q;
                                c[q + 8 >> 2] = s;
                                c[q + 12 >> 2] = f
                            }
                            c[18] = m;
                            c[21] = e;
                            n = i;
                            return n | 0
                        }
                        l = c[17] | 0;
                        if ((l | 0) == 0) {
                            o = b;
                            break
                        }
                        h = (l & -l) - 1 | 0;
                        l = h >>> 12 & 16;
                        k = h >>> (l >>> 0);
                        h = k >>> 5 & 8;
                        p = k >>> (h >>> 0);
                        k = p >>> 2 & 4;
                        r = p >>> (k >>> 0);
                        p = r >>> 1 & 2;
                        d = r >>> (p >>> 0);
                        r = d >>> 1 & 1;
                        g = c[368 + ((h | l | k | p | r) + (d >>> (r >>> 0)) << 2) >> 2] | 0;
                        r = g;
                        d = g;
                        p = (c[g + 4 >> 2] & -8) - b | 0;
                        while (1) {
                            g = c[r + 16 >> 2] | 0;
                            if ((g | 0) == 0) {
                                k = c[r + 20 >> 2] | 0;
                                if ((k | 0) == 0) {
                                    break
                                } else {
                                    u = k
                                }
                            } else {
                                u = g
                            }
                            g = (c[u + 4 >> 2] & -8) - b | 0;
                            k = g >>> 0 < p >>> 0;
                            r = u;
                            d = k ? u : d;
                            p = k ? g : p
                        }
                        r = d;
                        i = c[20] | 0;
                        if (r >>> 0 < i >>> 0) {
                            an();
                            return 0
                        }
                        e = r + b | 0;
                        m = e;
                        if (r >>> 0 >= e >>> 0) {
                            an();
                            return 0
                        }
                        e = c[d + 24 >> 2] | 0;
                        f = c[d + 12 >> 2] | 0;
                        do {
                            if ((f | 0) == (d | 0)) {
                                q = d + 20 | 0;
                                g = c[q >> 2] | 0;
                                if ((g | 0) == 0) {
                                    k = d + 16 | 0;
                                    l = c[k >> 2] | 0;
                                    if ((l | 0) == 0) {
                                        v = 0;
                                        break
                                    } else {
                                        w = l;
                                        x = k
                                    }
                                } else {
                                    w = g;
                                    x = q
                                }
                                while (1) {
                                    q = w + 20 | 0;
                                    g = c[q >> 2] | 0;
                                    if ((g | 0) != 0) {
                                        w = g;
                                        x = q;
                                        continue
                                    }
                                    q = w + 16 | 0;
                                    g = c[q >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        break
                                    } else {
                                        w = g;
                                        x = q
                                    }
                                }
                                if (x >>> 0 < i >>> 0) {
                                    an();
                                    return 0
                                } else {
                                    c[x >> 2] = 0;
                                    v = w;
                                    break
                                }
                            } else {
                                q = c[d + 8 >> 2] | 0;
                                if (q >>> 0 < i >>> 0) {
                                    an();
                                    return 0
                                }
                                g = q + 12 | 0;
                                if ((c[g >> 2] | 0) != (d | 0)) {
                                    an();
                                    return 0
                                }
                                k = f + 8 | 0;
                                if ((c[k >> 2] | 0) == (d | 0)) {
                                    c[g >> 2] = f;
                                    c[k >> 2] = q;
                                    v = f;
                                    break
                                } else {
                                    an();
                                    return 0
                                }
                            }
                        } while (0);
                        L292: do {
                            if ((e | 0) != 0) {
                                f = d + 28 | 0;
                                i = 368 + (c[f >> 2] << 2) | 0;
                                do {
                                    if ((d | 0) == (c[i >> 2] | 0)) {
                                        c[i >> 2] = v;
                                        if ((v | 0) != 0) {
                                            break
                                        }
                                        c[17] = c[17] & ~(1 << c[f >> 2]);
                                        break L292
                                    } else {
                                        if (e >>> 0 < (c[20] | 0) >>> 0) {
                                            an();
                                            return 0
                                        }
                                        q = e + 16 | 0;
                                        if ((c[q >> 2] | 0) == (d | 0)) {
                                            c[q >> 2] = v
                                        } else {
                                            c[e + 20 >> 2] = v
                                        }
                                        if ((v | 0) == 0) {
                                            break L292
                                        }
                                    }
                                } while (0);
                                if (v >>> 0 < (c[20] | 0) >>> 0) {
                                    an();
                                    return 0
                                }
                                c[v + 24 >> 2] = e;
                                f = c[d + 16 >> 2] | 0;
                                do {
                                    if ((f | 0) != 0) {
                                        if (f >>> 0 < (c[20] | 0) >>> 0) {
                                            an();
                                            return 0
                                        } else {
                                            c[v + 16 >> 2] = f;
                                            c[f + 24 >> 2] = v;
                                            break
                                        }
                                    }
                                } while (0);
                                f = c[d + 20 >> 2] | 0;
                                if ((f | 0) == 0) {
                                    break
                                }
                                if (f >>> 0 < (c[20] | 0) >>> 0) {
                                    an();
                                    return 0
                                } else {
                                    c[v + 20 >> 2] = f;
                                    c[f + 24 >> 2] = v;
                                    break
                                }
                            }
                        } while (0);
                        if (p >>> 0 < 16 >>> 0) {
                            e = p + b | 0;
                            c[d + 4 >> 2] = e | 3;
                            f = r + (e + 4) | 0;
                            c[f >> 2] = c[f >> 2] | 1
                        } else {
                            c[d + 4 >> 2] = b | 3;
                            c[r + (b | 4) >> 2] = p | 1;
                            c[r + (p + b) >> 2] = p;
                            f = c[18] | 0;
                            if ((f | 0) != 0) {
                                e = c[21] | 0;
                                i = f >>> 3;
                                f = i << 1;
                                q = 104 + (f << 2) | 0;
                                k = c[16] | 0;
                                g = 1 << i;
                                do {
                                    if ((k & g | 0) == 0) {
                                        c[16] = k | g;
                                        y = q;
                                        z = 104 + (f + 2 << 2) | 0
                                    } else {
                                        i = 104 + (f + 2 << 2) | 0;
                                        l = c[i >> 2] | 0;
                                        if (l >>> 0 >= (c[20] | 0) >>> 0) {
                                            y = l;
                                            z = i;
                                            break
                                        }
                                        an();
                                        return 0
                                    }
                                } while (0);
                                c[z >> 2] = e;
                                c[y + 12 >> 2] = e;
                                c[e + 8 >> 2] = y;
                                c[e + 12 >> 2] = q
                            }
                            c[18] = p;
                            c[21] = m
                        }
                        f = d + 8 | 0;
                        if ((f | 0) == 0) {
                            o = b;
                            break
                        } else {
                            n = f
                        }
                        return n | 0
                    } else {
                        if (a >>> 0 > 4294967231 >>> 0) {
                            o = -1;
                            break
                        }
                        f = a + 11 | 0;
                        g = f & -8;
                        k = c[17] | 0;
                        if ((k | 0) == 0) {
                            o = g;
                            break
                        }
                        r = -g | 0;
                        i = f >>> 8;
                        do {
                            if ((i | 0) == 0) {
                                A = 0
                            } else {
                                if (g >>> 0 > 16777215 >>> 0) {
                                    A = 31;
                                    break
                                }
                                f = (i + 1048320 | 0) >>> 16 & 8;
                                l = i << f;
                                h = (l + 520192 | 0) >>> 16 & 4;
                                j = l << h;
                                l = (j + 245760 | 0) >>> 16 & 2;
                                B = 14 - (h | f | l) + (j << l >>> 15) | 0;
                                A = g >>> ((B + 7 | 0) >>> 0) & 1 | B << 1
                            }
                        } while (0);
                        i = c[368 + (A << 2) >> 2] | 0;
                        L340: do {
                            if ((i | 0) == 0) {
                                C = 0;
                                D = r;
                                E = 0
                            } else {
                                if ((A | 0) == 31) {
                                    F = 0
                                } else {
                                    F = 25 - (A >>> 1) | 0
                                }
                                d = 0;
                                m = r;
                                p = i;
                                q = g << F;
                                e = 0;
                                while (1) {
                                    B = c[p + 4 >> 2] & -8;
                                    l = B - g | 0;
                                    if (l >>> 0 < m >>> 0) {
                                        if ((B | 0) == (g | 0)) {
                                            C = p;
                                            D = l;
                                            E = p;
                                            break L340
                                        } else {
                                            G = p;
                                            H = l
                                        }
                                    } else {
                                        G = d;
                                        H = m
                                    }
                                    l = c[p + 20 >> 2] | 0;
                                    B = c[p + 16 + (q >>> 31 << 2) >> 2] | 0;
                                    j = (l | 0) == 0 | (l | 0) == (B | 0) ? e : l;
                                    if ((B | 0) == 0) {
                                        C = G;
                                        D = H;
                                        E = j;
                                        break
                                    } else {
                                        d = G;
                                        m = H;
                                        p = B;
                                        q = q << 1;
                                        e = j
                                    }
                                }
                            }
                        } while (0);
                        if ((E | 0) == 0 & (C | 0) == 0) {
                            i = 2 << A;
                            r = k & (i | -i);
                            if ((r | 0) == 0) {
                                o = g;
                                break
                            }
                            i = (r & -r) - 1 | 0;
                            r = i >>> 12 & 16;
                            e = i >>> (r >>> 0);
                            i = e >>> 5 & 8;
                            q = e >>> (i >>> 0);
                            e = q >>> 2 & 4;
                            p = q >>> (e >>> 0);
                            q = p >>> 1 & 2;
                            m = p >>> (q >>> 0);
                            p = m >>> 1 & 1;
                            I = c[368 + ((i | r | e | q | p) + (m >>> (p >>> 0)) << 2) >> 2] | 0
                        } else {
                            I = E
                        }
                        if ((I | 0) == 0) {
                            J = D;
                            K = C
                        } else {
                            p = I;
                            m = D;
                            q = C;
                            while (1) {
                                e = (c[p + 4 >> 2] & -8) - g | 0;
                                r = e >>> 0 < m >>> 0;
                                i = r ? e : m;
                                e = r ? p : q;
                                r = c[p + 16 >> 2] | 0;
                                if ((r | 0) != 0) {
                                    p = r;
                                    m = i;
                                    q = e;
                                    continue
                                }
                                r = c[p + 20 >> 2] | 0;
                                if ((r | 0) == 0) {
                                    J = i;
                                    K = e;
                                    break
                                } else {
                                    p = r;
                                    m = i;
                                    q = e
                                }
                            }
                        }
                        if ((K | 0) == 0) {
                            o = g;
                            break
                        }
                        if (J >>> 0 >= ((c[18] | 0) - g | 0) >>> 0) {
                            o = g;
                            break
                        }
                        q = K;
                        m = c[20] | 0;
                        if (q >>> 0 < m >>> 0) {
                            an();
                            return 0
                        }
                        p = q + g | 0;
                        k = p;
                        if (q >>> 0 >= p >>> 0) {
                            an();
                            return 0
                        }
                        e = c[K + 24 >> 2] | 0;
                        i = c[K + 12 >> 2] | 0;
                        do {
                            if ((i | 0) == (K | 0)) {
                                r = K + 20 | 0;
                                d = c[r >> 2] | 0;
                                if ((d | 0) == 0) {
                                    j = K + 16 | 0;
                                    B = c[j >> 2] | 0;
                                    if ((B | 0) == 0) {
                                        L = 0;
                                        break
                                    } else {
                                        M = B;
                                        N = j
                                    }
                                } else {
                                    M = d;
                                    N = r
                                }
                                while (1) {
                                    r = M + 20 | 0;
                                    d = c[r >> 2] | 0;
                                    if ((d | 0) != 0) {
                                        M = d;
                                        N = r;
                                        continue
                                    }
                                    r = M + 16 | 0;
                                    d = c[r >> 2] | 0;
                                    if ((d | 0) == 0) {
                                        break
                                    } else {
                                        M = d;
                                        N = r
                                    }
                                }
                                if (N >>> 0 < m >>> 0) {
                                    an();
                                    return 0
                                } else {
                                    c[N >> 2] = 0;
                                    L = M;
                                    break
                                }
                            } else {
                                r = c[K + 8 >> 2] | 0;
                                if (r >>> 0 < m >>> 0) {
                                    an();
                                    return 0
                                }
                                d = r + 12 | 0;
                                if ((c[d >> 2] | 0) != (K | 0)) {
                                    an();
                                    return 0
                                }
                                j = i + 8 | 0;
                                if ((c[j >> 2] | 0) == (K | 0)) {
                                    c[d >> 2] = i;
                                    c[j >> 2] = r;
                                    L = i;
                                    break
                                } else {
                                    an();
                                    return 0
                                }
                            }
                        } while (0);
                        L390: do {
                            if ((e | 0) != 0) {
                                i = K + 28 | 0;
                                m = 368 + (c[i >> 2] << 2) | 0;
                                do {
                                    if ((K | 0) == (c[m >> 2] | 0)) {
                                        c[m >> 2] = L;
                                        if ((L | 0) != 0) {
                                            break
                                        }
                                        c[17] = c[17] & ~(1 << c[i >> 2]);
                                        break L390
                                    } else {
                                        if (e >>> 0 < (c[20] | 0) >>> 0) {
                                            an();
                                            return 0
                                        }
                                        r = e + 16 | 0;
                                        if ((c[r >> 2] | 0) == (K | 0)) {
                                            c[r >> 2] = L
                                        } else {
                                            c[e + 20 >> 2] = L
                                        }
                                        if ((L | 0) == 0) {
                                            break L390
                                        }
                                    }
                                } while (0);
                                if (L >>> 0 < (c[20] | 0) >>> 0) {
                                    an();
                                    return 0
                                }
                                c[L + 24 >> 2] = e;
                                i = c[K + 16 >> 2] | 0;
                                do {
                                    if ((i | 0) != 0) {
                                        if (i >>> 0 < (c[20] | 0) >>> 0) {
                                            an();
                                            return 0
                                        } else {
                                            c[L + 16 >> 2] = i;
                                            c[i + 24 >> 2] = L;
                                            break
                                        }
                                    }
                                } while (0);
                                i = c[K + 20 >> 2] | 0;
                                if ((i | 0) == 0) {
                                    break
                                }
                                if (i >>> 0 < (c[20] | 0) >>> 0) {
                                    an();
                                    return 0
                                } else {
                                    c[L + 20 >> 2] = i;
                                    c[i + 24 >> 2] = L;
                                    break
                                }
                            }
                        } while (0);
                        do {
                            if (J >>> 0 < 16 >>> 0) {
                                e = J + g | 0;
                                c[K + 4 >> 2] = e | 3;
                                i = q + (e + 4) | 0;
                                c[i >> 2] = c[i >> 2] | 1
                            } else {
                                c[K + 4 >> 2] = g | 3;
                                c[q + (g | 4) >> 2] = J | 1;
                                c[q + (J + g) >> 2] = J;
                                i = J >>> 3;
                                if (J >>> 0 < 256 >>> 0) {
                                    e = i << 1;
                                    m = 104 + (e << 2) | 0;
                                    r = c[16] | 0;
                                    j = 1 << i;
                                    do {
                                        if ((r & j | 0) == 0) {
                                            c[16] = r | j;
                                            O = m;
                                            P = 104 + (e + 2 << 2) | 0
                                        } else {
                                            i = 104 + (e + 2 << 2) | 0;
                                            d = c[i >> 2] | 0;
                                            if (d >>> 0 >= (c[20] | 0) >>> 0) {
                                                O = d;
                                                P = i;
                                                break
                                            }
                                            an();
                                            return 0
                                        }
                                    } while (0);
                                    c[P >> 2] = k;
                                    c[O + 12 >> 2] = k;
                                    c[q + (g + 8) >> 2] = O;
                                    c[q + (g + 12) >> 2] = m;
                                    break
                                }
                                e = p;
                                j = J >>> 8;
                                do {
                                    if ((j | 0) == 0) {
                                        Q = 0
                                    } else {
                                        if (J >>> 0 > 16777215 >>> 0) {
                                            Q = 31;
                                            break
                                        }
                                        r = (j + 1048320 | 0) >>> 16 & 8;
                                        i = j << r;
                                        d = (i + 520192 | 0) >>> 16 & 4;
                                        B = i << d;
                                        i = (B + 245760 | 0) >>> 16 & 2;
                                        l = 14 - (d | r | i) + (B << i >>> 15) | 0;
                                        Q = J >>> ((l + 7 | 0) >>> 0) & 1 | l << 1
                                    }
                                } while (0);
                                j = 368 + (Q << 2) | 0;
                                c[q + (g + 28) >> 2] = Q;
                                c[q + (g + 20) >> 2] = 0;
                                c[q + (g + 16) >> 2] = 0;
                                m = c[17] | 0;
                                l = 1 << Q;
                                if ((m & l | 0) == 0) {
                                    c[17] = m | l;
                                    c[j >> 2] = e;
                                    c[q + (g + 24) >> 2] = j;
                                    c[q + (g + 12) >> 2] = e;
                                    c[q + (g + 8) >> 2] = e;
                                    break
                                }
                                if ((Q | 0) == 31) {
                                    R = 0
                                } else {
                                    R = 25 - (Q >>> 1) | 0
                                }
                                l = J << R;
                                m = c[j >> 2] | 0;
                                while (1) {
                                    if ((c[m + 4 >> 2] & -8 | 0) == (J | 0)) {
                                        break
                                    }
                                    S = m + 16 + (l >>> 31 << 2) | 0;
                                    j = c[S >> 2] | 0;
                                    if ((j | 0) == 0) {
                                        T = 302;
                                        break
                                    } else {
                                        l = l << 1;
                                        m = j
                                    }
                                }
                                if ((T | 0) == 302) {
                                    if (S >>> 0 < (c[20] | 0) >>> 0) {
                                        an();
                                        return 0
                                    } else {
                                        c[S >> 2] = e;
                                        c[q + (g + 24) >> 2] = m;
                                        c[q + (g + 12) >> 2] = e;
                                        c[q + (g + 8) >> 2] = e;
                                        break
                                    }
                                }
                                l = m + 8 | 0;
                                j = c[l >> 2] | 0;
                                i = c[20] | 0;
                                if (m >>> 0 < i >>> 0) {
                                    an();
                                    return 0
                                }
                                if (j >>> 0 < i >>> 0) {
                                    an();
                                    return 0
                                } else {
                                    c[j + 12 >> 2] = e;
                                    c[l >> 2] = e;
                                    c[q + (g + 8) >> 2] = j;
                                    c[q + (g + 12) >> 2] = m;
                                    c[q + (g + 24) >> 2] = 0;
                                    break
                                }
                            }
                        } while (0);
                        q = K + 8 | 0;
                        if ((q | 0) == 0) {
                            o = g;
                            break
                        } else {
                            n = q
                        }
                        return n | 0
                    }
                } while (0);
                K = c[18] | 0;
                if (o >>> 0 <= K >>> 0) {
                    S = K - o | 0;
                    J = c[21] | 0;
                    if (S >>> 0 > 15 >>> 0) {
                        R = J;
                        c[21] = R + o;
                        c[18] = S;
                        c[R + (o + 4) >> 2] = S | 1;
                        c[R + K >> 2] = S;
                        c[J + 4 >> 2] = o | 3
                    } else {
                        c[18] = 0;
                        c[21] = 0;
                        c[J + 4 >> 2] = K | 3;
                        S = J + (K + 4) | 0;
                        c[S >> 2] = c[S >> 2] | 1
                    }
                    n = J + 8 | 0;
                    return n | 0
                }
                J = c[19] | 0;
                if (o >>> 0 < J >>> 0) {
                    S = J - o | 0;
                    c[19] = S;
                    J = c[22] | 0;
                    K = J;
                    c[22] = K + o;
                    c[K + (o + 4) >> 2] = S | 1;
                    c[J + 4 >> 2] = o | 3;
                    n = J + 8 | 0;
                    return n | 0
                }
                do {
                    if ((c[10] | 0) == 0) {
                        J = aj(30) | 0;
                        if ((J - 1 & J | 0) == 0) {
                            c[12] = J;
                            c[11] = J;
                            c[13] = -1;
                            c[14] = -1;
                            c[15] = 0;
                            c[127] = 0;
                            c[10] = (ao(0) | 0) & -16 ^ 1431655768;
                            break
                        } else {
                            an();
                            return 0
                        }
                    }
                } while (0);
                J = o + 48 | 0;
                S = c[12] | 0;
                K = o + 47 | 0;
                R = S + K | 0;
                Q = -S | 0;
                S = R & Q;
                if (S >>> 0 <= o >>> 0) {
                    n = 0;
                    return n | 0
                }
                O = c[126] | 0;
                do {
                    if ((O | 0) != 0) {
                        P = c[124] | 0;
                        L = P + S | 0;
                        if (L >>> 0 <= P >>> 0 | L >>> 0 > O >>> 0) {
                            n = 0
                        } else {
                            break
                        }
                        return n | 0
                    }
                } while (0);
                L482: do {
                    if ((c[127] & 4 | 0) == 0) {
                        O = c[22] | 0;
                        L484: do {
                            if ((O | 0) == 0) {
                                T = 332
                            } else {
                                L = O;
                                P = 512;
                                while (1) {
                                    U = P | 0;
                                    M = c[U >> 2] | 0;
                                    if (M >>> 0 <= L >>> 0) {
                                        V = P + 4 | 0;
                                        if ((M + (c[V >> 2] | 0) | 0) >>> 0 > L >>> 0) {
                                            break
                                        }
                                    }
                                    M = c[P + 8 >> 2] | 0;
                                    if ((M | 0) == 0) {
                                        T = 332;
                                        break L484
                                    } else {
                                        P = M
                                    }
                                }
                                if ((P | 0) == 0) {
                                    T = 332;
                                    break
                                }
                                L = R - (c[19] | 0) & Q;
                                if (L >>> 0 >= 2147483647 >>> 0) {
                                    W = 0;
                                    break
                                }
                                m = ak(L | 0) | 0;
                                e = (m | 0) == ((c[U >> 2] | 0) + (c[V >> 2] | 0) | 0);
                                X = e ? m : -1;
                                Y = e ? L : 0;
                                Z = m;
                                _ = L;
                                T = 341
                            }
                        } while (0);
                        do {
                            if ((T | 0) == 332) {
                                O = ak(0) | 0;
                                if ((O | 0) == -1) {
                                    W = 0;
                                    break
                                }
                                g = O;
                                L = c[11] | 0;
                                m = L - 1 | 0;
                                if ((m & g | 0) == 0) {
                                    $ = S
                                } else {
                                    $ = S - g + (m + g & -L) | 0
                                }
                                L = c[124] | 0;
                                g = L + $ | 0;
                                if (!($ >>> 0 > o >>> 0 & $ >>> 0 < 2147483647 >>> 0)) {
                                    W = 0;
                                    break
                                }
                                m = c[126] | 0;
                                if ((m | 0) != 0) {
                                    if (g >>> 0 <= L >>> 0 | g >>> 0 > m >>> 0) {
                                        W = 0;
                                        break
                                    }
                                }
                                m = ak($ | 0) | 0;
                                g = (m | 0) == (O | 0);
                                X = g ? O : -1;
                                Y = g ? $ : 0;
                                Z = m;
                                _ = $;
                                T = 341
                            }
                        } while (0);
                        L504: do {
                            if ((T | 0) == 341) {
                                m = -_ | 0;
                                if ((X | 0) != -1) {
                                    aa = Y;
                                    ab = X;
                                    T = 352;
                                    break L482
                                }
                                do {
                                    if ((Z | 0) != -1 & _ >>> 0 < 2147483647 >>> 0 & _ >>> 0 < J >>> 0) {
                                        g = c[12] | 0;
                                        O = K - _ + g & -g;
                                        if (O >>> 0 >= 2147483647 >>> 0) {
                                            ac = _;
                                            break
                                        }
                                        if ((ak(O | 0) | 0) == -1) {
                                            ak(m | 0) | 0;
                                            W = Y;
                                            break L504
                                        } else {
                                            ac = O + _ | 0;
                                            break
                                        }
                                    } else {
                                        ac = _
                                    }
                                } while (0);
                                if ((Z | 0) == -1) {
                                    W = Y
                                } else {
                                    aa = ac;
                                    ab = Z;
                                    T = 352;
                                    break L482
                                }
                            }
                        } while (0);
                        c[127] = c[127] | 4;
                        ad = W;
                        T = 349
                    } else {
                        ad = 0;
                        T = 349
                    }
                } while (0);
                do {
                    if ((T | 0) == 349) {
                        if (S >>> 0 >= 2147483647 >>> 0) {
                            break
                        }
                        W = ak(S | 0) | 0;
                        Z = ak(0) | 0;
                        if (!((Z | 0) != -1 & (W | 0) != -1 & W >>> 0 < Z >>> 0)) {
                            break
                        }
                        ac = Z - W | 0;
                        Z = ac >>> 0 > (o + 40 | 0) >>> 0;
                        Y = Z ? W : -1;
                        if ((Y | 0) != -1) {
                            aa = Z ? ac : ad;
                            ab = Y;
                            T = 352
                        }
                    }
                } while (0);
                do {
                    if ((T | 0) == 352) {
                        ad = (c[124] | 0) + aa | 0;
                        c[124] = ad;
                        if (ad >>> 0 > (c[125] | 0) >>> 0) {
                            c[125] = ad
                        }
                        ad = c[22] | 0;
                        L524: do {
                            if ((ad | 0) == 0) {
                                S = c[20] | 0;
                                if ((S | 0) == 0 | ab >>> 0 < S >>> 0) {
                                    c[20] = ab
                                }
                                c[128] = ab;
                                c[129] = aa;
                                c[131] = 0;
                                c[25] = c[10];
                                c[24] = -1;
                                S = 0;
                                do {
                                    Y = S << 1;
                                    ac = 104 + (Y << 2) | 0;
                                    c[104 + (Y + 3 << 2) >> 2] = ac;
                                    c[104 + (Y + 2 << 2) >> 2] = ac;
                                    S = S + 1 | 0;
                                } while (S >>> 0 < 32 >>> 0);
                                S = ab + 8 | 0;
                                if ((S & 7 | 0) == 0) {
                                    ae = 0
                                } else {
                                    ae = -S & 7
                                }
                                S = aa - 40 - ae | 0;
                                c[22] = ab + ae;
                                c[19] = S;
                                c[ab + (ae + 4) >> 2] = S | 1;
                                c[ab + (aa - 36) >> 2] = 40;
                                c[23] = c[14]
                            } else {
                                S = 512;
                                while (1) {
                                    af = c[S >> 2] | 0;
                                    ag = S + 4 | 0;
                                    ah = c[ag >> 2] | 0;
                                    if ((ab | 0) == (af + ah | 0)) {
                                        T = 364;
                                        break
                                    }
                                    ac = c[S + 8 >> 2] | 0;
                                    if ((ac | 0) == 0) {
                                        break
                                    } else {
                                        S = ac
                                    }
                                }
                                do {
                                    if ((T | 0) == 364) {
                                        if ((c[S + 12 >> 2] & 8 | 0) != 0) {
                                            break
                                        }
                                        ac = ad;
                                        if (!(ac >>> 0 >= af >>> 0 & ac >>> 0 < ab >>> 0)) {
                                            break
                                        }
                                        c[ag >> 2] = ah + aa;
                                        ac = c[22] | 0;
                                        Y = (c[19] | 0) + aa | 0;
                                        Z = ac;
                                        W = ac + 8 | 0;
                                        if ((W & 7 | 0) == 0) {
                                            ai = 0
                                        } else {
                                            ai = -W & 7
                                        }
                                        W = Y - ai | 0;
                                        c[22] = Z + ai;
                                        c[19] = W;
                                        c[Z + (ai + 4) >> 2] = W | 1;
                                        c[Z + (Y + 4) >> 2] = 40;
                                        c[23] = c[14];
                                        break L524
                                    }
                                } while (0);
                                if (ab >>> 0 < (c[20] | 0) >>> 0) {
                                    c[20] = ab
                                }
                                S = ab + aa | 0;
                                Y = 512;
                                while (1) {
                                    al = Y | 0;
                                    if ((c[al >> 2] | 0) == (S | 0)) {
                                        T = 374;
                                        break
                                    }
                                    Z = c[Y + 8 >> 2] | 0;
                                    if ((Z | 0) == 0) {
                                        break
                                    } else {
                                        Y = Z
                                    }
                                }
                                do {
                                    if ((T | 0) == 374) {
                                        if ((c[Y + 12 >> 2] & 8 | 0) != 0) {
                                            break
                                        }
                                        c[al >> 2] = ab;
                                        S = Y + 4 | 0;
                                        c[S >> 2] = (c[S >> 2] | 0) + aa;
                                        S = ab + 8 | 0;
                                        if ((S & 7 | 0) == 0) {
                                            ap = 0
                                        } else {
                                            ap = -S & 7
                                        }
                                        S = ab + (aa + 8) | 0;
                                        if ((S & 7 | 0) == 0) {
                                            aq = 0
                                        } else {
                                            aq = -S & 7
                                        }
                                        S = ab + (aq + aa) | 0;
                                        Z = S;
                                        W = ap + o | 0;
                                        ac = ab + W | 0;
                                        _ = ac;
                                        K = S - (ab + ap) - o | 0;
                                        c[ab + (ap + 4) >> 2] = o | 3;
                                        do {
                                            if ((Z | 0) == (c[22] | 0)) {
                                                J = (c[19] | 0) + K | 0;
                                                c[19] = J;
                                                c[22] = _;
                                                c[ab + (W + 4) >> 2] = J | 1
                                            } else {
                                                if ((Z | 0) == (c[21] | 0)) {
                                                    J = (c[18] | 0) + K | 0;
                                                    c[18] = J;
                                                    c[21] = _;
                                                    c[ab + (W + 4) >> 2] = J | 1;
                                                    c[ab + (J + W) >> 2] = J;
                                                    break
                                                }
                                                J = aa + 4 | 0;
                                                X = c[ab + (J + aq) >> 2] | 0;
                                                if ((X & 3 | 0) == 1) {
                                                    $ = X & -8;
                                                    V = X >>> 3;
                                                    L569: do {
                                                        if (X >>> 0 < 256 >>> 0) {
                                                            U = c[ab + ((aq | 8) + aa) >> 2] | 0;
                                                            Q = c[ab + (aa + 12 + aq) >> 2] | 0;
                                                            R = 104 + (V << 1 << 2) | 0;
                                                            do {
                                                                if ((U | 0) != (R | 0)) {
                                                                    if (U >>> 0 < (c[20] | 0) >>> 0) {
                                                                        an();
                                                                        return 0
                                                                    }
                                                                    if ((c[U + 12 >> 2] | 0) == (Z | 0)) {
                                                                        break
                                                                    }
                                                                    an();
                                                                    return 0
                                                                }
                                                            } while (0);
                                                            if ((Q | 0) == (U | 0)) {
                                                                c[16] = c[16] & ~(1 << V);
                                                                break
                                                            }
                                                            do {
                                                                if ((Q | 0) == (R | 0)) {
                                                                    ar = Q + 8 | 0
                                                                } else {
                                                                    if (Q >>> 0 < (c[20] | 0) >>> 0) {
                                                                        an();
                                                                        return 0
                                                                    }
                                                                    m = Q + 8 | 0;
                                                                    if ((c[m >> 2] | 0) == (Z | 0)) {
                                                                        ar = m;
                                                                        break
                                                                    }
                                                                    an();
                                                                    return 0
                                                                }
                                                            } while (0);
                                                            c[U + 12 >> 2] = Q;
                                                            c[ar >> 2] = U
                                                        } else {
                                                            R = S;
                                                            m = c[ab + ((aq | 24) + aa) >> 2] | 0;
                                                            P = c[ab + (aa + 12 + aq) >> 2] | 0;
                                                            do {
                                                                if ((P | 0) == (R | 0)) {
                                                                    O = aq | 16;
                                                                    g = ab + (J + O) | 0;
                                                                    L = c[g >> 2] | 0;
                                                                    if ((L | 0) == 0) {
                                                                        e = ab + (O + aa) | 0;
                                                                        O = c[e >> 2] | 0;
                                                                        if ((O | 0) == 0) {
                                                                            as = 0;
                                                                            break
                                                                        } else {
                                                                            at = O;
                                                                            au = e
                                                                        }
                                                                    } else {
                                                                        at = L;
                                                                        au = g
                                                                    }
                                                                    while (1) {
                                                                        g = at + 20 | 0;
                                                                        L = c[g >> 2] | 0;
                                                                        if ((L | 0) != 0) {
                                                                            at = L;
                                                                            au = g;
                                                                            continue
                                                                        }
                                                                        g = at + 16 | 0;
                                                                        L = c[g >> 2] | 0;
                                                                        if ((L | 0) == 0) {
                                                                            break
                                                                        } else {
                                                                            at = L;
                                                                            au = g
                                                                        }
                                                                    }
                                                                    if (au >>> 0 < (c[20] | 0) >>> 0) {
                                                                        an();
                                                                        return 0
                                                                    } else {
                                                                        c[au >> 2] = 0;
                                                                        as = at;
                                                                        break
                                                                    }
                                                                } else {
                                                                    g = c[ab + ((aq | 8) + aa) >> 2] | 0;
                                                                    if (g >>> 0 < (c[20] | 0) >>> 0) {
                                                                        an();
                                                                        return 0
                                                                    }
                                                                    L = g + 12 | 0;
                                                                    if ((c[L >> 2] | 0) != (R | 0)) {
                                                                        an();
                                                                        return 0
                                                                    }
                                                                    e = P + 8 | 0;
                                                                    if ((c[e >> 2] | 0) == (R | 0)) {
                                                                        c[L >> 2] = P;
                                                                        c[e >> 2] = g;
                                                                        as = P;
                                                                        break
                                                                    } else {
                                                                        an();
                                                                        return 0
                                                                    }
                                                                }
                                                            } while (0);
                                                            if ((m | 0) == 0) {
                                                                break
                                                            }
                                                            P = ab + (aa + 28 + aq) | 0;
                                                            U = 368 + (c[P >> 2] << 2) | 0;
                                                            do {
                                                                if ((R | 0) == (c[U >> 2] | 0)) {
                                                                    c[U >> 2] = as;
                                                                    if ((as | 0) != 0) {
                                                                        break
                                                                    }
                                                                    c[17] = c[17] & ~(1 << c[P >> 2]);
                                                                    break L569
                                                                } else {
                                                                    if (m >>> 0 < (c[20] | 0) >>> 0) {
                                                                        an();
                                                                        return 0
                                                                    }
                                                                    Q = m + 16 | 0;
                                                                    if ((c[Q >> 2] | 0) == (R | 0)) {
                                                                        c[Q >> 2] = as
                                                                    } else {
                                                                        c[m + 20 >> 2] = as
                                                                    }
                                                                    if ((as | 0) == 0) {
                                                                        break L569
                                                                    }
                                                                }
                                                            } while (0);
                                                            if (as >>> 0 < (c[20] | 0) >>> 0) {
                                                                an();
                                                                return 0
                                                            }
                                                            c[as + 24 >> 2] = m;
                                                            R = aq | 16;
                                                            P = c[ab + (R + aa) >> 2] | 0;
                                                            do {
                                                                if ((P | 0) != 0) {
                                                                    if (P >>> 0 < (c[20] | 0) >>> 0) {
                                                                        an();
                                                                        return 0
                                                                    } else {
                                                                        c[as + 16 >> 2] = P;
                                                                        c[P + 24 >> 2] = as;
                                                                        break
                                                                    }
                                                                }
                                                            } while (0);
                                                            P = c[ab + (J + R) >> 2] | 0;
                                                            if ((P | 0) == 0) {
                                                                break
                                                            }
                                                            if (P >>> 0 < (c[20] | 0) >>> 0) {
                                                                an();
                                                                return 0
                                                            } else {
                                                                c[as + 20 >> 2] = P;
                                                                c[P + 24 >> 2] = as;
                                                                break
                                                            }
                                                        }
                                                    } while (0);
                                                    av = ab + (($ | aq) + aa) | 0;
                                                    aw = $ + K | 0
                                                } else {
                                                    av = Z;
                                                    aw = K
                                                }
                                                J = av + 4 | 0;
                                                c[J >> 2] = c[J >> 2] & -2;
                                                c[ab + (W + 4) >> 2] = aw | 1;
                                                c[ab + (aw + W) >> 2] = aw;
                                                J = aw >>> 3;
                                                if (aw >>> 0 < 256 >>> 0) {
                                                    V = J << 1;
                                                    X = 104 + (V << 2) | 0;
                                                    P = c[16] | 0;
                                                    m = 1 << J;
                                                    do {
                                                        if ((P & m | 0) == 0) {
                                                            c[16] = P | m;
                                                            ax = X;
                                                            ay = 104 + (V + 2 << 2) | 0
                                                        } else {
                                                            J = 104 + (V + 2 << 2) | 0;
                                                            U = c[J >> 2] | 0;
                                                            if (U >>> 0 >= (c[20] | 0) >>> 0) {
                                                                ax = U;
                                                                ay = J;
                                                                break
                                                            }
                                                            an();
                                                            return 0
                                                        }
                                                    } while (0);
                                                    c[ay >> 2] = _;
                                                    c[ax + 12 >> 2] = _;
                                                    c[ab + (W + 8) >> 2] = ax;
                                                    c[ab + (W + 12) >> 2] = X;
                                                    break
                                                }
                                                V = ac;
                                                m = aw >>> 8;
                                                do {
                                                    if ((m | 0) == 0) {
                                                        az = 0
                                                    } else {
                                                        if (aw >>> 0 > 16777215 >>> 0) {
                                                            az = 31;
                                                            break
                                                        }
                                                        P = (m + 1048320 | 0) >>> 16 & 8;
                                                        $ = m << P;
                                                        J = ($ + 520192 | 0) >>> 16 & 4;
                                                        U = $ << J;
                                                        $ = (U + 245760 | 0) >>> 16 & 2;
                                                        Q = 14 - (J | P | $) + (U << $ >>> 15) | 0;
                                                        az = aw >>> ((Q + 7 | 0) >>> 0) & 1 | Q << 1
                                                    }
                                                } while (0);
                                                m = 368 + (az << 2) | 0;
                                                c[ab + (W + 28) >> 2] = az;
                                                c[ab + (W + 20) >> 2] = 0;
                                                c[ab + (W + 16) >> 2] = 0;
                                                X = c[17] | 0;
                                                Q = 1 << az;
                                                if ((X & Q | 0) == 0) {
                                                    c[17] = X | Q;
                                                    c[m >> 2] = V;
                                                    c[ab + (W + 24) >> 2] = m;
                                                    c[ab + (W + 12) >> 2] = V;
                                                    c[ab + (W + 8) >> 2] = V;
                                                    break
                                                }
                                                if ((az | 0) == 31) {
                                                    aA = 0
                                                } else {
                                                    aA = 25 - (az >>> 1) | 0
                                                }
                                                Q = aw << aA;
                                                X = c[m >> 2] | 0;
                                                while (1) {
                                                    if ((c[X + 4 >> 2] & -8 | 0) == (aw | 0)) {
                                                        break
                                                    }
                                                    aB = X + 16 + (Q >>> 31 << 2) | 0;
                                                    m = c[aB >> 2] | 0;
                                                    if ((m | 0) == 0) {
                                                        T = 447;
                                                        break
                                                    } else {
                                                        Q = Q << 1;
                                                        X = m
                                                    }
                                                }
                                                if ((T | 0) == 447) {
                                                    if (aB >>> 0 < (c[20] | 0) >>> 0) {
                                                        an();
                                                        return 0
                                                    } else {
                                                        c[aB >> 2] = V;
                                                        c[ab + (W + 24) >> 2] = X;
                                                        c[ab + (W + 12) >> 2] = V;
                                                        c[ab + (W + 8) >> 2] = V;
                                                        break
                                                    }
                                                }
                                                Q = X + 8 | 0;
                                                m = c[Q >> 2] | 0;
                                                $ = c[20] | 0;
                                                if (X >>> 0 < $ >>> 0) {
                                                    an();
                                                    return 0
                                                }
                                                if (m >>> 0 < $ >>> 0) {
                                                    an();
                                                    return 0
                                                } else {
                                                    c[m + 12 >> 2] = V;
                                                    c[Q >> 2] = V;
                                                    c[ab + (W + 8) >> 2] = m;
                                                    c[ab + (W + 12) >> 2] = X;
                                                    c[ab + (W + 24) >> 2] = 0;
                                                    break
                                                }
                                            }
                                        } while (0);
                                        n = ab + (ap | 8) | 0;
                                        return n | 0
                                    }
                                } while (0);
                                Y = ad;
                                W = 512;
                                while (1) {
                                    aC = c[W >> 2] | 0;
                                    if (aC >>> 0 <= Y >>> 0) {
                                        aD = c[W + 4 >> 2] | 0;
                                        aE = aC + aD | 0;
                                        if (aE >>> 0 > Y >>> 0) {
                                            break
                                        }
                                    }
                                    W = c[W + 8 >> 2] | 0
                                }
                                W = aC + (aD - 39) | 0;
                                if ((W & 7 | 0) == 0) {
                                    aF = 0
                                } else {
                                    aF = -W & 7
                                }
                                W = aC + (aD - 47 + aF) | 0;
                                ac = W >>> 0 < (ad + 16 | 0) >>> 0 ? Y : W;
                                W = ac + 8 | 0;
                                _ = ab + 8 | 0;
                                if ((_ & 7 | 0) == 0) {
                                    aG = 0
                                } else {
                                    aG = -_ & 7
                                }
                                _ = aa - 40 - aG | 0;
                                c[22] = ab + aG;
                                c[19] = _;
                                c[ab + (aG + 4) >> 2] = _ | 1;
                                c[ab + (aa - 36) >> 2] = 40;
                                c[23] = c[14];
                                c[ac + 4 >> 2] = 27;
                                c[W >> 2] = c[128];
                                c[W + 4 >> 2] = c[129];
                                c[W + 8 >> 2] = c[130];
                                c[W + 12 >> 2] = c[131];
                                c[128] = ab;
                                c[129] = aa;
                                c[131] = 0;
                                c[130] = W;
                                W = ac + 28 | 0;
                                c[W >> 2] = 7;
                                if ((ac + 32 | 0) >>> 0 < aE >>> 0) {
                                    _ = W;
                                    while (1) {
                                        W = _ + 4 | 0;
                                        c[W >> 2] = 7;
                                        if ((_ + 8 | 0) >>> 0 < aE >>> 0) {
                                            _ = W
                                        } else {
                                            break
                                        }
                                    }
                                }
                                if ((ac | 0) == (Y | 0)) {
                                    break
                                }
                                _ = ac - ad | 0;
                                W = Y + (_ + 4) | 0;
                                c[W >> 2] = c[W >> 2] & -2;
                                c[ad + 4 >> 2] = _ | 1;
                                c[Y + _ >> 2] = _;
                                W = _ >>> 3;
                                if (_ >>> 0 < 256 >>> 0) {
                                    K = W << 1;
                                    Z = 104 + (K << 2) | 0;
                                    S = c[16] | 0;
                                    m = 1 << W;
                                    do {
                                        if ((S & m | 0) == 0) {
                                            c[16] = S | m;
                                            aH = Z;
                                            aI = 104 + (K + 2 << 2) | 0
                                        } else {
                                            W = 104 + (K + 2 << 2) | 0;
                                            Q = c[W >> 2] | 0;
                                            if (Q >>> 0 >= (c[20] | 0) >>> 0) {
                                                aH = Q;
                                                aI = W;
                                                break
                                            }
                                            an();
                                            return 0
                                        }
                                    } while (0);
                                    c[aI >> 2] = ad;
                                    c[aH + 12 >> 2] = ad;
                                    c[ad + 8 >> 2] = aH;
                                    c[ad + 12 >> 2] = Z;
                                    break
                                }
                                K = ad;
                                m = _ >>> 8;
                                do {
                                    if ((m | 0) == 0) {
                                        aJ = 0
                                    } else {
                                        if (_ >>> 0 > 16777215 >>> 0) {
                                            aJ = 31;
                                            break
                                        }
                                        S = (m + 1048320 | 0) >>> 16 & 8;
                                        Y = m << S;
                                        ac = (Y + 520192 | 0) >>> 16 & 4;
                                        W = Y << ac;
                                        Y = (W + 245760 | 0) >>> 16 & 2;
                                        Q = 14 - (ac | S | Y) + (W << Y >>> 15) | 0;
                                        aJ = _ >>> ((Q + 7 | 0) >>> 0) & 1 | Q << 1
                                    }
                                } while (0);
                                m = 368 + (aJ << 2) | 0;
                                c[ad + 28 >> 2] = aJ;
                                c[ad + 20 >> 2] = 0;
                                c[ad + 16 >> 2] = 0;
                                Z = c[17] | 0;
                                Q = 1 << aJ;
                                if ((Z & Q | 0) == 0) {
                                    c[17] = Z | Q;
                                    c[m >> 2] = K;
                                    c[ad + 24 >> 2] = m;
                                    c[ad + 12 >> 2] = ad;
                                    c[ad + 8 >> 2] = ad;
                                    break
                                }
                                if ((aJ | 0) == 31) {
                                    aK = 0
                                } else {
                                    aK = 25 - (aJ >>> 1) | 0
                                }
                                Q = _ << aK;
                                Z = c[m >> 2] | 0;
                                while (1) {
                                    if ((c[Z + 4 >> 2] & -8 | 0) == (_ | 0)) {
                                        break
                                    }
                                    aL = Z + 16 + (Q >>> 31 << 2) | 0;
                                    m = c[aL >> 2] | 0;
                                    if ((m | 0) == 0) {
                                        T = 482;
                                        break
                                    } else {
                                        Q = Q << 1;
                                        Z = m
                                    }
                                }
                                if ((T | 0) == 482) {
                                    if (aL >>> 0 < (c[20] | 0) >>> 0) {
                                        an();
                                        return 0
                                    } else {
                                        c[aL >> 2] = K;
                                        c[ad + 24 >> 2] = Z;
                                        c[ad + 12 >> 2] = ad;
                                        c[ad + 8 >> 2] = ad;
                                        break
                                    }
                                }
                                Q = Z + 8 | 0;
                                _ = c[Q >> 2] | 0;
                                m = c[20] | 0;
                                if (Z >>> 0 < m >>> 0) {
                                    an();
                                    return 0
                                }
                                if (_ >>> 0 < m >>> 0) {
                                    an();
                                    return 0
                                } else {
                                    c[_ + 12 >> 2] = K;
                                    c[Q >> 2] = K;
                                    c[ad + 8 >> 2] = _;
                                    c[ad + 12 >> 2] = Z;
                                    c[ad + 24 >> 2] = 0;
                                    break
                                }
                            }
                        } while (0);
                        ad = c[19] | 0;
                        if (ad >>> 0 <= o >>> 0) {
                            break
                        }
                        _ = ad - o | 0;
                        c[19] = _;
                        ad = c[22] | 0;
                        Q = ad;
                        c[22] = Q + o;
                        c[Q + (o + 4) >> 2] = _ | 1;
                        c[ad + 4 >> 2] = o | 3;
                        n = ad + 8 | 0;
                        return n | 0
                    }
                } while (0);
                c[(am() | 0) >> 2] = 12;
                n = 0;
                return n | 0
            }

            function aQ(a) {
                a = a | 0;
                var b = 0,
                    d = 0,
                    e = 0,
                    f = 0,
                    g = 0,
                    h = 0,
                    i = 0,
                    j = 0,
                    k = 0,
                    l = 0,
                    m = 0,
                    n = 0,
                    o = 0,
                    p = 0,
                    q = 0,
                    r = 0,
                    s = 0,
                    t = 0,
                    u = 0,
                    v = 0,
                    w = 0,
                    x = 0,
                    y = 0,
                    z = 0,
                    A = 0,
                    B = 0,
                    C = 0,
                    D = 0,
                    E = 0,
                    F = 0,
                    G = 0,
                    H = 0,
                    I = 0,
                    J = 0,
                    K = 0,
                    L = 0,
                    M = 0,
                    N = 0,
                    O = 0;
                if ((a | 0) == 0) {
                    return
                }
                b = a - 8 | 0;
                d = b;
                e = c[20] | 0;
                if (b >>> 0 < e >>> 0) {
                    an()
                }
                f = c[a - 4 >> 2] | 0;
                g = f & 3;
                if ((g | 0) == 1) {
                    an()
                }
                h = f & -8;
                i = a + (h - 8) | 0;
                j = i;
                L741: do {
                    if ((f & 1 | 0) == 0) {
                        k = c[b >> 2] | 0;
                        if ((g | 0) == 0) {
                            return
                        }
                        l = -8 - k | 0;
                        m = a + l | 0;
                        n = m;
                        o = k + h | 0;
                        if (m >>> 0 < e >>> 0) {
                            an()
                        }
                        if ((n | 0) == (c[21] | 0)) {
                            p = a + (h - 4) | 0;
                            if ((c[p >> 2] & 3 | 0) != 3) {
                                q = n;
                                r = o;
                                break
                            }
                            c[18] = o;
                            c[p >> 2] = c[p >> 2] & -2;
                            c[a + (l + 4) >> 2] = o | 1;
                            c[i >> 2] = o;
                            return
                        }
                        p = k >>> 3;
                        if (k >>> 0 < 256 >>> 0) {
                            k = c[a + (l + 8) >> 2] | 0;
                            s = c[a + (l + 12) >> 2] | 0;
                            t = 104 + (p << 1 << 2) | 0;
                            do {
                                if ((k | 0) != (t | 0)) {
                                    if (k >>> 0 < e >>> 0) {
                                        an()
                                    }
                                    if ((c[k + 12 >> 2] | 0) == (n | 0)) {
                                        break
                                    }
                                    an()
                                }
                            } while (0);
                            if ((s | 0) == (k | 0)) {
                                c[16] = c[16] & ~(1 << p);
                                q = n;
                                r = o;
                                break
                            }
                            do {
                                if ((s | 0) == (t | 0)) {
                                    u = s + 8 | 0
                                } else {
                                    if (s >>> 0 < e >>> 0) {
                                        an()
                                    }
                                    v = s + 8 | 0;
                                    if ((c[v >> 2] | 0) == (n | 0)) {
                                        u = v;
                                        break
                                    }
                                    an()
                                }
                            } while (0);
                            c[k + 12 >> 2] = s;
                            c[u >> 2] = k;
                            q = n;
                            r = o;
                            break
                        }
                        t = m;
                        p = c[a + (l + 24) >> 2] | 0;
                        v = c[a + (l + 12) >> 2] | 0;
                        do {
                            if ((v | 0) == (t | 0)) {
                                w = a + (l + 20) | 0;
                                x = c[w >> 2] | 0;
                                if ((x | 0) == 0) {
                                    y = a + (l + 16) | 0;
                                    z = c[y >> 2] | 0;
                                    if ((z | 0) == 0) {
                                        A = 0;
                                        break
                                    } else {
                                        B = z;
                                        C = y
                                    }
                                } else {
                                    B = x;
                                    C = w
                                }
                                while (1) {
                                    w = B + 20 | 0;
                                    x = c[w >> 2] | 0;
                                    if ((x | 0) != 0) {
                                        B = x;
                                        C = w;
                                        continue
                                    }
                                    w = B + 16 | 0;
                                    x = c[w >> 2] | 0;
                                    if ((x | 0) == 0) {
                                        break
                                    } else {
                                        B = x;
                                        C = w
                                    }
                                }
                                if (C >>> 0 < e >>> 0) {
                                    an()
                                } else {
                                    c[C >> 2] = 0;
                                    A = B;
                                    break
                                }
                            } else {
                                w = c[a + (l + 8) >> 2] | 0;
                                if (w >>> 0 < e >>> 0) {
                                    an()
                                }
                                x = w + 12 | 0;
                                if ((c[x >> 2] | 0) != (t | 0)) {
                                    an()
                                }
                                y = v + 8 | 0;
                                if ((c[y >> 2] | 0) == (t | 0)) {
                                    c[x >> 2] = v;
                                    c[y >> 2] = w;
                                    A = v;
                                    break
                                } else {
                                    an()
                                }
                            }
                        } while (0);
                        if ((p | 0) == 0) {
                            q = n;
                            r = o;
                            break
                        }
                        v = a + (l + 28) | 0;
                        m = 368 + (c[v >> 2] << 2) | 0;
                        do {
                            if ((t | 0) == (c[m >> 2] | 0)) {
                                c[m >> 2] = A;
                                if ((A | 0) != 0) {
                                    break
                                }
                                c[17] = c[17] & ~(1 << c[v >> 2]);
                                q = n;
                                r = o;
                                break L741
                            } else {
                                if (p >>> 0 < (c[20] | 0) >>> 0) {
                                    an()
                                }
                                k = p + 16 | 0;
                                if ((c[k >> 2] | 0) == (t | 0)) {
                                    c[k >> 2] = A
                                } else {
                                    c[p + 20 >> 2] = A
                                }
                                if ((A | 0) == 0) {
                                    q = n;
                                    r = o;
                                    break L741
                                }
                            }
                        } while (0);
                        if (A >>> 0 < (c[20] | 0) >>> 0) {
                            an()
                        }
                        c[A + 24 >> 2] = p;
                        t = c[a + (l + 16) >> 2] | 0;
                        do {
                            if ((t | 0) != 0) {
                                if (t >>> 0 < (c[20] | 0) >>> 0) {
                                    an()
                                } else {
                                    c[A + 16 >> 2] = t;
                                    c[t + 24 >> 2] = A;
                                    break
                                }
                            }
                        } while (0);
                        t = c[a + (l + 20) >> 2] | 0;
                        if ((t | 0) == 0) {
                            q = n;
                            r = o;
                            break
                        }
                        if (t >>> 0 < (c[20] | 0) >>> 0) {
                            an()
                        } else {
                            c[A + 20 >> 2] = t;
                            c[t + 24 >> 2] = A;
                            q = n;
                            r = o;
                            break
                        }
                    } else {
                        q = d;
                        r = h
                    }
                } while (0);
                d = q;
                if (d >>> 0 >= i >>> 0) {
                    an()
                }
                A = a + (h - 4) | 0;
                e = c[A >> 2] | 0;
                if ((e & 1 | 0) == 0) {
                    an()
                }
                do {
                    if ((e & 2 | 0) == 0) {
                        if ((j | 0) == (c[22] | 0)) {
                            B = (c[19] | 0) + r | 0;
                            c[19] = B;
                            c[22] = q;
                            c[q + 4 >> 2] = B | 1;
                            if ((q | 0) != (c[21] | 0)) {
                                return
                            }
                            c[21] = 0;
                            c[18] = 0;
                            return
                        }
                        if ((j | 0) == (c[21] | 0)) {
                            B = (c[18] | 0) + r | 0;
                            c[18] = B;
                            c[21] = q;
                            c[q + 4 >> 2] = B | 1;
                            c[d + B >> 2] = B;
                            return
                        }
                        B = (e & -8) + r | 0;
                        C = e >>> 3;
                        L843: do {
                            if (e >>> 0 < 256 >>> 0) {
                                u = c[a + h >> 2] | 0;
                                g = c[a + (h | 4) >> 2] | 0;
                                b = 104 + (C << 1 << 2) | 0;
                                do {
                                    if ((u | 0) != (b | 0)) {
                                        if (u >>> 0 < (c[20] | 0) >>> 0) {
                                            an()
                                        }
                                        if ((c[u + 12 >> 2] | 0) == (j | 0)) {
                                            break
                                        }
                                        an()
                                    }
                                } while (0);
                                if ((g | 0) == (u | 0)) {
                                    c[16] = c[16] & ~(1 << C);
                                    break
                                }
                                do {
                                    if ((g | 0) == (b | 0)) {
                                        D = g + 8 | 0
                                    } else {
                                        if (g >>> 0 < (c[20] | 0) >>> 0) {
                                            an()
                                        }
                                        f = g + 8 | 0;
                                        if ((c[f >> 2] | 0) == (j | 0)) {
                                            D = f;
                                            break
                                        }
                                        an()
                                    }
                                } while (0);
                                c[u + 12 >> 2] = g;
                                c[D >> 2] = u
                            } else {
                                b = i;
                                f = c[a + (h + 16) >> 2] | 0;
                                t = c[a + (h | 4) >> 2] | 0;
                                do {
                                    if ((t | 0) == (b | 0)) {
                                        p = a + (h + 12) | 0;
                                        v = c[p >> 2] | 0;
                                        if ((v | 0) == 0) {
                                            m = a + (h + 8) | 0;
                                            k = c[m >> 2] | 0;
                                            if ((k | 0) == 0) {
                                                E = 0;
                                                break
                                            } else {
                                                F = k;
                                                G = m
                                            }
                                        } else {
                                            F = v;
                                            G = p
                                        }
                                        while (1) {
                                            p = F + 20 | 0;
                                            v = c[p >> 2] | 0;
                                            if ((v | 0) != 0) {
                                                F = v;
                                                G = p;
                                                continue
                                            }
                                            p = F + 16 | 0;
                                            v = c[p >> 2] | 0;
                                            if ((v | 0) == 0) {
                                                break
                                            } else {
                                                F = v;
                                                G = p
                                            }
                                        }
                                        if (G >>> 0 < (c[20] | 0) >>> 0) {
                                            an()
                                        } else {
                                            c[G >> 2] = 0;
                                            E = F;
                                            break
                                        }
                                    } else {
                                        p = c[a + h >> 2] | 0;
                                        if (p >>> 0 < (c[20] | 0) >>> 0) {
                                            an()
                                        }
                                        v = p + 12 | 0;
                                        if ((c[v >> 2] | 0) != (b | 0)) {
                                            an()
                                        }
                                        m = t + 8 | 0;
                                        if ((c[m >> 2] | 0) == (b | 0)) {
                                            c[v >> 2] = t;
                                            c[m >> 2] = p;
                                            E = t;
                                            break
                                        } else {
                                            an()
                                        }
                                    }
                                } while (0);
                                if ((f | 0) == 0) {
                                    break
                                }
                                t = a + (h + 20) | 0;
                                u = 368 + (c[t >> 2] << 2) | 0;
                                do {
                                    if ((b | 0) == (c[u >> 2] | 0)) {
                                        c[u >> 2] = E;
                                        if ((E | 0) != 0) {
                                            break
                                        }
                                        c[17] = c[17] & ~(1 << c[t >> 2]);
                                        break L843
                                    } else {
                                        if (f >>> 0 < (c[20] | 0) >>> 0) {
                                            an()
                                        }
                                        g = f + 16 | 0;
                                        if ((c[g >> 2] | 0) == (b | 0)) {
                                            c[g >> 2] = E
                                        } else {
                                            c[f + 20 >> 2] = E
                                        }
                                        if ((E | 0) == 0) {
                                            break L843
                                        }
                                    }
                                } while (0);
                                if (E >>> 0 < (c[20] | 0) >>> 0) {
                                    an()
                                }
                                c[E + 24 >> 2] = f;
                                b = c[a + (h + 8) >> 2] | 0;
                                do {
                                    if ((b | 0) != 0) {
                                        if (b >>> 0 < (c[20] | 0) >>> 0) {
                                            an()
                                        } else {
                                            c[E + 16 >> 2] = b;
                                            c[b + 24 >> 2] = E;
                                            break
                                        }
                                    }
                                } while (0);
                                b = c[a + (h + 12) >> 2] | 0;
                                if ((b | 0) == 0) {
                                    break
                                }
                                if (b >>> 0 < (c[20] | 0) >>> 0) {
                                    an()
                                } else {
                                    c[E + 20 >> 2] = b;
                                    c[b + 24 >> 2] = E;
                                    break
                                }
                            }
                        } while (0);
                        c[q + 4 >> 2] = B | 1;
                        c[d + B >> 2] = B;
                        if ((q | 0) != (c[21] | 0)) {
                            H = B;
                            break
                        }
                        c[18] = B;
                        return
                    } else {
                        c[A >> 2] = e & -2;
                        c[q + 4 >> 2] = r | 1;
                        c[d + r >> 2] = r;
                        H = r
                    }
                } while (0);
                r = H >>> 3;
                if (H >>> 0 < 256 >>> 0) {
                    d = r << 1;
                    e = 104 + (d << 2) | 0;
                    A = c[16] | 0;
                    E = 1 << r;
                    do {
                        if ((A & E | 0) == 0) {
                            c[16] = A | E;
                            I = e;
                            J = 104 + (d + 2 << 2) | 0
                        } else {
                            r = 104 + (d + 2 << 2) | 0;
                            h = c[r >> 2] | 0;
                            if (h >>> 0 >= (c[20] | 0) >>> 0) {
                                I = h;
                                J = r;
                                break
                            }
                            an()
                        }
                    } while (0);
                    c[J >> 2] = q;
                    c[I + 12 >> 2] = q;
                    c[q + 8 >> 2] = I;
                    c[q + 12 >> 2] = e;
                    return
                }
                e = q;
                I = H >>> 8;
                do {
                    if ((I | 0) == 0) {
                        K = 0
                    } else {
                        if (H >>> 0 > 16777215 >>> 0) {
                            K = 31;
                            break
                        }
                        J = (I + 1048320 | 0) >>> 16 & 8;
                        d = I << J;
                        E = (d + 520192 | 0) >>> 16 & 4;
                        A = d << E;
                        d = (A + 245760 | 0) >>> 16 & 2;
                        r = 14 - (E | J | d) + (A << d >>> 15) | 0;
                        K = H >>> ((r + 7 | 0) >>> 0) & 1 | r << 1
                    }
                } while (0);
                I = 368 + (K << 2) | 0;
                c[q + 28 >> 2] = K;
                c[q + 20 >> 2] = 0;
                c[q + 16 >> 2] = 0;
                r = c[17] | 0;
                d = 1 << K;
                do {
                    if ((r & d | 0) == 0) {
                        c[17] = r | d;
                        c[I >> 2] = e;
                        c[q + 24 >> 2] = I;
                        c[q + 12 >> 2] = q;
                        c[q + 8 >> 2] = q
                    } else {
                        if ((K | 0) == 31) {
                            L = 0
                        } else {
                            L = 25 - (K >>> 1) | 0
                        }
                        A = H << L;
                        J = c[I >> 2] | 0;
                        while (1) {
                            if ((c[J + 4 >> 2] & -8 | 0) == (H | 0)) {
                                break
                            }
                            M = J + 16 + (A >>> 31 << 2) | 0;
                            E = c[M >> 2] | 0;
                            if ((E | 0) == 0) {
                                N = 659;
                                break
                            } else {
                                A = A << 1;
                                J = E
                            }
                        }
                        if ((N | 0) == 659) {
                            if (M >>> 0 < (c[20] | 0) >>> 0) {
                                an()
                            } else {
                                c[M >> 2] = e;
                                c[q + 24 >> 2] = J;
                                c[q + 12 >> 2] = q;
                                c[q + 8 >> 2] = q;
                                break
                            }
                        }
                        A = J + 8 | 0;
                        B = c[A >> 2] | 0;
                        E = c[20] | 0;
                        if (J >>> 0 < E >>> 0) {
                            an()
                        }
                        if (B >>> 0 < E >>> 0) {
                            an()
                        } else {
                            c[B + 12 >> 2] = e;
                            c[A >> 2] = e;
                            c[q + 8 >> 2] = B;
                            c[q + 12 >> 2] = J;
                            c[q + 24 >> 2] = 0;
                            break
                        }
                    }
                } while (0);
                q = (c[24] | 0) - 1 | 0;
                c[24] = q;
                if ((q | 0) == 0) {
                    O = 520
                } else {
                    return
                }
                while (1) {
                    q = c[O >> 2] | 0;
                    if ((q | 0) == 0) {
                        break
                    } else {
                        O = q + 8 | 0
                    }
                }
                c[24] = -1;
                return
            }

            function aR(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0,
                    g = 0,
                    h = 0,
                    i = 0;
                f = b + e | 0;
                if ((e | 0) >= 20) {
                    d = d & 255;
                    g = b & 3;
                    h = d | d << 8 | d << 16 | d << 24;
                    i = f & ~3;
                    if (g) {
                        g = b + 4 - g | 0;
                        while ((b | 0) < (g | 0)) {
                            a[b] = d;
                            b = b + 1 | 0
                        }
                    }
                    while ((b | 0) < (i | 0)) {
                        c[b >> 2] = h;
                        b = b + 4 | 0
                    }
                }
                while ((b | 0) < (f | 0)) {
                    a[b] = d;
                    b = b + 1 | 0
                }
                return b - e | 0
            }

            function aS(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0;
                f = b | 0;
                if ((b & 3) == (d & 3)) {
                    while (b & 3) {
                        if ((e | 0) == 0) return f | 0;
                        a[b] = a[d] | 0;
                        b = b + 1 | 0;
                        d = d + 1 | 0;
                        e = e - 1 | 0
                    }
                    while ((e | 0) >= 4) {
                        c[b >> 2] = c[d >> 2];
                        b = b + 4 | 0;
                        d = d + 4 | 0;
                        e = e - 4 | 0
                    }
                }
                while ((e | 0) > 0) {
                    a[b] = a[d] | 0;
                    b = b + 1 | 0;
                    d = d + 1 | 0;
                    e = e - 1 | 0
                }
                return f | 0
            }

            function aT(b) {
                b = b | 0;
                var c = 0;
                c = a[m + (b & 255) | 0] | 0;
                if ((c | 0) < 8) return c | 0;
                c = a[m + (b >> 8 & 255) | 0] | 0;
                if ((c | 0) < 8) return c + 8 | 0;
                c = a[m + (b >> 16 & 255) | 0] | 0;
                if ((c | 0) < 8) return c + 16 | 0;
                return (a[m + (b >>> 24) | 0] | 0) + 24 | 0
            }

            function aU(b) {
                b = b | 0;
                var c = 0;
                c = b;
                while (a[c] | 0) {
                    c = c + 1 | 0
                }
                return c - b | 0
            }

            function aV(a, b) {
                a = a | 0;
                b = b | 0;
                return ar[a & 1](b | 0) | 0
            }

            function aW(a) {
                a = a | 0;
                as[a & 1]()
            }

            function aX(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                return at[a & 1](b | 0, c | 0) | 0
            }

            function aY(a, b) {
                a = a | 0;
                b = b | 0;
                au[a & 1](b | 0)
            }

            function aZ(a) {
                a = a | 0;
                aa(0);
                return 0
            }

            function a_() {
                aa(1)
            }

            function a$(a, b) {
                a = a | 0;
                b = b | 0;
                aa(2);
                return 0
            }

            function a0(a) {
                    a = a | 0;
                    aa(3)
                }
                // EMSCRIPTEN_END_FUNCS
            var ar = [aZ, aZ];
            var as = [a_, a_];
            var at = [a$, a$];
            var au = [a0, a0];
            return {
                _strlen: aU,
                _free: aQ,
                _XXH32: aO,
                _memset: aR,
                _llvm_cttz_i32: aT,
                _malloc: aP,
                _LZ4_decompress_safe: aN,
                _memcpy: aS,
                _LZ4_compress: aM,
                runPostSets: aL,
                stackAlloc: av,
                stackSave: aw,
                stackRestore: ax,
                setThrew: ay,
                setTempRet0: aB,
                setTempRet1: aC,
                setTempRet2: aD,
                setTempRet3: aE,
                setTempRet4: aF,
                setTempRet5: aG,
                setTempRet6: aH,
                setTempRet7: aI,
                setTempRet8: aJ,
                setTempRet9: aK,
                dynCall_ii: aV,
                dynCall_v: aW,
                dynCall_iii: aX,
                dynCall_vi: aY
            }
            // EMSCRIPTEN_END_ASM
        })({
            Math: Math,
            Int8Array: Int8Array,
            Int16Array: Int16Array,
            Int32Array: Int32Array,
            Uint8Array: Uint8Array,
            Uint16Array: Uint16Array,
            Uint32Array: Uint32Array,
            Float32Array: Float32Array,
            Float64Array: Float64Array
        }, {
            abort: B,
            assert: w,
            asmPrintInt: function(a, b) {
                r.print("int " + a + "," + b)
            },
            asmPrintFloat: function(a, b) {
                r.print("float " + a + "," + b)
            },
            min: Fa,
            invoke_ii: function(a, b) {
                try {
                    return r.dynCall_ii(a, b)
                } catch (c) {
                    "number" !== typeof c && "longjmp" !== c && e(c), $.setThrew(1, 0)
                }
            },
            invoke_v: function(a) {
                try {
                    r.dynCall_v(a)
                } catch (b) {
                    "number" !==
                    typeof b && "longjmp" !== b && e(b), $.setThrew(1, 0)
                }
            },
            invoke_iii: function(a, b, c) {
                try {
                    return r.dynCall_iii(a, b, c)
                } catch (d) {
                    "number" !== typeof d && "longjmp" !== d && e(d), $.setThrew(1, 0)
                }
            },
            invoke_vi: function(a, b) {
                try {
                    r.dynCall_vi(a, b)
                } catch (c) {
                    "number" !== typeof c && "longjmp" !== c && e(c), $.setThrew(1, 0)
                }
            },
            _sysconf: function(a) {
                switch (a) {
                    case 30:
                        return 4096;
                    case 132:
                    case 133:
                    case 12:
                    case 137:
                    case 138:
                    case 15:
                    case 235:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 149:
                    case 13:
                    case 10:
                    case 236:
                    case 153:
                    case 9:
                    case 21:
                    case 22:
                    case 159:
                    case 154:
                    case 14:
                    case 77:
                    case 78:
                    case 139:
                    case 80:
                    case 81:
                    case 79:
                    case 82:
                    case 68:
                    case 67:
                    case 164:
                    case 11:
                    case 29:
                    case 47:
                    case 48:
                    case 95:
                    case 52:
                    case 51:
                    case 46:
                        return 200809;
                    case 27:
                    case 246:
                    case 127:
                    case 128:
                    case 23:
                    case 24:
                    case 160:
                    case 161:
                    case 181:
                    case 182:
                    case 242:
                    case 183:
                    case 184:
                    case 243:
                    case 244:
                    case 245:
                    case 165:
                    case 178:
                    case 179:
                    case 49:
                    case 50:
                    case 168:
                    case 169:
                    case 175:
                    case 170:
                    case 171:
                    case 172:
                    case 97:
                    case 76:
                    case 32:
                    case 173:
                    case 35:
                        return -1;
                    case 176:
                    case 177:
                    case 7:
                    case 155:
                    case 8:
                    case 157:
                    case 125:
                    case 126:
                    case 92:
                    case 93:
                    case 129:
                    case 130:
                    case 131:
                    case 94:
                    case 91:
                        return 1;
                    case 74:
                    case 60:
                    case 69:
                    case 70:
                    case 4:
                        return 1024;
                    case 31:
                    case 42:
                    case 72:
                        return 32;
                    case 87:
                    case 26:
                    case 33:
                        return 2147483647;
                    case 34:
                    case 1:
                        return 47839;
                    case 38:
                    case 36:
                        return 99;
                    case 43:
                    case 37:
                        return 2048;
                    case 0:
                        return 2097152;
                    case 3:
                        return 65536;
                    case 28:
                        return 32768;
                    case 44:
                        return 32767;
                    case 75:
                        return 16384;
                    case 39:
                        return 1E3;
                    case 89:
                        return 700;
                    case 71:
                        return 256;
                    case 40:
                        return 255;
                    case 2:
                        return 100;
                    case 180:
                        return 64;
                    case 25:
                        return 20;
                    case 5:
                        return 16;
                    case 6:
                        return 6;
                    case 73:
                        return 4;
                    case 84:
                        return 1
                }
                kb(R.C);
                return -1
            },
            _sbrk: lb,
            ___setErrNo: kb,
            ___errno_location: function() {
                return jb
            },
            _abort: function() {
                r.abort()
            },
            _time: function(a) {
                var b = Math.floor(Date.now() / 1E3);
                a && (H[a >> 2] = b);
                return b
            },
            _fflush: q(),
            STACKTOP: u,
            STACK_MAX: Ra,
            tempDoublePtr: eb,
            ABORT: xa,
            cttz_i8: hb,
            ctlz_i8: 1,
            NaN: NaN,
            Infinity: Infinity
        }, N),
        mb = r._strlen = $._strlen,
        tc = r._free = $._free,
        uc = r._XXH32 = $._XXH32,
        fb = r._memset = $._memset,
        ib = r._llvm_cttz_i32 = $._llvm_cttz_i32,
        L = r._malloc = $._malloc,
        vc = r._LZ4_decompress_safe = $._LZ4_decompress_safe,
        gb = r._memcpy = $._memcpy,
        wc = r._LZ4_compress = $._LZ4_compress,
        db = r.runPostSets = $.runPostSets;
    r.dynCall_ii = $.dynCall_ii;
    r.dynCall_v = $.dynCall_v;
    r.dynCall_iii = $.dynCall_iii;
    r.dynCall_vi = $.dynCall_vi;
    qa = function(a) {
        return $.stackAlloc(a)
    };
    ja = function() {
        return $.stackSave()
    };
    ka = function(a) {
        $.stackRestore(a)
    };

    function xc(a) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + a + ")";
        this.status = a
    }
    xc.prototype = Error();
    var yc, zc = m,
        ab = function Ac() {
            !r.calledRun && Bc && Cc();
            r.calledRun || (ab = Ac)
        };
    r.callMain = r.fd = function(a) {
        function b() {
            for (var a = 0; 3 > a; a++) d.push(0)
        }
        w(0 == Q, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
        w(0 == Ta.length, "cannot call main when preRun functions remain to be called");
        a = a || [];
        ca && zc !== m && r.P("preload time: " + (Date.now() - zc) + " ms");
        Xa || (Xa = l, O(P));
        var c = a.length + 1,
            d = [K(D("/bin/this.program"), "i8", 0)];
        b();
        for (var f = 0; f < c - 1; f += 1) d.push(K(D(a[f]), "i8", 0)), b();
        d.push(0);
        d = K(d, "i32", 0);
        yc = u;
        try {
            var g = r._main(c, d, 0);
            r.noExitRuntime || Dc(g)
        } catch (h) {
            h instanceof
            xc || ("SimulateInfiniteLoop" == h ? r.noExitRuntime = l : (h && ("object" === typeof h && h.stack) && r.P("exception thrown: " + [h, h.stack]), e(h)))
        } finally {}
    };

    function Cc(a) {
        function b() {
            Xa || (Xa = l, O(P));
            O(Ua);
            r.calledRun = l;
            r._main && Bc && r.callMain(a);
            if (r.postRun)
                for ("function" == typeof r.postRun && (r.postRun = [r.postRun]); r.postRun.length;) Za(r.postRun.shift());
            O(Wa)
        }
        a = a || r.arguments;
        zc === m && (zc = Date.now());
        if (0 < Q) r.P("run() called, but dependencies remain, so not running");
        else {
            if (r.preRun)
                for ("function" == typeof r.preRun && (r.preRun = [r.preRun]); r.preRun.length;) Ya(r.preRun.shift());
            O(Ta);
            0 < Q || (r.setStatus ? (r.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                        r.setStatus("")
                    },
                    1);
                xa || b()
            }, 1)) : b())
        }
    }
    r.run = r.xd = Cc;

    function Dc(a) {
        xa = l;
        u = yc;
        O(Va);
        e(new xc(a))
    }
    r.exit = r.kd = Dc;

    function B(a) {
        a && (r.print(a), r.P(a));
        xa = l;
        e("abort() at " + Ma())
    }
    r.abort = r.abort = B;
    if (r.preInit)
        for ("function" == typeof r.preInit && (r.preInit = [r.preInit]); 0 < r.preInit.length;) r.preInit.pop()();
    var Bc = l;
    r.noInitialRun && (Bc = p);
    Cc();

    function Ec(a) {
        return a + (a / 255 | 0) + 16
    }
    var Fc = [m, m, m, m, 65536, 262144, 1048576, 4194304],
        Gc = this;
    Gc.decompress = function(a) {
        var g = new DataView(a.buffer, a.byteOffset, a.byteLength);
        var magic = g.getUint32(0, true);
        if (magic != 0xBAADFEED && magic != 0xDEADDA7A)
        {
          e(Error("lz4: invalid magic number"));
        }
        var size = g.getUint32(4, true);
        var csize = g.getUint32(8, true);
        var inbuf = L(csize);
        var outbuf = L(size);
		M.set(a.subarray(12), inbuf);
		vc(inbuf, outbuf, csize, size) !== size && e(Error("lz4: error decompress"));
		var buf = new Uint8Array(M.subarray(outbuf, outbuf + size));
        tc(inbuf);
        tc(outbuf);
        return {data:buf, last:magic==0xBAADFEED};
    };
    r._LZ4_compressBound = Ec;
    "function" === typeof define && define.amd ? define("lz4", function() {
        return Gc
    }) : ba && (module.exports = Gc);

}).call(lz4);
