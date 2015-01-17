/*! Stellar.js v0.4.0 | Copyright 2012, Mark Dalgleish | http://markdalgleish.com/projects/stellar.js | http://markdalgleish.mit-license.org */
(function(e, t, n, r) {
    function d(t, n) {
        this.element = t, this.options = e.extend({}, s, n), this._defaults = s, this._name = i, this.init()
    }
    var i = "stellar",
        s = {
            scrollProperty: "scroll",
            positionProperty: "position",
            horizontalScrolling: !0,
            verticalScrolling: !0,
            horizontalOffset: 0,
            verticalOffset: 0,
            parallaxBackgrounds: !0,
            parallaxElements: !0,
            hideDistantElements: !0,
            viewportDetectionInterval: 1e4,
            hideElement: function(e) {
                e.hide()
            },
            showElement: function(e) {
                e.show()
            }
        },
        o = {
            scroll: {
                getTop: function(e) {
                    return e.scrollTop()
                },
                setTop: function(e, t) {
                    e.scrollTop(t)
                },
                getLeft: function(e) {
                    return e.scrollLeft()
                },
                setLeft: function(e, t) {
                    e.scrollLeft(t)
                }
            },
            position: {
                getTop: function(e) {
                    return parseInt(e.css("top"), 10) * -1
                },
                setTop: function(e, t) {
                    e.css("top", t)
                },
                getLeft: function(e) {
                    return parseInt(e.css("left"), 10) * -1
                },
                setLeft: function(e, t) {
                    e.css("left", t)
                }
            },
            margin: {
                getTop: function(e) {
                    return parseInt(e.css("margin-top"), 10) * -1
                },
                setTop: function(e, t) {
                    e.css("margin-top", t)
                },
                getLeft: function(e) {
                    return parseInt(e.css("margin-left"), 10) * -1
                },
                setLeft: function(e, t) {
                    e.css("margin-left", t)
                }
            },
            transform: {
                getTop: function(e) {
                    return e.css(a + "transform") !== "none" ? parseInt(e.css(a + "transform").match(/(-?[0-9]+)/g)[5], 10) * -1 : 0
                },
                setTop: function(e, t) {
                    h(e, t, "Y")
                },
                getLeft: function(e) {
                    return e.css(a + "transform") !== "none" ? parseInt(e.css(a + "transform").match(/(-?[0-9]+)/g)[4], 10) * -1 : 0
                },
                setLeft: function(e, t) {
                    h(e, t, "X")
                }
            }
        },
        u = {
            position: {
                setTop: function(e, t) {
                    e.css("top", t)
                },
                setLeft: function(e, t) {
                    e.css("left", t)
                }
            },
            transform: {
                setTop: function(e, t, n) {
                    h(e, t - n, "Y")
                },
                setLeft: function(e, t, n) {
                    h(e, t - n, "X")
                }
            }
        },
        a = function() {
            var t = "";
            return e.browser.webkit ? t = "-webkit-" : e.browser.mozilla ? t = "-moz-" : e.browser.opera ? t = "-o-" : e.browser.msie && (t = "-ms-"), t
        }(),
        f = n.createElement("div").style.backgroundPositionX !== r,
        l = function() {
            return f ? function(e, t, n) {
                e.css({
                    "background-position-x": t,
                    "background-position-y": n
                })
            } : function(e, t, n) {
                e.css("background-position", t + " " + n)
            }
        }(),
        c = function() {
            return f ? function(e) {
                return [e[0].style.backgroundPositionX, e[0].style.backgroundPositionY]
            } : function(e) {
                return e.css("background-position").split(" ")
            }
        }(),
        h = function(e, t, n) {
            var r = e.css(a + "transform");
            r === "none" ? e.css(a + "transform", "translate" + n + "(" + t + "px)") : e.css(a + "transform", p(r, /(-?[0-9]+[.]?[0-9]*)/g, n === "X" ? 5 : 6, t))
        },
        p = function(e, t, n, i) {
            var s, o, u;
            return e.search(t) === -1 ? e : (s = e.split(t), u = n * 2 - 1, s[u] === r ? e : (s[u] = i, s.join("")))
        };
    d.prototype = {
        init: function() {
            this.options.name = i + "_" + Math.floor(Math.random() * 1e4), this._defineElements(), this._defineGetters(), this._defineSetters(), this.refresh(), this._startViewportDetectionLoop(), this._startAnimationLoop()
        },
        _defineElements: function() {
            this.element === n.body && (this.element = t), this.$scrollElement = e(this.element), this.$element = this.element === t ? e("body") : this.$scrollElement, this.$viewportElement = this.options.viewportElement !== r ? e(this.options.viewportElement) : this.$scrollElement[0] === t || this.options.scrollProperty.indexOf("scroll") === 0 ? this.$scrollElement : this.$scrollElement.parent()
        },
        _defineGetters: function() {
            var e = this;
            this._getScrollLeft = function() {
                return o[e.options.scrollProperty].getLeft(e.$scrollElement)
            }, this._getScrollTop = function() {
                return o[e.options.scrollProperty].getTop(e.$scrollElement)
            }
        },
        _defineSetters: function() {
            var e = this;
            this._setScrollLeft = function(t) {
                o[e.options.scrollProperty].setLeft(e.$scrollElement, t)
            }, this._setScrollTop = function(t) {
                o[e.options.scrollProperty].setTop(e.$scrollElement, t)
            }, this._setLeft = function(t, n, r) {
                u[e.options.positionProperty].setLeft(t, n, r)
            }, this._setTop = function(t, n, r) {
                u[e.options.positionProperty].setTop(t, n, r)
            }
        },
        refresh: function() {
            var n = this,
                r = n._getScrollLeft(),
                i = n._getScrollTop();
            this._setScrollLeft(0), this._setScrollTop(0), this._setOffsets(), this._findParticles(), this._findBackgrounds(), navigator.userAgent.indexOf("WebKit") > 0 && e(t).load(function() {
                var e = n._getScrollLeft(),
                    t = n._getScrollTop();
                n._setScrollLeft(e + 1), n._setScrollTop(t + 1), n._setScrollLeft(e), n._setScrollTop(t)
            }), n._setScrollLeft(r), n._setScrollTop(i)
        },
        _findParticles: function() {
            var t = this,
                n = this._getScrollLeft(),
                i = this._getScrollTop();
            if (this.particles !== r)
                for (var s = this.particles.length - 1; s >= 0; s--) this.particles[s].$element.data("stellar-elementIsActive", r);
            this.particles = [];
            if (!this.options.parallaxElements) return;
            this.$element.find("[data-stellar-ratio]").each(function(n) {
                var i = e(this),
                    s, o, u, a, f, l, c, h, p, d = 0,
                    v = 0,
                    m = 0,
                    g = 0;
                if (!i.data("stellar-elementIsActive")) i.data("stellar-elementIsActive", this);
                else if (i.data("stellar-elementIsActive") !== this) return;
                t.options.showElement(i), i.data("stellar-startingLeft") ? (i.css("left", i.data("stellar-startingLeft")), i.css("top", i.data("stellar-startingTop"))) : (i.data("stellar-startingLeft", i.css("left")), i.data("stellar-startingTop", i.css("top"))), u = i.position().left, a = i.position().top, f = i.css("margin-left") === "auto" ? 0 : parseInt(i.css("margin-left"), 10), l = i.css("margin-top") === "auto" ? 0 : parseInt(i.css("margin-top"), 10), h = i.offset().left - f, p = i.offset().top - l, i.parents().each(function() {
                    var t = e(this);
                    if (t.data("stellar-offset-parent") === !0) return d = m, v = g, c = t, !1;
                    m += t.position().left, g += t.position().top
                }), s = i.data("stellar-horizontal-offset") !== r ? i.data("stellar-horizontal-offset") : c !== r && c.data("stellar-horizontal-offset") !== r ? c.data("stellar-horizontal-offset") : t.horizontalOffset, o = i.data("stellar-vertical-offset") !== r ? i.data("stellar-vertical-offset") : c !== r && c.data("stellar-vertical-offset") !== r ? c.data("stellar-vertical-offset") : t.verticalOffset, t.particles.push({
                    $element: i,
                    $offsetParent: c,
                    isFixed: i.css("position") === "fixed",
                    horizontalOffset: s,
                    verticalOffset: o,
                    startingPositionLeft: u,
                    startingPositionTop: a,
                    startingOffsetLeft: h,
                    startingOffsetTop: p,
                    parentOffsetLeft: d,
                    parentOffsetTop: v,
                    stellarRatio: i.data("stellar-ratio") !== r ? i.data("stellar-ratio") : 1,
                    width: i.outerWidth(!0),
                    height: i.outerHeight(!0),
                    isHidden: !1
                })
            })
        },
        _findBackgrounds: function() {
            var t = this,
                n = this._getScrollLeft(),
                i = this._getScrollTop(),
                s;
            this.backgrounds = [];
            if (!this.options.parallaxBackgrounds) return;
            s = this.$element.find("[data-stellar-background-ratio]"), this.$element.is("[data-stellar-background-ratio]") && s.add(this.$element), s.each(function() {
                var s = e(this),
                    o = c(s),
                    u, a, f, h, p, d, v, m, g, y = 0,
                    b = 0,
                    w = 0,
                    E = 0;
                if (!s.data("stellar-backgroundIsActive")) s.data("stellar-backgroundIsActive", this);
                else if (s.data("stellar-backgroundIsActive") !== this) return;
                s.data("stellar-backgroundStartingLeft") ? l(s, s.data("stellar-backgroundStartingLeft"), s.data("stellar-backgroundStartingTop")) : (s.data("stellar-backgroundStartingLeft", o[0]), s.data("stellar-backgroundStartingTop", o[1])), p = s.css("margin-left") === "auto" ? 0 : parseInt(s.css("margin-left"), 10), d = s.css("margin-top") === "auto" ? 0 : parseInt(s.css("margin-top"), 10), v = s.offset().left - p - n, m = s.offset().top - d - i, s.parents().each(function() {
                    var t = e(this);
                    if (t.data("stellar-offset-parent") === !0) return y = w, b = E, g = t, !1;
                    w += t.position().left, E += t.position().top
                }), u = s.data("stellar-horizontal-offset") !== r ? s.data("stellar-horizontal-offset") : g !== r && g.data("stellar-horizontal-offset") !== r ? g.data("stellar-horizontal-offset") : t.horizontalOffset, a = s.data("stellar-vertical-offset") !== r ? s.data("stellar-vertical-offset") : g !== r && g.data("stellar-vertical-offset") !== r ? g.data("stellar-vertical-offset") : t.verticalOffset, t.backgrounds.push({
                    $element: s,
                    $offsetParent: g,
                    isFixed: s.css("background-attachment") === "fixed",
                    horizontalOffset: u,
                    verticalOffset: a,
                    startingValueLeft: o[0],
                    startingValueTop: o[1],
                    startingBackgroundPositionLeft: isNaN(parseInt(o[0], 10)) ? 0 : parseInt(o[0], 10),
                    startingBackgroundPositionTop: isNaN(parseInt(o[1], 10)) ? 0 : parseInt(o[1], 10),
                    startingPositionLeft: s.position().left,
                    startingPositionTop: s.position().top,
                    startingOffsetLeft: v,
                    startingOffsetTop: m,
                    parentOffsetLeft: y,
                    parentOffsetTop: b,
                    stellarRatio: s.data("stellar-background-ratio") === r ? 1 : s.data("stellar-background-ratio")
                })
            })
        },
        destroy: function() {
            var t, n, r, i, s;
            for (s = this.particles.length - 1; s >= 0; s--) t = this.particles[s], n = t.$element.data("stellar-startingLeft"), r = t.$element.data("stellar-startingTop"), this._setLeft(t.$element, n, n), this._setTop(t.$element, r, r), this.options.showElement(t.$element), t.$element.data("stellar-startingLeft", null).data("stellar-elementIsActive", null).data("stellar-backgroundIsActive", null);
            for (s = this.backgrounds.length - 1; s >= 0; s--) i = this.backgrounds[s], l(i.$element, i.startingValueLeft, i.startingValueTop);
            this._animationLoop = e.noop, clearInterval(this._viewportDetectionInterval)
        },
        _setOffsets: function() {
            var n = this;
            e(t).unbind("resize.horizontal-" + this.name).unbind("resize.vertical-" + this.name), typeof this.options.horizontalOffset == "function" ? (this.horizontalOffset = this.options.horizontalOffset(), e(t).bind("resize.horizontal-" + this.name, function() {
                n.horizontalOffset = n.options.horizontalOffset()
            })) : this.horizontalOffset = this.options.horizontalOffset, typeof this.options.verticalOffset == "function" ? (this.verticalOffset = this.options.verticalOffset(), e(t).bind("resize.vertical-" + this.name, function() {
                n.verticalOffset = n.options.verticalOffset()
            })) : this.verticalOffset = this.options.verticalOffset
        },
        _repositionElements: function() {
            var e = this._getScrollLeft(),
                t = this._getScrollTop(),
                n, r, i, s, o, u, a, f = !0,
                c = !0,
                h, p, d, v, m;
            if (this.currentScrollLeft === e && this.currentScrollTop === t && this.currentWidth === this.viewportWidth && this.currentHeight === this.viewportHeight) return;
            this.currentScrollLeft = e, this.currentScrollTop = t, this.currentWidth = this.viewportWidth, this.currentHeight = this.viewportHeight;
            for (m = this.particles.length - 1; m >= 0; m--) i = this.particles[m], s = i.isFixed ? 1 : 0, this.options.horizontalScrolling && (h = (e + i.horizontalOffset + this.viewportOffsetLeft + i.startingPositionLeft - i.startingOffsetLeft + i.parentOffsetLeft) * -(i.stellarRatio + s - 1) + i.startingPositionLeft, d = h - i.startingPositionLeft + i.startingOffsetLeft), this.options.verticalScrolling && (p = (t + i.verticalOffset + this.viewportOffsetTop + i.startingPositionTop - i.startingOffsetTop + i.parentOffsetTop) * -(i.stellarRatio + s - 1) + i.startingPositionTop, v = p - i.startingPositionTop + i.startingOffsetTop), this.options.hideDistantElements && (c = !this.options.horizontalScrolling || d + i.width > (i.isFixed ? 0 : e) && d < (i.isFixed ? 0 : e) + this.viewportWidth + this.viewportOffsetLeft, f = !this.options.verticalScrolling || v + i.height > (i.isFixed ? 0 : t) && v < (i.isFixed ? 0 : t) + this.viewportHeight + this.viewportOffsetTop), c && f ? (i.isHidden && (this.options.showElement(i.$element), i.isHidden = !1), this.options.horizontalScrolling && this._setLeft(i.$element, h, i.startingPositionLeft), this.options.verticalScrolling && this._setTop(i.$element, p, i.startingPositionTop)) : i.isHidden || (this.options.hideElement(i.$element), i.isHidden = !0);
            for (m = this.backgrounds.length - 1; m >= 0; m--) o = this.backgrounds[m], s = o.isFixed ? 0 : 1, u = this.options.horizontalScrolling ? (e + o.horizontalOffset - this.viewportOffsetLeft - o.startingOffsetLeft + o.parentOffsetLeft - o.startingBackgroundPositionLeft) * (s - o.stellarRatio) + "px" : o.startingValueLeft, a = this.options.verticalScrolling ? (t + o.verticalOffset - this.viewportOffsetTop - o.startingOffsetTop + o.parentOffsetTop - o.startingBackgroundPositionTop) * (s - o.stellarRatio) + "px" : o.startingValueTop, l(o.$element, u, a)
        },
        _startViewportDetectionLoop: function() {
            var e = this,
                t = function() {
                    var t = e.$viewportElement.offset(),
                        n = t !== null && t !== r;
                    e.viewportWidth = e.$viewportElement.width(), e.viewportHeight = e.$viewportElement.height(), e.viewportOffsetTop = n ? t.top : 0, e.viewportOffsetLeft = n ? t.left : 0
                };
            t(), this._viewportDetectionInterval = setInterval(t, this.options.viewportDetectionInterval)
        },
        _startAnimationLoop: function() {
            var e = this,
                n = function() {
                    return t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame || function(e, n) {
                        t.setTimeout(e, 1e3 / 60)
                    }
                }();
            this._animationLoop = function() {
                n(e._animationLoop), e._repositionElements()
            }, this._animationLoop()
        }
    }, e.fn[i] = function(t) {
        var n = arguments;
        if (t === r || typeof t == "object") return this.each(function() {
            e.data(this, "plugin_" + i) || e.data(this, "plugin_" + i, new d(this, t))
        });
        if (typeof t == "string" && t[0] !== "_" && t !== "init") return this.each(function() {
            var r = e.data(this, "plugin_" + i);
            r instanceof d && typeof r[t] == "function" && r[t].apply(r, Array.prototype.slice.call(n, 1)), t === "destroy" && e.data(this, "plugin_" + i, null)
        })
    }, e[i] = function(n) {
        var r = e(t);
        return r.stellar.apply(r, Array.prototype.slice.call(arguments, 0))
    }, e[i].scrollProperty = o, e[i].positionProperty = u, t.Stellar = d
})(jQuery, window, document);