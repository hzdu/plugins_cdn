jQuery(document).ready(function( $ ) {
    $(".wpt_table_tag_wrapper").musicPlayer({
    elements: ['artwork', 'information', 'controls', 'progress', 'time', 'volume'], // ==> This will display in  the order it is inserted
    //elements: [ 'controls' , 'information', 'artwork', 'progress', 'time', 'volume' ],
    //controlElements: ['backward', 'play', 'forward', 'stop'],
    //timeElements: ['current', 'duration'],
    //timeSeparator: " : ", // ==> Only used if two elements in timeElements option
    infoElements: [  'title', 'artist' ],

    //volume: 10,
    //autoPlay: true,
    //loop: true,
    onLoad: function(aaa){
        console.log(aaa, WPT_AUDIO_DATA);
        $('.player').css('background', WPT_AUDIO_DATA.bg_color);
        $('.bar-played,.volume-adjust > div > div').css('background', WPT_AUDIO_DATA.progressbar_color);
    //    $('.progressbar').css('background', WPT_AUDIO_DATA.player_position);
    //    console.log(WPT_AUDIO_DATA.player_position == true);
        if(WPT_AUDIO_DATA.player_position){
            $('.player').css('position', 'fixed');
        }
        
    },
    onPlay: function () {
    },
    onPause: function () {

    },
    onStop: function () {

    },
    onFwd: function () {

    },
    onRew: function () {

    },
    volumeChanged: function () {

    },
    progressChanged: function () {

    },
    trackClicked: function () {

    },
    onMute: function () {

    },
});

});