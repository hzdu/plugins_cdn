document.addEventListener("DOMContentLoaded", function() {
    tpaudioPly(document)
})

function tpaudioPly(doc){
	let audioP = doc.querySelectorAll('.tpgb-audio-player');
	if(audioP){
		audioP.forEach((ap)=>{
			var id = ap.getAttribute("data-id"),
				song,cutime,
				tracker = ap.querySelector('.tracker'),
				volume = ap.querySelector('.volume'),
				durationtime = ap.querySelector('.durationtime'),
				currenttime = ap.querySelector('.currenttime'),
				style = ap.getAttribute('data-style'),
				apvolume = ap.getAttribute('data-apvolume'),
				trackfill = ap.querySelector('.tracker-fill');

			// play click

			function initAudio(elem,mainEl,style) {
                let url = (elem) ? elem.getAttribute('audiourl') : '',
                    title = (elem) ? elem.textContent  : '',
                    artist = (elem) ? elem.getAttribute('artist') : '',
                    thumb = (elem) ? elem.getAttribute('data-thumb') : '';
			
                if(style=='style-3'){
                    let traImg = mainEl.querySelector('.trackimage img');
                    if(traImg){
                        traImg.src = thumb;
                    }
                }	
                if(style=='style-4'){
                    let s4player = mainEl.querySelector('.tpgb-player');
                    if(s4player){
                        s4player.style.cssText = 'background: url('+thumb+'); transition: background 0.5s linear';
                    }			
                }
                if(style=='style-5'){
                    let s5Img = mainEl.querySelector('.ap-st5-img');
                    if(s5Img){
                        s5Img.style.cssText = 'background: url('+thumb+'); transition: background 0.5s linear';
                    }		
                }
                if(style=='style-6'){
                    let s6Cnt = mainEl.querySelector('.ap-st5-content');
                    if(s6Cnt){
                        s6Cnt.style.cssText = 'background: url('+thumb+'); transition: background 0.5s linear';
                    }	
                }
                if(style=='style-8'){
                    let s8Img = mainEl.querySelector('.tpgb-player-bg-img');
                    if(s8Img){
                        s8Img.style.cssText = 'background: url('+thumb+'); background-size: cover; background-position: center center; transition: background 0.5s linear';
                    }
                    let s8traImg = mainEl.querySelector('.trackimage img');
                    if(s8traImg){
                        s8traImg.src = thumb;
                    }
                }
                if(style=='style-9'){
                    let s9Img = mainEl.querySelector('.tpgb-player-bg-img');
                    if(s9Img){
                        s9Img.style.cssText = 'background: url('+thumb+'); background-size: cover; background-position: center center;';
                    }			
                }
			
				let plTitle = mainEl.querySelector('.title');
				if(plTitle){
					plTitle.textContent = title;
				}
				let plArtist = mainEl.querySelector('.artist');
				if(plArtist){
					plArtist.textContent = artist;
				}
			
				var durationtime = mainEl.querySelector('.durationtime');
			
				song = new Audio(url);
				// timeupdate event listener
				// song.volume = apvolume / 100;
				song.addEventListener('timeupdate', function() { 
					var curtime = parseInt(song.currentTime,10);
                    if(tracker){
                        tracker.noUiSlider.set(curtime);
                        if(trackfill){
                            trackfill.style.width = ((100*song.currentTime) / song.duration)+"%";
                        }
                    }

					cutime = curtime;
					if(currenttime){
						UpdateSeek(cutime);	
					}
				});
				song.addEventListener('loadeddata', function playerLoadeddata(){
					if(durationtime){
						durationtime.innerHTML = formatTime(song.duration);	
					}			
				}, true);
				
				let actPl = mainEl.querySelector('.tpgb-playlist.active');
				if(actPl){
					actPl.classList.remove('active');
				}
				if(elem) { elem.classList.add('active'); }
				songEnded(mainEl,style);
			}

			function playAudio(mainEl) {
				song.play();
				let songDur = Math.round(song.duration);
				tracker.noUiSlider.updateOptions({
					range: {
						'min': 0,
						'max': songDur
					},
				});
				let plPlay = mainEl.querySelector('.play'), plPause = mainEl.querySelector('.pause');
				if(plPlay){
					plPlay.classList.add('hidden');
				}
				if(plPause){
					plPause.classList.add('visible');
				}
			}
			
			function stopAudio(mainEl) {
				song.pause();
				let plPlay = mainEl.querySelector('.play.hidden'), plPause = mainEl.querySelector('.pause.visible');
				if(plPlay){
					plPlay.classList.remove('hidden');
				}
				if(plPause){
					plPause.classList.remove('visible');
				}
			}
			
			function UpdateSeek(a){
				currenttime.innerHTML = formatTime(a);
			}
			
			function songEnded(mainEl,style){
				song.addEventListener('ended', function() {
					let plNext = mainEl.querySelector('.tpgb-playlist.active').nextElementSibling;
					if(plNext){
						plNext =mainEl.querySelector('.tpgb-playlist:first-child');
					}
					initAudio(plNext,mainEl,style);
			
					song.addEventListener('loadedmetadata', function() {
						playAudio(mainEl);
					});
			
				}, false);
			}


			let playBtn = ap.querySelector('.play'), pouseBtn = ap.querySelector('.pause'), frwdBtn = ap.querySelector('.fwd'), revBtn = ap.querySelector('.rew');
			playBtn.addEventListener('click', (e)=>{
				e.preventDefault();
                if(song.duration && song.duration != NaN){
                    let songDur = Math.round(song.duration);
                    if(tracker){
                        tracker.noUiSlider.updateOptions({
                            range: {
                                'min': 0,
                                'max': songDur
                            },
                        });
                    }
                    song.play();
                    e.currentTarget.classList.add('hidden');
                    pouseBtn.classList.add('visible');
                }
			});

			pouseBtn.addEventListener('click', (e)=>{
				e.preventDefault();
				stopAudio(ap);
			});

            if(frwdBtn){
                frwdBtn.addEventListener('click', (e)=>{
                    e.preventDefault();
                    stopAudio(ap);

                    let plNext = ap.querySelector('.tpgb-playlist.active').nextElementSibling;
                    if(!plNext){
                        plNext =ap.querySelector('.tpgb-playlist:first-child');
                    }
                    initAudio(plNext,ap,style);

                    song.addEventListener('loadedmetadata', function() {
                        playAudio(ap);
                    });

                });
            }
            
            if( revBtn ){
                revBtn.addEventListener('click', (e)=>{
                    e.preventDefault();
                    stopAudio(ap);
                    let plPrev = ap.querySelector('.tpgb-playlist.active').previousElementSibling;
                    if(!plPrev){
                        plPrev =ap.querySelector('.tpgb-playlist:last-child');
                    }
                    initAudio(plPrev,ap,style);
                    song.addEventListener('loadedmetadata', function() {
                        playAudio(ap);
                    });
                });
            }

			// show playlist
			let plIcon = ap.querySelector('.playlistIcon'), pllist = ap.querySelector('.playlist');
			if(plIcon){
				plIcon.addEventListener('click', (e)=>{
					e.preventDefault();
					if(pllist.classList.contains('show')){
						pllist.classList.remove('show');
					}else{
						pllist.classList.add('show');
					}
				});
			}
			
			let volIcon = ap.querySelector('.volumeIcon'), volBG = ap.querySelector('.tpgb-volume-bg');
			if(volIcon){
				volIcon.addEventListener('click', (e)=>{
					if(e.target.classList.contains('tpgb-volume-bg') || e.target.closest('.tpgb-volume-bg')){
						return
					}
					e.preventDefault();
					if(volBG.classList.contains('show')){
						volBG.classList.remove('show');
					}else{
						volBG.classList.add('show');
					}
				});
			}
			

			// playlist elements - click
			let plListItm = ap.querySelectorAll('.tpgb-playlist');
			if(plListItm){
				plListItm.forEach((plI)=>{
					plI.addEventListener('click',(e)=>{
						stopAudio(ap);
						initAudio(e.currentTarget,ap, style);
						song.addEventListener('loadedmetadata', function() {
							playAudio(ap);				
						});
					})
				});
			}

			// initialization - first element in playlist
			let firstPL = ap.querySelector('.tpgb-playlist:first-child');
			initAudio(firstPL,ap,style);

            if(volume){
                noUiSlider.create(volume, {
                    direction: 'rtl',
                    orientation: 'vertical',
                    start: apvolume,
                    connect: true,
                    range: {
                        'min': 0,
                        'max': 100
                    }
                });

                volume.noUiSlider.on('slide', function(event, ui) {
                    song.volume = event[0] / 100;
                });
            }

            if(tracker){
                noUiSlider.create(tracker, {
                    start: 0,
                    connect: true,
                    range: {
                        'min': 0,
                        'max': 100
                    }
                });

                tracker.noUiSlider.on('slide', function(event, ui) {
                    song.currentTime = event[0];
                });
            }
		})
	}
} 



function formatTime(val) {
	var h = 0, m = 0, s;
	val = parseInt(val, 10);
	if (val > 60 * 60) {
		h = parseInt(val / (60 * 60), 10);
		val -= h * 60 * 60;
	}
	if (val > 60) {
		m = parseInt(val / 60, 10);
		val -= m * 60;
	}
	s = val;
	val = (h > 0)? h + ':' : '';
	val += (m > 0)? ((m < 10 && h > 0)? '0' : '') + m + ':' : '0:';
	val += ((s < 10)? '0' : '') + s;
	return val;
}