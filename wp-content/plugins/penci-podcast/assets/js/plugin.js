!function (e) {
    "use strict";
    var PENCI = PENCI || {};
    e((function () {
        PENCI.Player = PENCI.Player || {}, PENCI.Player = {
            set_storage: function (e, t) {
                var a = this.local_player_abstract;
                t = Object.assign(a, t);
                localStorage.setItem(e, JSON.stringify(t))
            },
            get_storage: function (e) {
                var t = localStorage.getItem(e);
                return null !== t && 0 < t.length ? JSON.parse(localStorage.getItem(e)) : {}
            },
            is_object_same: function (e, t) {
                var a = !0;
                return JSON.stringify(e) !== JSON.stringify(t) && (a = !1), a
            },
            init: function () {
                var t = this;
                t.now = new Date, t.expired_local_storage(), t.container = e("body"), t.tab_key = 1e4 * Math.random(), t.local_player_abstract = {
                    playing: !1,
                    current: 0,
                    current_time: 0,
                    volume: .7,
                    tab_key: t.tab_key,
                    playlist: [],
                    expired: t.now.getTime() + 432e5
                }, t.player_shortcode = t.container.find(".pencipdc_player"), t.control = t.player_shortcode.find(".pencipdc_player_controls_wrap"), t.local_player = Object.assign(t.local_player_abstract, t.get_storage(pencipodcast.player_option)), t.set_player(), t.set_event()
            },
            expired_local_storage: function () {
                var e = this.get_storage(pencipodcast.player_option);
                "undefined" !== e.expired && e.expired < this.now.getTime() && localStorage.removeItem(pencipodcast.player_option)
            },
            set_player: function () {
                var t = this;
                t.player_shortcode.each((function (a, s) {
                    var o = e(s),
                        l = o.find(".pencipdc_jplayer"),
                        i = o.find(".pencipdc_audio"),
                        n = o.parents(".pencipdc_dock_player").hasClass("pencipdc_podcast"),
                        r = o.find(".pencipdc_player_playlist_script"),
                        _ = t.container.find(".jscroll-to-top"),
                        p = t.container.find(".pencipdc_popup_post"),
                        d = r.length > 0 && r.html().length > 0,
                        c = n ? t.local_player.playlist : d ? [t.podcast_data(JSON.parse(r.html()))] : [],
                        u = n && null != t.local_player.current ? t.local_player.current : 0,
                        g = n && null != t.local_player.volume ? t.local_player.volume : .7,
                        y = "#" + i[0].id,
                        f = {
                            jPlayer: "#" + l[0].id,
                            cssSelectorAncestor: y,
                            play: ".pencipdc_player_control__play",
                            pause: ".pencipdc_player_control__pause",
                            stop: ".pencipdc_player_control__stop",
                            seekBar: ".pencipdc_progress_bar__seek",
                            playBar: ".pencipdc_progress_bar__play",
                            mute: ".pencipdc_player_control__mute",
                            unmute: ".pencipdc_player_control__unmute",
                            volumeBar: ".pencipdc_volume_bar",
                            volumeBarValue: ".pencipdc_volume_bar__value",
                            volumeMax: ".pencipdc_volume_max",
                            currentTime: ".pencipdc_player_bar__current_time span",
                            duration: ".pencipdc_player_bar__duration span",
                            title: ".pencipdc_title",
                            repeat: ".pencipdc_player_control__repeat",
                            repeatOff: ".pencipdc_player_control__repeat_off",
                            noSolution: ".pencipdc_no_solution",
                            playlist: ".pencipdc_playlist," + y + " .pencipdc_player_control__playlist",
                            next: ".pencipdc_player_control__next",
                            previous: ".pencipdc_player_control__previous",
                            shuffle: ".pencipdc_player_control__shuffle",
                            shuffleOff: ".pencipdc_player_control__shuffle_off"
                        };
                    if (new PenciPCPlaylist(f, c, {
                        swfPath: pencipodcast.plugin_url + "/assets/js/jplayer/",
                        supplied: "mp3",
                        wmode: "window",
                        smoothPlayBar: !1,
                        keyEnabled: !0,
                        minPlaybackRate: .1,
                        maxPlaybackRate: 16,
                        volume: g,
                        playlistOptions: {
                            itemSelect: u
                        }
                    }), n) {
                        _.css({
                            bottom: "90px"
                        }), p.css({
                            bottom: "140px"
                        }), t.set_body_padding();
                        var h = e("#" + l.attr("id"));
                        "undefined" != typeof single_podcast_data && h.on("PenciPCPlaylist_init", (function () {
                            c.length < 1 && t.add_episode(single_podcast_data, h)
                        }))
                    }
                }))
            },
            set_event: function () {
                var t, a = this,
                    s = a.player_shortcode.find(".pencipdc_progress_bar__seek"),
                    o = a.player_shortcode.find(".pencipdc_volume_bar"),
                    l = a.player_shortcode.find(".pencipdc_mobile_player_wrapper"),
                    i = a.control.find(".pencipdc_player_control__toggle_player"),
                    n = i.find("i"),
                    r = l.find(".pencipdc_player_control__close_player"),
                    _ = a.container.find(".pencipdc_navbar_mobile"),
                    p = a.container.find(".pencipdc_header"),
                    d = a.player_shortcode.parents(".pencipdc_sidecontent .pencipdc_podcast.pencipdc_dock_player.pencipdc_dock_player");
                window.addEventListener("mouseover", function (e) {
                    if (a.player_shortcode.parents(".pencipdc_dock_player").hasClass("pencipdc_podcast")) {
                        var t = a.get_storage(pencipodcast.player_option);
                        a.set_current_tab_key(a.tab_key, t)
                    }
                }.bind(a)), window.addEventListener("storage", function (e) {
                    a.global_player(e)
                }.bind(a)), s.add(o).on("touchstart mousedown", (function (s) {
                    var o = "touchstart" === s.type ? s.originalEvent.targetTouches[0].pageX : s.pageX;
                    (t = e(this).find(".pencipdc_progress_bar__ball")).addClass("ball_touched"), a.dragged = !0, a.current_dragged_bar = e(this), a.set_draggable_bar(a.current_dragged_bar, o)
                })), e(document).on("touchend mouseup", (function (s) {
                    if (void 0 !== t ? t.removeClass("ball_touched") : (t = e(this).find(".pencipdc_progress_bar__ball")).removeClass("ball_touched"), a.dragged) {
                        var o = "touchend" === s.type ? s.originalEvent.changedTouches[0].pageX : s.pageX;
                        a.dragged = !1, a.set_draggable_bar(a.current_dragged_bar, o)
                    }
                })), e(document).on("touchmove mousemove", (function (e) {
                    if (a.dragged) {
                        var t = "touchmove" === e.type ? e.originalEvent.touches[0].pageX : e.pageX;
                        a.set_draggable_bar(a.current_dragged_bar, t)
                    }
                })), a.player_shortcode.find(".pencipdc_player_control__playlist_toggle").on("click", (function (t) {
                    t.preventDefault(), t.stopPropagation();
                    var a = e(this),
                        s = e(t.target);

                    "click" == t.type && a.find(t.target).parents(".pencipdc_player_control__playlist_inner").length < 1 && !s.hasClass("penciicon-close-button") && a.find(".pencipdc_player_control__playlist").toggleClass("show")

                })), e(document).on("click", (function (e) {
                    a.player_shortcode.find(".pencipdc_player_control__playlist").removeClass("show")
                })), a.player_shortcode.on("jPlayer_ready", (function (t) {
                    a.switch_song(e(this)), a.refresh_playlist(e(this))
                })), a.player_shortcode.on("PenciPCPlaylist_select PenciPCPlaylist_playlist", (function (t) {
                    a.switch_song(e(this))
                })), a.player_shortcode.on("PenciPCPlaylist_play PenciPCPlaylist_select PenciPCPlaylist_playlist PenciPCPlaylist_currentTime jPlayer_play jPlayer_pause jPlayer_timeupdate jPlayer_volumechange", (function (t) {
                    a.update_status(e(this), t)
                })), i.on("click", (function (e) {
                    e.preventDefault(), n.hasClass("fa-angle-up") ? (n.addClass("fa-angle-down").removeClass("fa-angle-up"), l.css({
                        transform: "translateY(0)"
                    }), d.css({
                        "z-index": "999"
                    }), _.css({
                        display: "none"
                    }), p.css({
                        position: "fixed"
                    })) : n.addClass("fa-angle-up").removeClass("fa-angle-down")
                })), r.on("click", (function () {
                    l.css({
                        transform: "translateY(100%)"
                    }), d.css({
                        "z-index": "3"
                    }), n.addClass("fa-angle-up").removeClass("fa-angle-down"), _.css({
                        display: "block"
                    }), p.css({
                        position: "relative"
                    })
                }))
            },
            set_draggable_bar: function (e, t) {
                if (e) {
                    var a = e.offset(),
                        s = e.width(),
                        o = e.parents(".audio_player").find(".pencipdc_jplayer"),
                        l = 100 * (t - a.left) / s;
                    if (e.hasClass("pencipdc_progress_bar__seek")) {
                        var i = e.find(".pencipdc_progress_bar__play"),
                            n = o.jPlayer.duration;
                        l < 0 && (l = 0), l > 100 && (l = 100), o.jPlayer("playHead", l), o.jPlayer.currentTime = n * l / 100, o.trigger("PenciPCPlaylist_currentTime")
                    }
                    if (e.hasClass("pencipdc_volume_bar")) {
                        i = e.find(".pencipdc_volume_bar__value");
                        (l = 100 * (t - a.left) / s) < 0 && (l = 0), l > 100 && (l = 100), o.jPlayer("volume", l / 100)
                    }
                    i.css("width", l + "%")
                }
            },
            switch_song: function (t) {
                var a, s, o, l = t.find(".pencipdc_audio");
                l.find(".pencipdc_player_control__previous, .pencipdc_player_control__next").removeClass("disabled"), l.find(".pencipdc_progress_bar__ball").on("click", (function () {
                    e(this).trigger("focus")
                })), l.find(".pencipdc_playlist ul li:last-child").hasClass("pencipdc_playlist_current") && l.find(".pencipdc_player_control__next").addClass("disabled"), l.find(".pencipdc_playlist ul li:first-child").hasClass("pencipdc_playlist_current") && l.find(".pencipdc_player_control__previous").addClass("disabled"), s = (a = l.find(".pencipdc_playlist ul li.pencipdc_playlist_current .pencipdc_playlist_item")).length > 0 ? a.find(".item-cover").html() : "", o = a.length > 0 ? a.find(".item-song").html() : "-", l.find(".pencipdc_player_current_item__cover").html(s), l.find(".pencipdc_player_current_item__title span").html(o)
            },
            refresh_playlist: function (e) {
                var t = e.find(".pencipdc_audio");
                t.find(".pencipdc_player_control__playlist_inner").html(t.find(".pencipdc_playlist ul").html());
            },
            do_ajax: function (t, a) {
                var s, o = this,
                    l = a.parents(".pencipdc_media_option"),
                    i = l.hasClass("podcast"),
                    n = i ? "get_episode_data_by_series" : "get_episode_data",
                    r = l.data("id");
                if (o.player_shortcode.each((function (t, a) {
                    var o = e(a),
                        l = o.find(".pencipdc_jplayer");
                    o.parents(".pencipdc_dock_player").hasClass("pencipdc_podcast") && (s = e("#" + l.attr("id")))
                })), "play" === t.type || "add_queue" === t.type) return e.ajax({
                    url: pencipodcast.ajax_url,
                    type: "post",
                    dataType: "json",
                    data: {
                        post_id: r,
                        action: n
                    },
                    success: function (e) {
                        if (e) switch (t.type) {
                            case "play":
                                if (i) {
                                    o.play_series(e, s);
                                    break
                                }
                                o.play_episode(e, s);
                                break;
                            case "add_queue":
                                if (i) {
                                    o.add_episode_by_series(e, s);
                                    break
                                }
                                o.add_episode(e, s)
                        }
                    }
                })
            },
            play_episode: function (e, t) {
                var a, s = t.data("PenciPCPlaylist"),
                    o = s.playlist,
                    l = this.podcast_data(e);
                (a = o.findIndex((e => e.title === l.title))) > -1 ? s.play(a) : s.add(l, !0)
            },
            play_series: function (e, t) {
                var a = this,
                    s = [],
                    o = t.data("PenciPCPlaylist");
                e.forEach((function (e) {
                    s.push(a.podcast_data(e))
                })), o.setPlaylist(s), o.play(0)
            },
            add_episode_by_series: function (e, t) {
                var a, s = this,
                    o = t.data("PenciPCPlaylist"),
                    l = o.playlist;
                e.forEach((function (e) {
                    a = s.podcast_data(e), -1 == l.findIndex((e => e.title === a.title)) && o.add(a)
                }))
            },
            add_episode: function (e, t) {
                var a = t.data("PenciPCPlaylist"),
                    s = a.playlist,
                    o = this.podcast_data(e);
                -1 == s.findIndex((e => e.title === o.title)) && a.add(o)
            },
            podcast_data: function (e) {
                var t = e.post_thumbnail,
                    a = e.series_name,
                    s = e.upload,
                    o = e.post_title,
                    l = '<a title="' + e.post_title + '" href="' + e.post_url + '">' + o + "</a>";
                return {
                    title: '<div class="item-cover"><img src="' + t + '"  alt="' + e.post_title + '" /></div><div class="item-title_wrapper"><div class="item-song pencipdc_post_title">' + l + '</div><div class="item-artist pencipdc_post_meta">' + a + "</div></div>",
                    itunes: "",
                    amazon: "",
                    buy: "",
                    download: s,
                    mp3: s
                }
            },
            update_status: function (e, t) {
                if ("jPlayer_play" == t.type || "jPlayer_pause" == t.type || "PenciPCPlaylist_play" == t.type || "PenciPCPlaylist_select" == t.type || "PenciPCPlaylist_playlist" == t.type || "PenciPCPlaylist_currentTime" == t.type || "jPlayer_timeupdate" == t.type || "jPlayer_volumechange" == t.type) {
                    var a = this,
                        s = e.parents(".pencipdc_dock_player"),
                        o = s.hasClass("pencipdc_podcast"),
                        l = a.get_storage(pencipodcast.player_option),
                        i = a.container.find(".jscroll-to-top");
                    if (o) {
                        var n = e.find(".pencipdc_jplayer"),
                            r = n.data("jPlayer"),
                            _ = n.data("PenciPCPlaylist"),
                            p = _.current,
                            d = _.playlist;
                        r.status.paused || (l.current_time = r.status.currentTime, a.set_storage(pencipodcast.player_option, l)), "PenciPCPlaylist_playlist" == t.type && (void 0 !== a.remove_player_timeout && clearTimeout(a.remove_player_timeout), 0 == _.playlist.length ? (a.remove_player_timeout = setTimeout((function () {
                            s.removeClass("show")
                        }), 1e3), i.css({
                            bottom: "30px"
                        }), a.set_body_padding()) : (i.css({
                            bottom: "90px"
                        }), s.addClass("show"), a.set_body_padding())), void 0 === l.tab_key && a.set_current_tab_key(a.tab_key, l), l.tab_key == a.tab_key && ("PenciPCPlaylist_play" == t.type && (l.playing = !0, a.set_current_status(p, l)), "PenciPCPlaylist_playlist" == t.type && (a.set_current_status(p, l), a.set_current_playlist(d, l)), "PenciPCPlaylist_select" == t.type && a.set_current_status(p, l), "PenciPCPlaylist_currentTime" == t.type && a.set_current_time(r.status.currentTime, l), "jPlayer_volumechange" == t.type && a.set_current_volume(r.options.volume, l), "jPlayer_play" != t.type && "jPlayer_pause" != t.type || ("jPlayer_play" == t.type && (l.playing = !1, a.set_storage(pencipodcast.player_option, l), l.playing = !0), "jPlayer_pause" == t.type && (l.playing = !0, a.set_storage(pencipodcast.player_option, l), l.playing = !1), a.set_storage(pencipodcast.player_option, l)))
                    }
                }
            },
            set_current_tab_key: function (e, t) {
                t.tab_key = e, this.set_storage(pencipodcast.player_option, t)
            },
            set_current_status: function (e, t) {
                t.current = e, this.set_storage(pencipodcast.player_option, t)
            },
            set_current_time: function (e, t) {
                t.current_time = e, this.set_storage(pencipodcast.player_option, t)
            },
            set_current_volume: function (e, t) {
                t.volume = e, this.set_storage(pencipodcast.player_option, t)
            },
            set_current_playlist: function (e, t) {
                t.playlist = e, this.set_storage(pencipodcast.player_option, t)
            },
            global_player: function (t) {
                if (t.key === pencipodcast.player_option) {
                    var a, s, o, l, i = this,
                        n = Object.assign({}, i.local_player_abstract),
                        r = Object.assign({}, i.local_player_abstract),
                        _ = JSON.parse(t.newValue),
                        p = JSON.parse(t.oldValue);
                    _ = null === _ ? i.local_player_abstract : Object.assign(n, _), p = null === p ? i.local_player_abstract : Object.assign(r, p), o = _.current !== p.current, a = _.playing !== p.playing, l = _.volume !== p.volume, s = !i.is_object_same(_.playlist, p.playlist), i.player_shortcode.each((function (t, n) {
                        var r = e(n),
                            p = r.parents(".pencipdc_dock_player").hasClass("pencipdc_podcast"),
                            d = navigator.userAgent.toLowerCase(),
                            c = !1;
                        if (-1 !== d.indexOf("safari") && (c = !(d.indexOf("chrome") > -1)), p) {
                            var u = r.find(".pencipdc_jplayer"),
                                g = u.find("audio"),
                                y = u.data("jPlayer"),
                                f = u.data("PenciPCPlaylist"),
                                h = i.is_object_same(i.local_player.playlist, _.playlist),
                                m = i.is_object_same(i.local_player.current, _.current),
                                j = i.is_object_same(i.local_player.volume, _.volume),
                                v = _.current_time / y.status.duration * 100;
                            c || u.jPlayer("playHead", v), u.jPlayer.currentTime = _.current_time, i.tab_key != _.tab_key && (l && null !== _.volume && (j || u.jPlayer("volume", _.volume)), o && null !== _.current && (m || f.select(_.current)), s && (h || f.setPlaylist(_.playlist)), a && _.playing && g.trigger("pause"))
                        }
                    }))
                }
            },
            set_body_padding: function () {
                var e = this;
                e.viewport = e.container.find(".pencipdc_viewport"), e.dock_player = e.container.find(".pencipdc_dock_player"), e.dock_player.length && e.dock_player.hasClass("show") ? e.viewport.addClass("pencipdc_has_player") : e.viewport.removeClass("pencipdc_has_player")
            }
        }, PENCI.Player.init()
    }));
    var t = function (e, t) {
        this.element = e, this.module = t
    };
    t.prototype.init = function () {
        return this.inject_event(), this
    }, t.prototype.inject_event = function () {
        var t = e("body");
        this.media_option = e(this.element).find(".pencipdc_media_option"), this.play_button = this.media_option.find(".pencipdc_media_button.play"), this.more_button = this.media_option.find(".pencipdc_media_button.more"), this.add_to_queue = this.media_option.find(".add_to_queue"), this.meta_share = this.media_option.find(".pencipdc_meta_share"), this.global_more_button = t.find(".pencipdc_media_button.more"), this.global_meta_share = t.find(".pencipdc_meta_share"), this.media_option_event()
    }, t.prototype.media_option_event = function () {
        var t = this,
            a = e(window),
            s = "ontouchstart" in window,
            o = s ? "click" : "mouseenter";
        a.on("click", function (a) {
            if (null !== a.toElement && void 0 !== a.toElement && e(a.toElement.nextElementSibling).hasClass("pencipdc_sharelist_podcast")) return !1;
            t.global_more_button.removeClass("active")
        }.bind(t)), t.meta_share.off(o).on(o, (function (o) {
            var l = e(o.currentTarget),
                i = l.find(".pencipdc_sharelist_podcast"),
                n = l.parent().closest(".pencipdc_moreoption").offset(),
                r = l.parent().closest(".pencipdc_moreoption").position(),
                _ = l.parent().closest(".pencipdc_moreoption").outerWidth(),
                p = l.parent().closest(".pencipdc_moreoption").outerHeight() - l.outerHeight();
            if (l.parents("[class*=pencipdc_postblock_podcast_]:not(.pencipdc_postblock_podcast_4)").length || l.parents("[class*=pencipdc_postblock_episode_]:not(.pencipdc_postblock_episode_list):not(.pencipdc_postblock_episode_detail)").length) var d = o.clientX + (l.outerWidth() + i.outerWidth()) > a.width() ? l.offset().left + (o.clientX - n.left) + (l.outerWidth() + i.outerWidth()) + 20 - a.width() : 0,
                c = o.clientY + i.outerHeight() > a.height() ? a.height() + (r.top + i.outerHeight()) - a.height() : 0;
            else if (n.left || r.top) d = n.left + (l.outerWidth() + i.outerWidth()) > a.width() ? n.left + (l.outerWidth() + i.outerWidth()) + 20 - a.width() : 0, c = r.top + i.outerHeight() > a.height() ? a.height() - (r.top + i.outerHeight()) : 0;
            if (_ = 0 === d ? _ : "-" + _ + "px", p = c < 0 ? p - 10 + c : p - 10, i.css({
                left: _,
                top: p,
                opacity: 0,
                right: "auto"
            }).animate({
                opacity: 1
            }, 100), s && l.hasClass("active")) return l.removeClass("active"), !1;
            t.global_meta_share.removeClass("active"), l.addClass("active").show()
        })).off("mouseleave").on("mouseleave", (function () {
            s || t.global_meta_share.removeClass("active")
        })), t.more_button.off("click").on("click", (function (s) {
            s.preventDefault(), s.stopPropagation();
            var o = e(s.currentTarget),
                l = o.siblings(".pencipdc_moreoption"),
                i = s.target.getBoundingClientRect();
            if (o.parents("[class*=pencipdc_postblock_podcast_]:not(.pencipdc_postblock_podcast_4)").length || o.parents("[class*=pencipdc_postblock_episode_]:not(.pencipdc_postblock_episode_list):not(.pencipdc_postblock_episode_detail)").length) {
                var n = o.parents(".pencipdc_block_container");
                if (i.left || i.top) {
                    var r = o.offset().left - n.offset().left + (s.clientX - i.left),
                        _ = o.offset().top - n.offset().top + o.outerHeight();
                    r -= p = s.clientX + l.outerWidth() > a.width() ? o.offset().left + (s.clientX - i.left) + l.outerWidth() + 20 - a.width() : 0, _ -= d = s.clientY + l.outerHeight() > a.height() ? a.height() + l.outerHeight() - a.height() : 0, l.css({
                        left: r,
                        top: _,
                        opacity: 0,
                        right: "auto"
                    }).animate({
                        opacity: 1
                    }, 100)
                }
            } else if (i.left || i.top) {
                r = o.outerWidth() + (s.clientX - i.left), _ = o.outerHeight();
                var p = s.clientX + l.outerWidth() > a.width() ? o.offset().left + (s.clientX - i.left) + l.outerWidth() - a.width() : 0,
                    d = s.clientY + (_ + l.height()) > a.height() ? a.height() + (_ + l.height()) - a.height() : 0;
                (o.parents(".pencipdc_postblock_episode_list").length > 0 || o.parents(".pencipdc_postblock_episode_detail").length > 0) && (r = o.position().left, _ = o.position().top + o.outerHeight()), r -= p, _ -= d, l.css({
                    left: r,
                    top: _,
                    opacity: 0,
                    right: "auto"
                }).animate({
                    opacity: 1
                }, 100)
            }
            if (o.hasClass("active")) return o.removeClass("active"), !1;
            t.global_more_button.removeClass("active"), o.addClass("active").show()
        })).on(t), t.play_button.on("click", (function (t) {
            t.preventDefault(), t.stopPropagation();
            var a = e(this);
            a.addClass("loading");
            var s = PENCI.Player.do_ajax({
                type: "play"
            }, e(this));
            null !== s ? s.done((function () {
                a.removeClass("loading")
            })) : a.removeClass("loading")
        })).on(t), t.add_to_queue.on("click", (function (t) {
            t.preventDefault(), t.stopPropagation();
            var a = e(this);
            a.addClass("loading");
            var s = PENCI.Player.do_ajax({
                type: "add_queue"
            }, e(this));
            null !== s ? s.done((function () {
                a.removeClass("loading")
            })) : a.removeClass("loading")
        })).on(t)
    }, e(".penci-item-listp, .pencipdc-item").each(function (a, s) {
        var o = new t(this, s).init();
        e(this).data("podcast", o)
    }).on("pencipdc_module_ajax", (function () {
        e(this).data("podcast").inject_event()
    })), e((function () {
        var t = e("body"),
            a = {
                init: function () {
                    this.container = e(".post-entry .inner-post-entry"), this.meta_share = this.container.find(".pencipdc_meta_share"), this.container.length && this.event()
                },
                event: function () {
                    var t = this;
                    t.window = e(window), t.window.on("click", (function () {
                        t.meta_share.removeClass("loading").removeClass("active")
                    })), t.meta_share.off("click").on("click", (function (t) {
                        t.preventDefault(), t.stopPropagation();
                        var a = e(t.currentTarget);
                        if (a.hasClass("active")) return a.removeClass("active"), !1;
                        a.removeClass("loading").addClass("active")
                    }))
                }
            };
        if (t.hasClass("single-podcast") && t.hasClass("pencipdc_global_player")) {
            var s = t.find(".inner-post-entry").find(".pencipdc_media_option.single_episode");
            if (s.length) {
                var o = s.find(".pencipdc_media_button.play"),
                    l = s.find(".add_to_queue");
                o.on("click", (function (t) {
                    t.preventDefault(), t.stopPropagation();
                    var a = e(this);
                    a.addClass("loading");
                    var s = PENCI.Player.do_ajax({
                        type: "play"
                    }, e(this));
                    null !== s ? s.done((function () {
                        a.removeClass("loading")
                    })) : a.removeClass("loading")
                })), l.on("click", (function (t) {
                    t.preventDefault(), t.stopPropagation();
                    var a = e(this),
                        s = a.parents(".pencipdc_media_option");
                    a.addClass("loading");
                    var o = PENCI.Player.do_ajax({
                        type: "add_queue"
                    }, e(this));
                    if (a.trigger("blur"), null !== o) o.done((function (t) {
                        if (t) {
                            var o = e('<span class="pcpdc_added_queue" style="display:none">' + pencipodcast.lang.added_queue + "</span>");
                            s.append(o), o.fadeIn(), a.addClass("success"), a.removeClass("loading")
                        } else {
                            o = e('<span class="pcpdc_added_queue" style="display:none">' + pencipodcast.lang.failed + "</span>");
                            s.append(o), o.fadeIn(), a.addClass("failed"), a.removeClass("loading")
                        }
                        setTimeout((function () {
                            o && o.fadeOut((function () {
                                this.remove()
                            })), a.removeClass("loading"), a.removeClass("success"), a.removeClass("failed")
                        }), 1e3)
                    }));
                    else {
                        var l = e('<span style="display:none">' + pencipodcast.lang.failed + "</span>");
                        s.append(l), l.fadeIn(), a.addClass("failed"), a.removeClass("loading"), setTimeout((function () {
                            l && l.fadeOut((function () {
                                this.remove()
                            })), a.removeClass("loading"), a.removeClass("success"), a.removeClass("failed")
                        }), 1e3)
                    }
                }))
            }
        }
        a.init()
    }))
}(jQuery);