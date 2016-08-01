/*!

 Holder - client side image placeholders
 Version 2.6.0+51ebp
 © 2015 Ivan Malopinsky - http://imsky.co

 Site:     http://holderjs.com
 Issues:   https://github.com/imsky/holder/issues
 License:  http://opensource.org/licenses/MIT

 */
/*!
 * AnchorJS - v1.0.1 - 2015-05-15
 * https://github.com/bryanbraun/anchorjs
 * Copyright (c) 2015 Bryan Braun; Licensed MIT
 */
function AnchorJS(a) {
    "use strict";
    this.options = a || {}, this._applyRemainingDefaultOptions = function (a) {
        this.options.icon = this.options.hasOwnProperty("icon") ? a.icon : "&#xe9cb", this.options.visible = this.options.hasOwnProperty("visible") ? a.visible : "hover", this.options.placement = this.options.hasOwnProperty("placement") ? a.placement : "right", this.options["class"] = this.options.hasOwnProperty("class") ? a["class"] : ""
    }, this._applyRemainingDefaultOptions(a), this.add = function (a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o;
        if (this._applyRemainingDefaultOptions(this.options), a) {
            if ("string" != typeof a)throw new Error("The selector provided to AnchorJS was invalid.")
        } else a = "h1, h2, h3, h4, h5, h6";
        if (b = document.querySelectorAll(a), 0 === b.length)return !1;
        for (this._addBaselineStyles(), c = document.querySelectorAll("[id]"), d = [].map.call(c, function (a) {
            return a.id
        }), f = 0; f < b.length; f++) {
            if (b[f].hasAttribute("id"))e = b[f].getAttribute("id"); else {
                g = b[f].textContent, h = g.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "-").replace(/-{2,}/g, "-").substring(0, 32).replace(/^-+|-+$/gm, "").toLowerCase(), k = h, j = 0;
                do void 0 !== i && (k = h + "-" + j), i = d.indexOf(k), j += 1; while (-1 !== i);
                i = void 0, d.push(k), b[f].setAttribute("id", k), e = k
            }
            l = e.replace(/-/g, " "), m = '<a class="anchorjs-link ' + this.options["class"] + '" href="#' + e + '" aria-label="Anchor link for: ' + l + '" data-anchorjs-icon="' + this.options.icon + '"></a>', n = document.createElement("div"), n.innerHTML = m, o = n.childNodes, "always" === this.options.visible && (o[0].style.opacity = "1"), "&#xe9cb" === this.options.icon && (o[0].style.fontFamily = "anchorjs-icons", o[0].style.fontStyle = "normal", o[0].style.fontVariant = "normal", o[0].style.fontWeight = "normal"), "left" === this.options.placement ? (o[0].style.position = "absolute", o[0].style.marginLeft = "-1em", o[0].style.paddingRight = "0.5em", b[f].insertBefore(o[0], b[f].firstChild)) : (o[0].style.paddingLeft = "0.375em", b[f].appendChild(o[0]))
        }
        return this
    }, this.remove = function (a) {
        for (var b, c = document.querySelectorAll(a), d = 0; d < c.length; d++)b = c[d].querySelector(".anchorjs-link"), b && c[d].removeChild(b);
        return this
    }, this._addBaselineStyles = function () {
        if (null === document.head.querySelector("style.anchorjs")) {
            var a, b = document.createElement("style"), c = " .anchorjs-link {   opacity: 0;   text-decoration: none;   -webkit-font-smoothing: antialiased;   -moz-osx-font-smoothing: grayscale; }", d = " *:hover > .anchorjs-link, .anchorjs-link:focus  {   opacity: 1; }", e = ' @font-face {   font-family: "anchorjs-icons";   font-style: normal;   font-weight: normal;   src: url(data:application/x-font-ttf;charset=utf-8;base64,AAEAAAALAIAAAwAwT1MvMg8SBTUAAAC8AAAAYGNtYXAWi9QdAAABHAAAAFRnYXNwAAAAEAAAAXAAAAAIZ2x5Zgq29TcAAAF4AAABNGhlYWQEZM3pAAACrAAAADZoaGVhBhUDxgAAAuQAAAAkaG10eASAADEAAAMIAAAAFGxvY2EAKACuAAADHAAAAAxtYXhwAAgAVwAAAygAAAAgbmFtZQ5yJ3cAAANIAAAB2nBvc3QAAwAAAAAFJAAAACAAAwJAAZAABQAAApkCzAAAAI8CmQLMAAAB6wAzAQkAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAABAAADpywPA/8AAQAPAAEAAAAABAAAAAAAAAAAAAAAgAAAAAAADAAAAAwAAABwAAQADAAAAHAADAAEAAAAcAAQAOAAAAAoACAACAAIAAQAg6cv//f//AAAAAAAg6cv//f//AAH/4xY5AAMAAQAAAAAAAAAAAAAAAQAB//8ADwABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQAAAAAAAAAAAAIAADc5AQAAAAACADEARAJTAsAAKwBUAAABIiYnJjQ/AT4BMzIWFxYUDwEGIicmND8BNjQnLgEjIgYPAQYUFxYUBw4BIwciJicmND8BNjIXFhQPAQYUFx4BMzI2PwE2NCcmNDc2MhcWFA8BDgEjARQGDAUtLXoWOR8fORYtLTgKGwoKCjgaGg0gEhIgDXoaGgkJBQwHdR85Fi0tOAobCgoKOBoaDSASEiANehoaCQkKGwotLXoWOR8BMwUFLYEuehYXFxYugC44CQkKGwo4GkoaDQ0NDXoaShoKGwoFBe8XFi6ALjgJCQobCjgaShoNDQ0NehpKGgobCgoKLYEuehYXAAEAAAABAACiToc1Xw889QALBAAAAAAA0XnFFgAAAADRecUWAAAAAAJTAsAAAAAIAAIAAAAAAAAAAQAAA8D/wAAABAAAAAAAAlMAAQAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAACAAAAAoAAMQAAAAAACgAUAB4AmgABAAAABQBVAAIAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEADgAAAAEAAAAAAAIABwCfAAEAAAAAAAMADgBLAAEAAAAAAAQADgC0AAEAAAAAAAUACwAqAAEAAAAAAAYADgB1AAEAAAAAAAoAGgDeAAMAAQQJAAEAHAAOAAMAAQQJAAIADgCmAAMAAQQJAAMAHABZAAMAAQQJAAQAHADCAAMAAQQJAAUAFgA1AAMAAQQJAAYAHACDAAMAAQQJAAoANAD4YW5jaG9yanMtaWNvbnMAYQBuAGMAaABvAHIAagBzAC0AaQBjAG8AbgBzVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwYW5jaG9yanMtaWNvbnMAYQBuAGMAaABvAHIAagBzAC0AaQBjAG8AbgBzYW5jaG9yanMtaWNvbnMAYQBuAGMAaABvAHIAagBzAC0AaQBjAG8AbgBzUmVndWxhcgBSAGUAZwB1AGwAYQByYW5jaG9yanMtaWNvbnMAYQBuAGMAaABvAHIAagBzAC0AaQBjAG8AbgBzRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==) format("truetype"); }', f = " [data-anchorjs-icon]::after {   content: attr(data-anchorjs-icon); }";
            b.className = "anchorjs", b.appendChild(document.createTextNode("")), a = document.head.querySelector('[rel="stylesheet"], style'), void 0 === a ? document.head.appendChild(b) : document.head.insertBefore(b, a), b.sheet.insertRule(c, b.sheet.cssRules.length), b.sheet.insertRule(d, b.sheet.cssRules.length), b.sheet.insertRule(f, b.sheet.cssRules.length), b.sheet.insertRule(e, b.sheet.cssRules.length)
        }
    }
}

