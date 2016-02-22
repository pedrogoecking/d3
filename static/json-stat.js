/*

JSON-stat Javascript Toolkit v. 0.6.2
http://json-stat.org
https://github.com/badosa/JSON-stat

Copyright 2014 Xavier Badosa (http://xavierbadosa.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied. See the License for the specific language governing
permissions and limitations under the License.

*/
function JSONstat(a, b) {
    return window === this ? new JSONstat.jsonstat(a, b) : void 0
}
var JSONstat = JSONstat || {};
JSONstat.version = "0.6.2",
    function() {
        "use strict";

        function a(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        }

        function b(b, c) {
            function e(b, c) {
                var d = [];
                if ("string" == typeof b && (b = [b]), a(b)) {
                    if (b.length === c) return b;
                    if (1 === b.length) {
                        for (var e = 0; c > e; e++) d.push(b[0]);
                        return d
                    }
                }
                for (var e = 0; c > e; e++) {
                    var f = "undefined" == typeof b[e] ? null : b[e];
                    d.push(f)
                }
                return d
            }
            var d = function(a, b) {
                var c, d = b !== !1;
                if (window.XDomainRequest && /^(http(s)?:)?\/\//.test(a)) {
                    if (!d) return;
                    var e = new XDomainRequest;
                    e.onload = function() {
                        c = JSON.parse(e.responseText), b.call(JSONstat(c))
                    }, e.open("GET", a), e.send()
                } else {
                    var e = new XMLHttpRequest;
                    if (e.onreadystatechange = function() {
                            if (4 === e.readyState) {
                                var a = e.status;
                                c = a && e.responseText && (a >= 200 && 300 > a || 304 === a) ? JSON.parse(e.responseText) : null, d && b.call(JSONstat(c))
                            }
                        }, e.open("GET", a, d), e.send(null), !d) return c
                }
            };
            if (this.length = 0, this.id = [], null !== b && "undefined" != typeof b) {
                var f = b.type || "root";
                switch (f) {
                    case "root":
                        this.type = "root";
                        var g = [],
                            h = 0;
                        if ("string" == typeof b && b.length > 0 && (b = d(b, "function" == typeof c ? c : !1)), null === b || "object" != typeof b) return;
                        for (var i in b) h++, g.push(i);
                        this.__tree__ = b, this.length = h, this.id = g;
                        break;
                    case "ds":
                        if (this.type = "ds", !b.hasOwnProperty("__tree__")) return;
                        var j = b.__tree__;
                        this.__tree__ = j, this.label = j.label || null, this.updated = j.updated || null, this.source = j.source || null;
                        var k = 0;
                        if (j.hasOwnProperty("value") && a(j.value)) k = j.value.length;
                        else if (j.hasOwnProperty("status") && a(j.status)) k = j.status.length;
                        else if (j.hasOwnProperty("dimension")) {
                            for (var l = this.__tree__.dimension.size, m = 1, n = l.length; n--;) m *= l[n];
                            k = m
                        }
                        if (this.value = e(j.value, k), this.status = j.hasOwnProperty("status") ? e(j.status, k) : null, j.hasOwnProperty("dimension")) {
                            if (!a(j.dimension.id) || !a(j.dimension.size) || j.dimension.id.length != j.dimension.size.length) return;
                            var o = j.dimension;
                            this.length = o.size.length, this.id = o.id, this.role = o.role, this.n = k;
                            for (var p = 0, q = this.length; q > p; p++)
                                if (o[o.id[p]].category.hasOwnProperty("index")) {
                                    if (a(o[o.id[p]].category.index)) {
                                        for (var s = {}, t = o[o.id[p]].category.index, g = 0, u = t.length; u > g; g++) s[t[g]] = g;
                                        o[o.id[p]].category.index = s
                                    }
                                } else {
                                    var r = 0;
                                    o[o.id[p]].category.index = {};
                                    for (var i in o[o.id[p]].category.label) o[o.id[p]].category.index[i] = r++
                                }
                        } else this.length = 0;
                        break;
                    case "dim":
                        this.type = "dim";
                        var v = [],
                            j = b.__tree__,
                            w = j.category;
                        if (!b.hasOwnProperty("__tree__") || !j.hasOwnProperty("category")) return;
                        if (!w.hasOwnProperty("label")) {
                            w.label = {};
                            for (var i in w.index) w.label[i] = i
                        }
                        for (var i in w.index) v[w.index[i]] = i;
                        this.__tree__ = j, this.label = j.label || null, this.id = v, this.length = v.length, this.role = b.role, this.hierarchy = w.hasOwnProperty("child");
                        break;
                    case "cat":
                        var x = b.child;
                        this.type = "cat", this.id = x, this.length = null === x ? 0 : x.length, this.index = b.index, this.label = b.label, this.unit = b.unit, this.coordinates = b.coord
                }
            }
        }
        b.prototype.Dataset = function(a) {
            if (null === this || "root" !== this.type) return null;
            if ("undefined" == typeof a) {
                for (var c = [], d = 0, e = this.id.length; e > d; d++) c.push(this.Dataset(this.id[d]));
                return c
            }
            if ("number" == typeof a) {
                var f = this.id[a];
                return "undefined" != typeof f ? this.Dataset(f) : null
            }
            var g = this.__tree__[a];
            return "undefined" == typeof g ? null : new b({
                type: "ds",
                __tree__: g
            })
        }, b.prototype.Dimension = function(a) {
            function c(a, b) {
                var c = a.role;
                if ("undefined" != typeof c)
                    for (var d in c)
                        for (var e = c[d].length; e--;)
                            if (c[d][e] === b) return d;
                return null
            }
            if (null === this || "ds" !== this.type) return null;
            if ("undefined" == typeof a) {
                for (var d = [], e = 0, f = this.id.length; f > e; e++) d.push(this.Dimension(this.id[e]));
                return d
            }
            if ("number" == typeof a) {
                var g = this.id[a];
                return "undefined" != typeof g ? this.Dimension(g) : null
            }
            var h = this.__tree__.dimension;
            if ("undefined" == typeof h) return null;
            if ("object" == typeof a) {
                if (a.hasOwnProperty("role")) {
                    for (var d = [], e = 0, f = this.id.length; f > e; e++) {
                        var i = this.id[e];
                        c(h, i) === a.role && d.push(this.Dimension(i))
                    }
                    return "undefined" == typeof d[0] ? null : d
                }
                return null
            }
            var j = h[a];
            return "undefined" == typeof j ? null : new b({
                type: "dim",
                __tree__: j,
                role: c(h, a)
            })
        }, b.prototype.Category = function(a) {
            if (null === this || "dim" !== this.type) return null;
            if ("undefined" == typeof a) {
                for (var c = [], d = 0, e = this.id.length; e > d; d++) c.push(this.Category(this.id[d]));
                return c
            }
            if ("number" == typeof a) {
                var f = this.id[a];
                return "undefined" != typeof f ? this.Category(f) : null
            }
            var g = this.__tree__.category;
            if ("undefined" == typeof g) return null;
            var h = g.index[a];
            if ("undefined" == typeof h) return null;
            var i = g.unit && g.unit[a] || null,
                j = g.coordinates && g.coordinates[a] || null,
                k = g.child && g.child[a] || null;
            return new b({
                type: "cat",
                index: h,
                label: g.label[a],
                child: k,
                unit: i,
                coord: j
            })
        }, b.prototype.Data = function(b) {
            function c(a) {
                for (var b in a)
                    if (a.hasOwnProperty(b)) return b
            }

            function d(a, b) {
                for (var d = [], e = a.dimension, f = e.id, g = 0, h = f.length; h > g; g++) {
                    var i = f[g],
                        j = b[i];
                    d.push("string" == typeof j ? j : 1 === e.size[g] ? c(e[i].category.index) : null)
                }
                return d
            }
            if (null === this || "ds" !== this.type) return null;
            if ("undefined" == typeof b) {
                for (var e = 0, f = [], g = this.value.length; g > e; e++) f.push(this.Data(e));
                return f
            }
            if ("number" == typeof b) {
                var h = this.value[b];
                return "undefined" != typeof h ? {
                    value: h,
                    status: this.status ? this.status[b] : null
                } : null
            }
            var i = this.__tree__,
                j = i.dimension.size,
                k = j.length;
            if (a(b)) {
                if (this.length !== b.length) return null;
                for (var l = 1, m = 0, n = [], o = [], f = [], e = 0; k > e; e++)
                    if ("undefined" != typeof b[e]) {
                        if ("number" != typeof b[e] || b[e] >= j[e]) return null;
                        l *= e > 0 ? j[k - e] : 1, m += l * b[k - e - 1]
                    } else n.push(e), o.push(j[e]);
                if (n.length > 1) return null;
                if (1 === n.length) {
                    for (var p = 0, q = o[0]; q > p; p++) {
                        for (var r = [], e = 0; k > e; e++) e !== n[0] ? r.push(b[e]) : r.push(p);
                        f.push(this.Data(r))
                    }
                    return f
                }
                return {
                    value: this.value[m],
                    status: this.status ? this.status[m] : null
                }
            }
            for (var s = d(i, b), t = [], u = i.dimension, e = 0, g = s.length; g > e; e++) t.push(u[u.id[e]].category.index[s[e]]);
            return this.Data(t)
        }, b.prototype.toTable = function(a, b) {
            if (null === this || "ds" !== this.type) return null;
            1 == arguments.length && "function" == typeof a && (b = a, a = null);
            var c = this.__tree__,
                a = a || {
                    field: "label",
                    content: "label",
                    vlabel: "Value",
                    slabel: "Status",
                    type: "array",
                    status: !1
                };
            if ("function" == typeof b) {
                var d = this.toTable(a),
                    e = [],
                    f = "array" !== a.type ? 0 : 1;
                if ("object" !== a.type) var g = d.slice(f);
                else var g = d.rows.slice(0);
                for (var h = 0, i = g.length; i > h; h++) {
                    var j = b.call(this, g[h], h);
                    "undefined" != typeof j && e.push(j)
                }
                return "object" === a.type ? {
                    cols: d.cols,
                    rows: e
                } : ("array" === a.type && e.unshift(d[0]), e)
            }
            if ("arrobj" === a.type) {
                for (var d = this.toTable({
                        field: "id",
                        content: a.content,
                        status: a.status
                    }), k = [], l = d.shift(), f = 0, i = d.length; i > f; f++) {
                    for (var m = {}, n = d[f].length; n--;) m[l[n]] = d[f][n];
                    k.push(m)
                }
                return k
            }
            var o = "id" === a.field;
            if ("object" === a.type) var p = "number" == typeof this.value[0] || null === this.value[0] ? "number" : "string",
                q = function(a, b) {
                    var c = o && a || b || a;
                    F.push({
                        id: a,
                        label: c,
                        type: "string"
                    })
                },
                r = function(a, b, c) {
                    var d = o && "value" || a || "Value",
                        e = o && "status" || b || "Status";
                    c && F.push({
                        id: "status",
                        label: e,
                        type: "string"
                    }), F.push({
                        id: "value",
                        label: d,
                        type: p
                    })
                },
                s = function(a) {
                    U.push({
                        v: a
                    })
                },
                t = function(a) {
                    U.push({
                        v: a
                    }), G.push({
                        c: U
                    })
                };
            else var q = function(a, b) {
                    var c = o && a || b || a;
                    F.push(c)
                },
                r = function(a, b, c) {
                    var d = o && "value" || a || "Value",
                        e = o && "status" || b || "Status";
                    c && F.push(e), F.push(d), E.push(F)
                },
                s = function(a) {
                    U.push(a)
                },
                t = function(a) {
                    U.push(a), E.push(U)
                };
            var u = c.dimension,
                v = u.id,
                w = v.length,
                x = u.size;
            if (w != x.length) return !1;
            for (var y = [], z = 1, A = 1, B = [], C = [], D = [], E = [], F = [], G = [], f = 0; w > f; f++) {
                var H = v[f],
                    I = u[H].label;
                q(H, I), z *= x[f], A *= x[f];
                for (var J = [], n = 0; n < x[f]; n++)
                    for (var K in u[v[f]].category.index)
                        if (u[v[f]].category.index[K] === n) {
                            var L = "id" !== a.content && u[v[f]].category.label ? u[v[f]].category.label[K] : K;
                            J.push(L)
                        }
                y.push(J), B.push(A)
            }
            r(a.vlabel, a.slabel, a.status);
            for (var M = 0, i = y.length; i > M; M++) {
                for (var N = [], O = 0, P = y[M].length; P > O; O++)
                    for (var Q = 0; Q < z / B[M]; Q++) N.push(y[M][O]);
                C.push(N)
            }
            for (var M = 0, i = C.length; i > M; M++) {
                for (var R = [], S = 0, T = 0; z > T; T++) R.push(C[M][S]), S++, S === C[M].length && (S = 0);
                D.push(R)
            }
            for (var T = 0; z > T; T++) {
                for (var U = [], M = 0, i = C.length; i > M; M++) s(D[M][T]);
                a.status && s(this.status[T]), t(this.value[T])
            }
            return "object" === a.type ? {
                cols: F,
                rows: G
            } : E
        }, b.prototype.node = function() {
            return this.__tree__
        }, b.prototype.toString = function() {
            return this.type
        }, b.prototype.toValue = function() {
            return this.length
        }, JSONstat.jsonstat = b
    }();