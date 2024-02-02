function xDoMediaPlayer() {

    function pauseOutOfView(player) {

        const onIntersection = (entries,observer) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    player.pause()
                    observer.unobserve(player)
                }
            }
        };

        const observer = new IntersectionObserver(onIntersection,{
            root: null,
            rootMargin: '0px 0px 200px 0px',
            threshold: 0
        });

        observer.observe(player); 
    }

    function lazyLoadPoster(player,config) {
        const onIntersection = (entries,observer) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    if ( player.querySelector('media-poster') ) {
                        player.querySelector('media-poster').src = player.querySelector('media-poster').dataset.src
                    }
                    if ( 'custom' === config.load && player.querySelector('media-poster img') ) {
                        player.querySelector('media-poster img').src = player.querySelector('media-poster').dataset.src
                    }
                    observer.unobserve(player)
                }
            }
        };

        const observer = new IntersectionObserver(onIntersection,{
            root: null,
            rootMargin: '0px 0px 200px 0px',
            threshold: 0
        });
        observer.observe(player);  
    }

    function loadOnClick(player) {
        player.querySelectorAll('.vds-button').forEach(button => {
            button.style.removeProperty('pointer-events');
            //controlGroup.style.opacity = '0.7';
        })
        player.querySelectorAll('.vds-slider').forEach(controlSlider => {
            controlSlider.style.pointerEvents = "none"
        })

        player.addEventListener('click', startPlayer)
        player.querySelectorAll('media-play-button').forEach(play => {
            play.addEventListener('keydown', startPlayer)
        })
        

        function startPlayer(e) {

            if ( null == e.code || ( e.target.closest('media-play-button') && ( e.code === "Enter" || e.code === "Space" ) ) ) {
                player.startLoading()
            }
            
            player.addEventListener('can-play', () => {
                
                player.querySelectorAll('.vds-button').forEach(button => {
                    button.style.pointerEvents = 'auto';
                    button.style.removeProperty('opacity');
                })
                player.querySelectorAll('.vds-slider').forEach(controlSlider => {
                    controlSlider.style.removeProperty('pointer-events');
                })

                player.removeEventListener('click', startPlayer)
                player.querySelectorAll('media-play-button').forEach(play => {
                    play.removeEventListener('keydown', startPlayer)
                })
            })
        }
    }

    function autoPause(mediaPlayers,player) {
        player.addEventListener('playing', () => {
            mediaPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player) {
                    if ( window.xMediaPlayer.Instances[otherPlayer.closest('.brxe-xmediaplayer').getAttribute('data-x-id')] ) {
                        window.xMediaPlayer.Instances[otherPlayer.closest('.brxe-xmediaplayer').getAttribute('data-x-id')].pause()
                    }
                }
            })
        })
    }

    function selectPlaylistItem(playlistItem, player) {
        if (!playlistItem) { return }

        
        playlistItem.classList.add('x-media-player-playlist_active')
        playlistItem.setAttribute('aria-pressed', 'true')

        if ( playlistItem.hasAttribute('data-x-poster') && player.querySelector('media-poster img') && player.querySelector('media-poster') ) {
           player.querySelector('media-poster img').dataset.src = playlistItem.getAttribute('data-x-poster')
           player.querySelector('media-poster').dataset.src = playlistItem.getAttribute('data-x-poster')
        }

        if (!playlistItem.getAttribute('data-x-src')) {return}
        player.setAttribute('src',playlistItem.getAttribute('data-x-src')) 

        if (!playlistItem.getAttribute('data-x-title')) {return}
        player.setAttribute('title',playlistItem.getAttribute('data-x-title')) 

        if (playlistItem.getAttribute('data-x-texttracks')) {

            const texttracksAttr = playlistItem.getAttribute('data-x-texttracks')
            const texttracks = texttracksAttr ? JSON.parse(texttracksAttr) : {}

            if ( Array.isArray(texttracks) ) {
               
                    texttracks.forEach((track,index) => {

                    var trackEl = document.createElement("track");
                    trackEl.setAttribute('label',track.label)
                    trackEl.setAttribute('src',track.src)
                    trackEl.setAttribute('kind',track.kind)
                    trackEl.setAttribute('scslang',track.language)
                    if (0 === index) {
                        trackEl.setAttribute('default','')
                    }

                    player.querySelector('media-provider').appendChild(trackEl);

                })

            }

        }
    }

    /* moving between media */
    function switchMediaSrc(e, player, containerEL, config, auto = true) {

        if ( ! e.target.closest('.brxe-xmediaplayerplaylist') ) {
            return;
        }
        
        let playlistItem = e.target.closest('.brxe-xmediaplayerplaylist');
        let newSrc = playlistItem.getAttribute('data-x-src');
        let newTitle = playlistItem.getAttribute('data-x-title') ? playlistItem.getAttribute('data-x-title') : '';

        player.querySelectorAll('media-provider track').forEach(track => {
            track.remove()
        })

        if (playlistItem.getAttribute('data-x-texttracks')) {

            const texttracksAttr = playlistItem.getAttribute('data-x-texttracks')
            const texttracks = texttracksAttr ? JSON.parse(texttracksAttr) : {}

            if ( Array.isArray(texttracks) ) {
               
                    texttracks.forEach((track,index) => {

                    let trackEl = document.createElement("track");
                        trackEl.setAttribute('label',track.label)
                        trackEl.setAttribute('src',track.src)
                        trackEl.setAttribute('kind',track.kind)
                        trackEl.setAttribute('scslang',track.language)
                        if (0 === index) {  trackEl.setAttribute('default','') }

                    player.querySelector('media-provider').appendChild(trackEl);

                })

            }

        }

        if (!newSrc) {return}

            player.startLoading()
            player.src = newSrc;
            player.title = newTitle;
            if ( player.querySelector('.vds-time-slider') ) {
                player.querySelector('.vds-time-slider').style.removeProperty('pointer-events');
            }
            player.querySelectorAll('.vds-button').forEach(button => {
                button.style.pointerEvents = 'auto';
                button.style.removeProperty('opacity');
            })
            
            containerEL.querySelectorAll('.brxe-xmediaplayerplaylist').forEach((item, index) => {
                item.classList.remove('x-media-player-playlist_active')
                item.setAttribute('aria-pressed', 'false')
            })

            player.addEventListener('can-play', () => {
                if (auto) {
                    setTimeout(() => {
                        player.play()
                    }, config.playListDelay);
                } else {
                 player.play()
                }
            });

            playlistItem.classList.add('x-media-player-playlist_active')
            playlistItem.setAttribute('aria-pressed', 'true')
            
    }

    const extrasMediaPlayer = function ( container, initPlayer = true ) {

        const mediaPlayers = container.querySelectorAll('.brxe-xmediaplayer media-player');
        let playlistItems
         

        mediaPlayers.forEach(player => {

            const configAttr = player.closest('.brxe-xmediaplayer').getAttribute('data-x-media-player')
            const config = configAttr ? JSON.parse(configAttr) : {}

                lazyLoadPoster(player,config);

                let containerEL = null != config.isLooping ? player.closest('.brxe-' + config.isLooping) : player.closest('.brxe-container')

                if (player.querySelector('.vds-controls')) {
                    player.querySelector('.vds-controls').style.removeProperty('visibility')
                }

                if ( 'custom' === config.load ) {
                    if ( null != config.poster ) {
                        if (player.querySelector('media-poster img')) {
                            player.querySelector('media-poster img').setAttribute('alt', player.querySelector('media-poster').getAttribute('alt'));
                        }
                    }
                     loadOnClick(player)
                }
                
                player.addEventListener('can-play', () => {
                    window.xMediaPlayer.Instances[player.closest('.brxe-xmediaplayer').dataset.xId] = player;

                    player.addEventListener('playing', () => {
                            player.closest('.brxe-xmediaplayer').setAttribute('data-x-played', 'true');
                    })
                });

                

                /* autopause */
                autoPause(mediaPlayers,player)

                if (config.pauseOutOfView) {
                    player.addEventListener('playing', () => {
                        pauseOutOfView(player)
                    })
                }


            /* playlist mode */    
            if (config.playlist && containerEL) {

                playlistItems = containerEL.querySelectorAll('.brxe-xmediaplayerplaylist');
                selectPlaylistItem(playlistItems[0],player);

                containerEL.addEventListener('click', (e) => switchMediaSrc(e, player, containerEL, config, false ));
                containerEL.addEventListener('keypress', (e) => switchMediaSrc(e, player, containerEL, config, false ));
                

                if (config.playListNext) {
                    if ( player.querySelector('media-poster') ) {
                        player.addEventListener('playing', () => {
                            player.querySelector('media-poster').style.visibility = 'hidden'
                        })
                    }

                    player.addEventListener('ended', () => {

                        let nextItem = [];
                        let playlistItems = containerEL.querySelectorAll('.brxe-xmediaplayerplaylist')

                        playlistItems.forEach((playlistItem, index) => {

                            if ( playlistItem.classList.contains('x-media-player-playlist_active') ) {
                                if (index < playlistItems.length - 1) {  nextItem.push(playlistItems[index + 1])  }
                                if (config.playListLoop && ( index === playlistItems.length - 1)){  nextItem.push(playlistItems[0]);}
                            }

                        })

                        if (nextItem.length !== 0) {
                            setTimeout(() => {
                                nextItem[0].click()
                            }, config.playListDelay);
                        }

                    })

                }

            }

        })

    }

    extrasMediaPlayer(document, ajax = false);

    // Expose function
    window.doExtrasMediaPlayer = extrasMediaPlayer;

}

document.addEventListener("DOMContentLoaded",function(e){
    bricksIsFrontend&&xDoMediaPlayer()
 });