var anchors = new AnchorJS;
/*!
 * JavaScript for Bootstrap's docs (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see https://creativecommons.org/licenses/by/3.0/.
 */
!function (a) {
    "use strict";
    a(function () {
        var b = a(window), c = a(document.body);
        c.scrollspy({target: ".bs-docs-sidebar"}), b.on("load", function () {
            c.scrollspy("refresh")
        }), a(".bs-docs-container [href=#]").click(function (a) {
            a.preventDefault()
        }), setTimeout(function () {
            var b = a(".bs-docs-sidebar");
            b.affix({
                offset: {
                    top: function () {
                        var c = b.offset().top, d = parseInt(b.children(0).css("margin-top"), 10), e = a(".bs-docs-nav").height();
                        return this.top = c - e - d
                    }, bottom: function () {
                        return this.bottom = a(".bs-docs-footer").outerHeight(!0)
                    }
                }
            })
        }, 100), setTimeout(function () {
            a(".bs-top").affix()
        }, 100), function () {
            var b = a("#bs-theme-stylesheet"), c = a(".bs-docs-theme-toggle"), d = function () {
                b.attr("href", b.attr("data-href")), c.text("禁用主题预览"), localStorage.setItem("previewTheme", !0)
            };
            localStorage.getItem("previewTheme") && d(), c.click(function () {
                var a = b.attr("href");
                a && 0 !== a.indexOf("data") ? (b.attr("href", ""), c.text("主题预览"), localStorage.removeItem("previewTheme")) : d()
            })
        }()

    })
}(jQuery), function () {
    "use strict";
    anchors.options.placement = "left", anchors.add(".bs-docs-section > h1, .bs-docs-section > h2, .bs-docs-section > h3, .bs-docs-section > h4, .bs-docs-section > h5")
}();
