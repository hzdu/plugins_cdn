! function(s, t) {
    PenciPCPlaylist = function(t, e, i) {
        var l = this;
        this.current = 0, this.loop = !1, this.shuffled = !1, this.removing = !1, this.cssSelector = s.extend({}, this._cssSelector, t), this.options = s.extend(!0, {
            keyBindings: {
                next: {
                    key: 221,
                    fn: function() {
                        l.next()
                    }
                },
                previous: {
                    key: 219,
                    fn: function() {
                        l.previous()
                    }
                },
                shuffle: {
                    key: 83,
                    fn: function() {
                        l.shuffle()
                    }
                }
            },
            stateClass: {
                shuffled: "jp-state-shuffled"
            }
        }, this._options, i), this.playlist = [], this.original = [], this._initPlaylist(e), l.current = this.options.playlistOptions.itemSelect, this.cssSelector.playlist = s(this.cssSelector.cssSelectorAncestor + " " + this.cssSelector.playlist), this.cssSelector.details = this.cssSelector.cssSelectorAncestor + " " + this.cssSelector.details, this.cssSelector.next = this.cssSelector.cssSelectorAncestor + " " + this.cssSelector.next, this.cssSelector.previous = this.cssSelector.cssSelectorAncestor + " " + this.cssSelector.previous, this.cssSelector.shuffle = this.cssSelector.cssSelectorAncestor + " " + this.cssSelector.shuffle, this.cssSelector.shuffleOff = this.cssSelector.cssSelectorAncestor + " " + this.cssSelector.shuffleOff, this.options.cssSelectorAncestor = this.cssSelector.cssSelectorAncestor, this.options.cssSelector = s.extend({}, this.cssSelector), delete this.options.cssSelector.cssSelectorAncestor, delete this.options.cssSelector.jPlayer, this.options.repeat = function(s) {
            l.loop = s.jPlayer.options.loop
        }, s(this.cssSelector.jPlayer).on(s.jPlayer.event.ready, (function() {
            l._init()
        })), s(this.cssSelector.jPlayer).on(s.jPlayer.event.ended, (function() {
            l.next()
        })), s(this.cssSelector.jPlayer).on(s.jPlayer.event.play, (function() {
            s(this).jPlayer("pauseOthers")
        })), s(this.cssSelector.jPlayer).on(s.jPlayer.event.resize, (function(t) {
            t.jPlayer.options.fullScreen ? s(l.cssSelector.details).show() : s(l.cssSelector.details).hide()
        })), s(this.cssSelector.previous).on("click", (function(s) {
            s.preventDefault(), l.previous(), l.blur(this)
        })), s(this.cssSelector.next).on("click", (function(s) {
            s.preventDefault(), l.next(), l.blur(this)
        })), s(this.cssSelector.shuffle).on("click", (function(t) {
            t.preventDefault(), l.shuffled && s(l.cssSelector.jPlayer).jPlayer("option", "useStateClassSkin") ? l.shuffle(!1) : l.shuffle(!0), l.blur(this)
        })), s(this.cssSelector.shuffleOff).on("click", (function(s) {
            s.preventDefault(), l.shuffle(!1), l.blur(this)
        })).hide(), this.options.fullScreen || s(this.cssSelector.details).hide(), this.cssSelector.playlist.find("ul").empty(), this._createItemHandlers(), s(this.cssSelector.jPlayer).jPlayer(this.options)
    }, PenciPCPlaylist.prototype = {
        _cssSelector: {
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1"
        },
        _options: {
            playlistOptions: {
                autoPlay: !1,
                loopOnPrevious: !1,
                shuffleOnLoop: !0,
                enableRemoveControls: !1,
                displayTime: "slow",
                addTime: "fast",
                removeTime: "fast",
                shuffleTime: "slow",
                itemClass: "pencipdc_playlist_item",
                freeGroupClass: "jp-free-media",
                freeItemClass: "pencipdc_playlist_item_free",
                removeItemClass: "pencipdc_playlist_item_remove"
            }
        },
        option: function(s, e) {
            if (e === t) return this.options.playlistOptions[s];
            switch (this.options.playlistOptions[s] = e, s) {
                case "enableRemoveControls":
                    this._updateControls();
                    break;
                case "itemClass":
                case "freeGroupClass":
                case "freeItemClass":
                case "removeItemClass":
                    this._refresh(!0), this._createItemHandlers()
            }
            return this
        },
        _init: function() {
            var t = this;
            s(this.cssSelector.jPlayer).data("PenciPCPlaylist", this), this._refresh((function() {
                t.options.playlistOptions.autoPlay ? t.play(t.current) : t.select(t.current)
            }))
        },
        _initPlaylist: function(t) {
            this.shuffled = !1, this.removing = !1, this.original = s.extend(!0, [], t), this._originalPlaylist(), 0 == this.original.length && s(this.cssSelector.jPlayer).jPlayer("clearMedia"), s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_playlist")
        },
        _originalPlaylist: function() {
            var t = this;
            this.playlist = [], s.each(this.original, (function(s) {
                t.playlist[s] = t.original[s]
            }))
        },
        _refresh: function(t) {
            var e = this;
            if (t && !s.isFunction(t)) this.cssSelector.playlist.find("ul").empty(), s.each(this.playlist, (function(s) {
                e.cssSelector.playlist.find("ul").append(e._createListItem(e.playlist[s]))
            })), this._updateControls(), s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_playlist");
            else {
                this.cssSelector.playlist.find("ul").children().length && this.options.playlistOptions.displayTime;
                this.cssSelector.playlist.find("ul").each((function() {
                    var i = s(this);
                    s(this).empty(), s.each(e.playlist, (function(s) {
                        i.append(e._createListItem(e.playlist[s]))
                    })), e._updateControls(), s.isFunction(t) && t(), e.playlist.length, s(this).show()
                })), s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_playlist"), s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_init")
            }
        },
        _createListItem: function(t) {
            var e = this,
                i = "<li><div>";
            if (i += "<a href='#' class='" + this.options.playlistOptions.removeItemClass + '\'><i title="" class="penciicon-close-button"></i></a>', t.free) {
                var l = !0;
                i += "<span class='" + this.options.playlistOptions.freeGroupClass + "'>(", s.each(t, (function(t, r) {
                    s.jPlayer.prototype.format[t] && (l ? l = !1 : i += " | ", i += "<a class='" + e.options.playlistOptions.freeItemClass + "' href='" + r + "' tabindex='-1'>" + t + "</a>")
                })), i += ")</span>"
            }
            return i += "<span class='" + this.options.playlistOptions.itemClass + "' tabindex='0'>" + t.title + (t.artist ? " <span class='jp-artist'>by " + t.artist + "</span>" : "") + "</span>", i += "</div></li>"
        },
        _createItemHandlers: function() {
            var t = this;
            this.cssSelector.playlist.off("click", "span." + this.options.playlistOptions.itemClass).on("click", "span." + this.options.playlistOptions.itemClass, (function(e) {
                e.preventDefault();
                var i = s(this).parent().parent().index();
                t.current !== i ? t.play(i) : s(t.cssSelector.jPlayer).jPlayer("play"), s(t.cssSelector.jPlayer).trigger("PenciPCPlaylist_play"), t.blur(this)
            })), this.cssSelector.playlist.off("click", "a." + this.options.playlistOptions.freeItemClass).on("click", "a." + this.options.playlistOptions.freeItemClass, (function(e) {
                e.preventDefault(), s(this).parent().parent().find("." + t.options.playlistOptions.itemClass).trigger("click"), t.blur(this)
            })), this.cssSelector.playlist.off("click", "a." + this.options.playlistOptions.removeItemClass).on("click", "a." + this.options.playlistOptions.removeItemClass, (function(e) {
                e.preventDefault();
                var i = s(this).parent().parent(),
                    l = i.index();
                i.hasClass("pencipdc_playlist_current") || (t.remove(l), t.blur(this), s(t.cssSelector.jPlayer).trigger("PenciPCPlaylist_playlist"))
            }))
        },
        _updateControls: function() {
            this.options.playlistOptions.enableRemoveControls ? this.cssSelector.playlist.find("." + this.options.playlistOptions.removeItemClass).show() : this.cssSelector.playlist.find("." + this.options.playlistOptions.removeItemClass).hide(), this.shuffled ? s(this.cssSelector.jPlayer).jPlayer("addStateClass", "shuffled") : s(this.cssSelector.jPlayer).jPlayer("removeStateClass", "shuffled"), s(this.cssSelector.shuffle).length && s(this.cssSelector.shuffleOff).length && (this.shuffled ? (s(this.cssSelector.shuffleOff).show(), s(this.cssSelector.shuffle).hide()) : (s(this.cssSelector.shuffleOff).hide(), s(this.cssSelector.shuffle).show()))
        },
        _highlight: function(s) {
            this.playlist.length && s !== t && (this.cssSelector.playlist.find(".pencipdc_playlist_current").removeClass("pencipdc_playlist_current"), this.cssSelector.playlist.find("li:nth-child(" + (s + 1) + ")").addClass("pencipdc_playlist_current").find(".pencipdc_playlist_item").addClass("pencipdc_playlist_current"))
        },
        setPlaylist: function(s) {
            s.forEach((function(s) {
                if (s.mp3.length < 1) {
                    var t = s.title.replace('<div class="item-song pencipdc_post_title">', '<div class="item-song pencipdc_post_title">,').split(",");
                    t.splice(1, 0, '<span><i class="fa fa-lock"></i></span>'), s.title = t.join("")
                }
            })), this._initPlaylist(s), this._init()
        },
        add: function(t, e) {
            if (t.mp3.length < 1) {
                var i = t.title.replace('<div class="item-song pencipdc_post_title">', '<div class="item-song pencipdc_post_title">,').split(",");
                i.splice(1, 0, '<span><i class="fa fa-lock"></i></span>'), t.title = i.join("")
            }
            this.cssSelector.playlist.find("ul").append(this._createListItem(t)).find("li:last-child"), this._updateControls(), this.original.push(t), this.playlist.push(t), s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_playlist"), e ? this.play(this.playlist.length - 1) : 1 === this.original.length && this.select(0)
        },
        remove: function(e) {
            var i = this;
            return e === t ? (this._initPlaylist([]), this._refresh((function() {
                s(i.cssSelector.jPlayer).jPlayer("clearMedia")
            })), !0) : !this.removing && (0 <= (e = e < 0 ? i.original.length + e : e) && e < this.playlist.length && (this.removing = !0, s(this.cssSelector.playlist[0]).find("li:nth-child(" + (e + 1) + ")").each((function() {
                if (i.shuffled) {
                    var t = i.playlist[e];
                    s.each(i.original, (function(s) {
                        if (i.original[s] === t) return i.original.splice(s, 1), !1
                    })), i.playlist.splice(e, 1)
                } else i.original.splice(e, 1), i.playlist.splice(e, 1);
                i.original.length ? e === i.current ? (i.current = e < i.original.length ? i.current : i.original.length - 1, i.select(i.current)) : e < i.current && i.current-- : (s(i.cssSelector.jPlayer).jPlayer("clearMedia"), i.current = 0, i.shuffled = !1, i._updateControls()), i.removing = !1
            })), this.cssSelector.playlist.find("li:nth-child(" + (e + 1) + ")").each((function() {
                s(this).remove()
            }))), !0)
        },
        select: function(t) {
            0 <= (t = t < 0 ? this.original.length + t : t) && t < this.playlist.length ? (this.current = t, this._highlight(t), s(this.cssSelector.jPlayer).jPlayer("setMedia", this.playlist[this.current])) : this.current = 0, s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_select")
        },
        play: function(e) {
            0 <= (e = e < 0 ? this.original.length + e : e) && e < this.playlist.length ? this.playlist.length && (this.select(e), s(this.cssSelector.jPlayer).jPlayer("play")) : e === t && s(this.cssSelector.jPlayer).jPlayer("play"), s(this.cssSelector.jPlayer).trigger("PenciPCPlaylist_play")
        },
        pause: function() {
            s(this.cssSelector.jPlayer).jPlayer("pause")
        },
        next: function() {
            var s = this.current + 1 < this.playlist.length ? this.current + 1 : 0;
            this.loop ? 0 === s && this.shuffled && this.options.playlistOptions.shuffleOnLoop && this.playlist.length > 1 ? this.shuffle(!0, !0) : this.play(s) : s > 0 && this.play(s)
        },
        previous: function() {
            var s = this.current - 1 >= 0 ? this.current - 1 : this.playlist.length - 1;
            (this.loop && this.options.playlistOptions.loopOnPrevious || s < this.playlist.length - 1) && this.play(s)
        },
        shuffle: function(e, i) {
            var l = this;
            e === t && (e = !this.shuffled), (e || e !== this.shuffled) && this.cssSelector.playlist.find("ul").each((function() {
                l.shuffled = e, e ? l.playlist.sort((function() {
                    return .5 - Math.random()
                })) : l._originalPlaylist(), l._refresh(!0), i || !s(l.cssSelector.jPlayer).data("jPlayer").status.paused ? l.play(0) : l.select(0), s(this).show()
            }))
        },
        blur: function(t) {
            s(this.cssSelector.jPlayer).jPlayer("option", "autoBlur") && s(t).trigger("blur")
        }
    }
}(jQuery);