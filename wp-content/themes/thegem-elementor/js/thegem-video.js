(function() {
class BaseLoader {
	constructor() {
		this.isInserted = false;
	}

	insertAPI() {
		var tag = document.createElement('script');
		tag.src = this.getApiURL();
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		this.isInserted = true;
	}

	getVideoIDFromURL(url) {
		var videoIDParts = url.match(this.getURLRegex());
		return videoIDParts && videoIDParts[1];
	}

	onApiReady(callback) {
		var _this = this;

		if (!this.isInserted) {
			this.insertAPI();
		}

		if (this.isApiLoaded()) {
			callback(this.getApiObject());
		} else {
			// If not ready check again by timeout..
			setTimeout(function () {
				_this.onApiReady(callback);
			}, 350);
		}
	}
}

class YoutubeLoader extends BaseLoader {
	getApiURL() {
		return 'https://www.youtube.com/iframe_api';
	}

	getURLRegex() {
		return /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?vi?=|(?:embed|v|vi|user)\/))([^?&"'>]+)/;
	}

	isApiLoaded() {
		return window.YT && YT.loaded;
	}

	getApiObject() {
		return YT;
	}
}

class VimeoLoader extends BaseLoader {
	getApiURL() {
		return 'https://player.vimeo.com/api/player.js';
	}

	getURLRegex() {
		return /^(?:https?:\/\/)?(?:www|player\.)?(?:vimeo\.com\/)?(?:video\/|external\/)?(\d+)([^.?&#"'>]?)/;
	}

	isApiLoaded() {
		return window.Vimeo;
	}

	getApiObject() {
		return Vimeo;
	}
}

class video {

	constructor(element) {
		this.element = element;
		this.settings = JSON.parse(element.dataset.settings);
		this.video_embed = this.element.querySelector('.background-video-embed');
		this.video_hosted = this.element.querySelector('.background-video-hosted');
		var is_mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
		if (!this.settings.play_on_mobile && is_mobile) {
			return;
		}
		this.init();
	}

	calcVideosSize($video) {
		var aspectRatioSetting = '16:9';

		if ('vimeo' === this.videoType) {
			aspectRatioSetting = $video.width + ':' + $video.height;
		}

		var containerWidth = this.element.offsetWidth,
			containerHeight = this.element.offsetHeight,
			aspectRatioArray = aspectRatioSetting.split(':'),
			aspectRatio = aspectRatioArray[0] / aspectRatioArray[1],
			ratioWidth = containerWidth / aspectRatio,
			ratioHeight = containerHeight * aspectRatio,
			isWidthFixed = containerWidth / containerHeight > aspectRatio;
		return {
			width: isWidthFixed ? containerWidth : ratioHeight,
			height: isWidthFixed ? ratioWidth : containerHeight
		};
	}

	changeVideoSize() {
		if (!('hosted' === this.videoType) && !this.player) {
			return;
		}

		var $video, $video_wrapper;

		if ('youtube' === this.videoType) {
			$video = this.player.getIframe();
			$video_wrapper = this.video_embed;
		} else if ('vimeo' === this.videoType) {
			$video = this.player.element;
			$video_wrapper = this.video_embed;
		} else if ('hosted' === this.videoType) {
			$video = this.video_hosted;
			$video_wrapper = this.video_hosted;
		}

		if (!$video) {
			return;
		}

		var size = this.calcVideosSize($video);
		$video_wrapper.style.width = size.width + 'px';
		$video_wrapper.style.height = size.height + 'px';
	}

	startVideoLoop(firstTime) {
		var _this5 = this;

		// If the section has been removed
		if (!this.player.getIframe().contentWindow) {
			return;
		}

		var elementSettings = this.settings,
			startPoint = elementSettings.background_video_start || 0,
			endPoint = elementSettings.background_video_end;

		if (elementSettings.background_play_once && !firstTime) {
			this.player.stopVideo();
			return;
		}

		this.player.seekTo(startPoint);

		if (endPoint) {
			var durationToEnd = endPoint - startPoint + 1;
			setTimeout(function () {
				_this5.startVideoLoop(false);
			}, durationToEnd * 1000);
		}
	}

	prepareYTVideo(YT, videoID) {
		let _this1 = this;

		var $backgroundVideoContainer = this.element;
		var startStateCode = YT.PlayerState.PLAYING; // Since version 67, Chrome doesn't fire the `PLAYING` state at start time

		if (window.chrome) {
			startStateCode = YT.PlayerState.UNSTARTED;
		}

		var iframe_box = document.createElement("div");
		this.video_embed.appendChild(iframe_box);

		$backgroundVideoContainer.classList.add('video-loading');
		this.player = new YT.Player(iframe_box, {
			videoId: videoID,
			events: {
				onReady: function onReady() {
					_this1.player.mute();

					_this1.player.getIframe().classList.add('youtube-video');

					_this1.changeVideoSize();

					_this1.startVideoLoop(true);

					_this1.player.playVideo();
				},
				onStateChange: function onStateChange(event) {
					switch (event.data) {
						case startStateCode:
							$backgroundVideoContainer.classList.remove('video-loading');
							break;

						case YT.PlayerState.ENDED:
							_this1.player.seekTo(_this1.settings.background_video_start || 0);

							if (_this1.settings.background_play_once) {
								_this1.player.destroy();
							}
					}
				}
			},
			playerVars: {
				controls: 0,
				rel: 0,
				playsinline: 1,
				loop: true
			}
		});
	}

	prepareVimeoVideo(Vimeo, videoId) {
		var _this2 = this;

		var elementSettings = this.settings,
			startTime = elementSettings.background_video_start ? elementSettings.background_video_start : 0,
			videoSize = this.element.offsetWidth,
			vimeoOptions = {
				id: videoId,
				width: videoSize.width,
				autoplay: true,
				loop: !elementSettings.background_play_once,
				transparent: false,
				background: true,
				muted: true
			};
		this.player = new Vimeo.Player(this.video_embed, vimeoOptions); // Handle user-defined start/end times

		this.handleVimeoStartEndTimes(elementSettings);
		this.player.ready().then(function () {
			// _this2.player.element.classList.add('background-video-embed');
			_this2.changeVideoSize();
		});
	}

	handleVimeoStartEndTimes(elementSettings) {
		var _this3 = this;

		// If a start time is defined, set the start time
		if (elementSettings.background_video_start) {
			this.player.on('play', function (data) {
				if (0 === data.seconds) {
					_this3.player.setCurrentTime(elementSettings.background_video_start);
				}
			});
		}

		this.player.on('timeupdate', function (data) {
			// If an end time is defined, handle ending the video
			if (elementSettings.background_video_end && elementSettings.background_video_end < data.seconds) {
				if (elementSettings.background_play_once) {
					// Stop at user-defined end time if not loop
					_this3.player.pause();
				} else {
					// Go to start time if loop
					_this3.player.setCurrentTime(elementSettings.background_video_start);
				}
			} // If start time is defined but an end time is not, go to user-defined start time at video end.
			// Vimeo JS API has an 'ended' event, but it never fires when infinite loop is defined, so we
			// get the video duration (returns a promise) then use duration-0.5s as end time

			_this3.player.getDuration().then(function (duration) {
				if (elementSettings.background_video_start && !elementSettings.background_video_end && data.seconds > duration - 0.5) {
					_this3.player.setCurrentTime(elementSettings.background_video_start);
				}
			});
		});
	}

	init() {
		let _this = this,
			videoLink = this.settings.url,
			videoID;
		if (-1 !== videoLink.indexOf('vimeo.com')) {
			this.videoType = 'vimeo';
			this.apiProvider = new VimeoLoader();
		} else if (videoLink.match(/^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com)/)) {
			this.videoType = 'youtube';
			this.apiProvider = new YoutubeLoader();
		}

		if (this.apiProvider) {
			videoID = this.apiProvider.getVideoIDFromURL(videoLink);
			this.apiProvider.onApiReady(function (apiObject) {
				if ('youtube' === _this.videoType) {
					_this.prepareYTVideo(apiObject, videoID);
				}
				if ('vimeo' === _this.videoType) {
					_this.prepareVimeoVideo(apiObject, videoID);
				}
			});
		} else {
			this.videoType = 'hosted';
			var startTime = this.settings.background_video_start,
				endTime = this.settings.background_video_end;

			if (startTime || endTime) {
				videoLink += '#t=' + (startTime || 0) + (endTime ? ',' + endTime : '');
			}

			this.video_hosted.setAttribute("src", videoLink);
			this.video_hosted.oncanplay = this.changeVideoSize.bind(this);

			if (this.settings.background_play_once) {
				this.video_hosted.onended = function () {
					_this.video_hosted.style.display = "none"
				};
			}
		}

		window.addEventListener("resize", function () {
			_this.changeVideoSize();
		});
	}
}

let videos = document.getElementsByClassName("background-video-container"), i;
for (i = 0; i < videos.length; i++) {
	new video(videos[i]);
}
})();
