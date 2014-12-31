/* ***** BEGIN LICENSE BLOCK *****
 * This file is part of DotClear.
 * Copyright (c) 2005 Nicolas Martin & Olivier Meunier and contributors. All
 * rights reserved.
 *
 * DotClear is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * DotClear is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DotClear; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * ***** END LICENSE BLOCK *****
*/
function addListener(b, a, c) {
    if (b.addEventListener) {
        b.addEventListener(a, c, false)
    } else {
        if (b.attachEvent) {
            b.attachEvent("on" + a, c)
        }
    }
}

function removeListener(b, a, c) {
    if (b.removeEventListener) {
        b.removeEventListener(a, c, false)
    } else {
        if (b.detachEvent) {
            b.detachEvent("on" + a, c)
        }
    }
}

function jsToolBar(b) {
    if (!document.createElement) {
        return
    }
    if (!b) {
        return
    }
    if ((typeof(document.selection) == "undefined") && (typeof(b.setSelectionRange) == "undefined")) {
        return
    }

    this.textarea = b;

    this.editor = document.createElement("div");
    this.editor.className = "jstEditor";

    this.textarea.parentNode.insertBefore(this.editor, this.textarea);
    this.editor.appendChild(this.textarea);

    this.toolbar = document.createElement("div");
    this.toolbar.className = "jstElements";
    this.editor.parentNode.insertBefore(this.toolbar, this.editor);

    this.handle = document.createElement("div");
    this.handle.className = "jstHandle";
    var a = this.resizeDragStart;
    var c = this;
    addListener(this.handle, "mousedown",
    function(d) {
        a.call(c, d)
    });
	// fix memory leak in Firefox (bug #241518)
    addListener(window, "unload",
    function() {
        var d = c.handle.parentNode.removeChild(c.handle);
        delete(c.handle)
    });
    this.editor.parentNode.insertBefore(this.handle, this.editor.nextSibling);
    this.context = null;
    this.toolNodes = {}
}
function jsButton(d, c, b, a) {
    this.title = d || null;
    this.fn = c ||
    function() {};
    this.scope = b || null;
    this.className = a || null
}
jsButton.prototype.draw = function() {
    if (!this.scope) {
        return null
    }
    var a = document.createElement("button");
    a.setAttribute("type", "button");
    if (this.className) {
        a.className = this.className
    }
    a.title = this.title;
    var b = document.createElement("span");
    b.appendChild(document.createTextNode(this.title));
    a.appendChild(b);
    if (this.icon != undefined) {
        a.style.backgroundImage = "url(" + this.icon + ")"
    }
    if (typeof(this.fn) == "function") {
        var c = this;
        a.onclick = function() {
            try {
                c.fn.apply(c.scope, arguments)
            } catch(d) {}
            return false
        }
    }
    return a
};
function jsSpace(a) {
    this.id = a || null;
    this.width = null
}
jsSpace.prototype.draw = function() {
    var a = document.createElement("span");
    if (this.id) {
        a.id = this.id
    }
    a.appendChild(document.createTextNode(String.fromCharCode(160)));
    a.className = "jstSpacer";
    if (this.width) {
        a.style.marginRight = this.width + "px"
    }
    return a
};
function jsCombo(e, a, d, c, b) {
    this.title = e || null;
    this.options = a || null;
    this.scope = d || null;
    this.fn = c ||
    function() {};
    this.className = b || null
}
jsCombo.prototype.draw = function() {
    if (!this.scope || !this.options) {
        return null
    }
    var a = document.createElement("select");
    if (this.className) {
        a.className = className
    }
    a.title = this.title;
    for (var d in this.options) {
        var b = document.createElement("option");
        b.value = d;
        b.appendChild(document.createTextNode(this.options[d]));
        a.appendChild(b)
    }
    var c = this;
    a.onchange = function() {
        try {
            c.fn.call(c.scope, this.value)
        } catch(f) {
            alert(f)
        }
        return false
    };
    return a
};
jsToolBar.prototype = {
    base_url: "",
    mode: "wiki",
    elements: {},
    getMode: function() {
        return this.mode
    },
    setMode: function(a) {
        this.mode = a || "wiki"
    },
    switchMode: function(a) {
        a = a || "wiki";
        this.draw(a)
    },
    button: function(d) {
        var c = this.elements[d];
        if (typeof c.fn[this.mode] != "function") {
            return null
        }
        var a = new jsButton(c.title, c.fn[this.mode], this, "jstb_" + d);
        if (c.icon != undefined) {
            a.icon = c.icon
        }
        return a
    },
    space: function(b) {
        var a = new jsSpace(b);
        if (this.elements[b].width !== undefined) {
            a.width = this.elements[b].width
        }
        return a
    },
    combo: function(f) {
        var b = this.elements[f];
        var e = b[this.mode].list.length;
        if (typeof b[this.mode].fn != "function" || e == 0) {
            return null
        } else {
            var a = {};
            for (var d = 0; d < e; d++) {
                var c = b[this.mode].list[d];
                a[c] = b.options[c]
            }
            return new jsCombo(b.title, a, this, b[this.mode].fn)
        }
    },
    draw: function(g) {
        this.setMode(g);
        while (this.toolbar.hasChildNodes()) {
            this.toolbar.removeChild(this.toolbar.firstChild)
        }
        this.toolNodes = {};
        var a,
        d,
        c;
        for (var e in this.elements) {
            a = this.elements[e];
            var f = a.type == undefined || a.type == "" || (a.disabled != undefined && a.disabled) || (a.context != undefined && a.context != null && a.context != this.context);
            if (!f && typeof this[a.type] == "function") {
                d = this[a.type](e);
                if (d) {
                    c = d.draw()
                }
                if (c) {
                    this.toolNodes[e] = c;
                    this.toolbar.appendChild(c)
                }
            }
        }
    },
    singleTag: function(b, a) {
        b = b || null;
        a = a || b;
        if (!b || !a) {
            return
        }
        this.encloseSelection(b, a)
    },
    encloseSelection: function(f, j, h) {
        this.textarea.focus();
        f = f || "";
        j = j || "";
        var a,
        d,
        c,
        b,
        i,
        g;
        if (typeof(document.selection) != "undefined") {
            c = document.selection.createRange().text
        } else {
            if (typeof(this.textarea.setSelectionRange) != "undefined") {
                a = this.textarea.selectionStart;
                d = this.textarea.selectionEnd;
                b = this.textarea.scrollTop;
                c = this.textarea.value.substring(a, d)
            }
        }
        if (c.match(/ $/)) {
            c = c.substring(0, c.length - 1);
            j = j + " "
        }
        if (typeof(h) == "function") {
            g = (c) ? h.call(this, c) : h("")
        } else {
            g = (c) ? c: ""
        }
        i = f + g + j;
        if (typeof(document.selection) != "undefined") {
            var e = document.selection.createRange().text = i;
            this.textarea.caretPos -= j.length
        } else {
            if (typeof(this.textarea.setSelectionRange) != "undefined") {
                this.textarea.value = this.textarea.value.substring(0, a) + i + this.textarea.value.substring(d);
                if (c) {
                    this.textarea.setSelectionRange(a + i.length, a + i.length)
                } else {
                    this.textarea.setSelectionRange(a + f.length, a + f.length)
                }
                this.textarea.scrollTop = b
            }
        }
    },
    stripBaseURL: function(a) {
        if (this.base_url != "") {
            var b = a.indexOf(this.base_url);
            if (b == 0) {
                a = a.substr(this.base_url.length)
            }
        }
        return a
    }
};
jsToolBar.prototype.resizeSetStartH = function() {
    this.dragStartH = this.textarea.offsetHeight + 0
};
jsToolBar.prototype.resizeDragStart = function(a) {
    var b = this;
    this.dragStartY = a.clientY;
    this.resizeSetStartH();
    addListener(document, "mousemove", this.dragMoveHdlr = function(c) {
        b.resizeDragMove(c)
    });
    addListener(document, "mouseup", this.dragStopHdlr = function(c) {
        b.resizeDragStop(c)
    })
};
jsToolBar.prototype.resizeDragMove = function(a) {
    this.textarea.style.height = (this.dragStartH + a.clientY - this.dragStartY) + "px"
};
jsToolBar.prototype.resizeDragStop = function(a) {
    removeListener(document, "mousemove", this.dragMoveHdlr);
    removeListener(document, "mouseup", this.dragStopHdlr)
};
jsToolBar.prototype.elements.strong = {
    type: "button",
    title: "Strong emphasis",
    fn: {
        wiki: function() {
            this.singleTag("__")
        },
        markdown: function() {
            this.singleTag("**")
        }
    }
};
jsToolBar.prototype.elements.em = {
    type: "button",
    title: "Emphasis",
    fn: {
        wiki: function() {
            this.singleTag("''")
        },
        markdown: function() {
            this.singleTag("*")
        }
    }
};
jsToolBar.prototype.elements.ins = {
    type: "button",
    title: "Inserted",
    fn: {
        wiki: function() {
            this.singleTag("++")
        },
        markdown: function() {
            this.singleTag("<ins>", "</ins>")
        }
    }
};
jsToolBar.prototype.elements.del = {
    type: "button",
    title: "Deleted",
    fn: {
        wiki: function() {
            this.singleTag("--")
        },
        markdown: function() {
            this.singleTag("<del>", "</del>")
        }
    }
};
jsToolBar.prototype.elements.quote = {
    type: "button",
    title: "Inline quote",
    fn: {
        wiki: function() {
            this.singleTag("{{", "}}")
        },
        markdown: function() {
            this.singleTag("<q>", "</q>")
        }
    }
};
jsToolBar.prototype.elements.code = {
    type: "button",
    title: "Code",
    fn: {
        wiki: function() {
            this.singleTag("@@")
        },
        markdown: function() {
            this.singleTag("`")
        }
    }
};
jsToolBar.prototype.elements.space1 = {
    type: "space"
};
jsToolBar.prototype.elements.br = {
	type: 'button',
	title: 'Line break',
	fn: {
		wiki: function() {
			this.encloseSelection('%%%'+"\n",'')
		},
        markdown: function() {
            this.encloseSelection('  '+"\n",'')
        }
	}
};
jsToolBar.prototype.elements.space2 = {
    type: "space"
};
jsToolBar.prototype.elements.ul = {
    type: "button",
    title: "Unordered list",
    fn: {
        wiki: function() {
            this.encloseSelection("", "",
            function(a) {
                a = a.replace(/\r/g, "");
                return "* " + a.replace(/\n/g, "\n* ")
            })
        },
        markdown: function() {
            this.encloseSelection('','',function(str) {
                str = str.replace(/\r/g,'');
                return '* '+str.replace(/\n/g,"\n* ");
            });
        }
    }
};
jsToolBar.prototype.elements.ol = {
    type: "button",
    title: "Ordered list",
    fn: {
        wiki: function() {
            this.encloseSelection("", "",
            function(a) {
                a = a.replace(/\r/g, "");
                return "# " + a.replace(/\n/g, "\n# ")
            })
        },
        markdown: function() {
            this.encloseSelection('','',function(str) {
                str = str.replace(/\r/g,'');
                return '1. '+str.replace(/\n/g,"\n1. ");
            });
        }
    }
};
jsToolBar.prototype.elements.pre = {
	type: 'button',
	title: 'Preformatted',
	fn: {
		wiki: function() {
			this.encloseSelection('','',function(a) {
				a = a.replace(/\r/g,'');
				return ' '+a.replace(/\n/g,"\n ");
			});
		},
        markdown: function() {
            this.encloseSelection("\n",'',
            function(str) {
                str = str.replace(/\r/g,'');
                return '    '+str.replace(/\n/g,"\n    ");
            });
        }
	}
};
jsToolBar.prototype.elements.bquote = {
	type: 'button',
	title: 'Block quote',
	fn: {
		wiki: function() {
			this.encloseSelection('','',function(a) {
				a = a.replace(/\r/g,'');
				return '> '+a.replace(/\n/g,"\n> ");
			});
		},
        markdown: function() {
            this.encloseSelection("\n",'',
            function(str) {
                str = str.replace(/\r/g,'');
                return '> '+str.replace(/\n/g,"\n> ");
            });
        }
	}
};
jsToolBar.prototype.elements.space3 = {
    type: "space"
};
jsToolBar.prototype.elements.link = {
    type: "button",
    title: "Link",
    fn: {},
    href_prompt: "Please give page URL:",
    hreflang_prompt: "Language of this page:",
    default_hreflang: "",
    prompt: function(b, a) {
        b = b || "";
        a = a || this.elements.link.default_hreflang;
        b = window.prompt(this.elements.link.href_prompt, b);
        if (!b) {
            return false
        }
        a = window.prompt(this.elements.link.hreflang_prompt, a);
        return {
            href: this.stripBaseURL(b),
            hreflang: a
        }
    }
};
jsToolBar.prototype.elements.link.fn.wiki = function() {
    var b = this.elements.link.prompt.call(this);
    if (b) {
        var c = "[";
        var a = "|" + b.href;
        if (b.hreflang) {
            a = a + "|" + b.hreflang
        }
        a = a + "]";
        this.encloseSelection(c, a)
    }
};
jsToolBar.prototype.elements.link.fn.markdown = function() {
    var link = this.elements.link.prompt.call(this);
    if (link) {
        var stag = '[';
        var etag = ']('+link.href;
        if (link.title) { etag = etag+' "'+link.title+'"'; }
        etag = etag+')';

        this.encloseSelection(stag,etag);
    }
};
