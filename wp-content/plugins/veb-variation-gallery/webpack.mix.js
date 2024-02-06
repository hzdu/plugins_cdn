const mix      = require('wp-mix');
const fsExtra  = require("fs-extra");
const path     = require("path");
const cliColor = require("cli-color");
const emojic   = require("emojic");
const min      = Mix.inProduction() ? '.min' : '';

const PackageFile = JSON.parse(File.find(Mix.paths.root('package.json')).read());

if (process.env.NODE_ENV === 'package') {

    mix.then(function () {

        let bundledir = path.basename(path.resolve(__dirname));
        let copyfrom  = path.resolve(__dirname);
        let copyto    = path.resolve(`${bundledir}`);
        let list      = `assets
fonts
images
includes
languages
templates
package.json
webpack.mix.js
wpml-config.xml
veb-variation-gallery.php`;

        let includes = list.split("\n");
        fsExtra.ensureDir(copyto, function (err) {
            if (err) return console.error(err)

            includes.map(include => {

                fsExtra.copy(`${copyfrom}/${include}`, `${copyto}/${include}`, function (err) {
                    if (err) return console.error(err)

                    console.log(cliColor.white(`=> ${emojic.smiley}  ${include} copied...`));

                })
            });

            console.log(cliColor.white(`=> ${emojic.whiteCheckMark}  Build directory created`));
        })
    });

    return;
}

if (Mix.inProduction()) {
    mix.generatePot({
        package   : '',
        bugReport : '',
        src       : '**/*.php',
        domain    : 'veb-variation-gallery',
        destFile  : `languages/veb-variation-gallery.pot`
    });
}

mix.banner({
    banner : " \n\nAuthor:  (  ) \nDate: " + new Date().toLocaleString() + "\nReleased under the GPLv3 license."
});

mix.notification({
    title : 'Gallery',
});


mix.babel(`node_modules/slick-carousel/slick/slick${min}.js`, `assets/js/slick${min}.js`);
mix.js(`src/js/frontend.js`, `assets/js/frontend${min}.js`);
mix.copy(`src/js/bluebird.js`, `assets/js/bluebird${min}.js`);
mix.sass(`src/scss/slick.scss`, `assets/css/slick${min}.css`);
mix.sass(`src/scss/frontend.scss`, `assets/css/frontend${min}.css`);
mix.sass(`src/scss/theme-support.scss`, `assets/css/theme-support${min}.css`);
mix.js(`src/js/backend.js`, `assets/js/admin${min}.js`);
mix.babel(`src/js/comp-backbone-modal.js`, `assets/js/comp-backbone-modal${min}.js`);
mix.js(`src/js/comp-admin.js`, `assets/js/comp-admin${min}.js`);
mix.sass(`src/scss/backend.scss`, `assets/css/admin${min}.css`);
mix.sass(`src/scss/comp-admin.scss`, `assets/css/comp-admin${min}.css`);
mix.sass(`src/scss/comp-admin-notice.scss`, `assets/css/comp-admin-notice${min}.css`);
