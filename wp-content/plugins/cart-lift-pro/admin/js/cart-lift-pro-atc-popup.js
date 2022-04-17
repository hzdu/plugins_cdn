var Form = Vue.component('cl-atc-vue-app', {
    template: '#cl-atc-vue-app',
    parent: App,
    props: ['enabler', 'popup_logo', 'popup_title', 'popup_description', 'popup_button_text', 'enable_status', 'enable_status'],
    data: function(){
        return {
            enabled: this.enabler,
            logo: this.popup_logo,
            logo_id: '',
            title: this.popup_title,
            description: this.popup_description,
            button_text: this.popup_button_text,
            status: this.enable_status,
            checked: this.enable_status,
        }
    },
    methods: {
        check: function(e) {
            if(e.target.checked) {
                this.enabled = 1;
            }else {
                this.enabled = 0;
            }
        },

        upload: function (e) {
            // this.logo = 'http://dev.cartlift.com/wp-content/uploads/2020/04/beanie-with-logo-1.jpg';
            if (this.window === undefined) {
                this.window = wp.media({
                    title: 'Insert Logo',
                    library: {type: 'image'},
                    multiple: false,
                    button: {text: 'Insert Logo'}
                });
                var self = this;
                this.window.on('select', function() {
                    var response = self.window.state().get('selection').first().toJSON();
                    self.logo = response.url;
                    self.logo_id = response.id;
                });
            }

            this.window.open();
            return false;
        },

        remove: function () {
            this.logo = '';
            this.logo_id = '';
        }
    },
});



// create a root instance
var App = new Vue({
    el: '#vue-app',
    methods: {

    }
});
