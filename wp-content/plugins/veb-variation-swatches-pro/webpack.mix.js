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
veb-variation-swatches-pro.php
includes
languages
templates
package.json
wpml-config.xml
webpack.mix.js`;

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
        package   : 'WooCommerce Additional Variation Images And Swatches PRO',
        bugReport : 'https://innovativewp.org/support/plugins/forum/swatches-images/',
        src       : '**/*.php',
        domain    : 'veb-variation-swatches-pro',
        destFile  : `languages/veb-variation-swatches-pro.pot`
    });
}

mix.banner({
    banner : "WooCommerce Additional Variation Images And Swatches PRO v2.0.1 \n\nAuthor: InnovativeWP ( support@innovativewp.org ) \nDate: " + new Date().toLocaleDateString('en-GB') + "\nReleased under the GPLv3 license."
});

mix.notification({
    title : 'IWP Swatches PRO',
});

if (!Mix.inProduction()) {
}

mix.copy(`src/js/jquery.serializejson.js`, `assets/js/jquery.serializejson${min}.js`);
mix.js(`src/js/add-to-cart-variation.js`, `assets/js/add-to-cart-variation${min}.js`);
mix.js(`src/js/frontend.js`, `assets/js/frontend-pro${min}.js`);
mix.sass(`src/scss/frontend.scss`, `assets/css/frontend-pro${min}.css`);
mix.sass(`src/scss/theme-override.scss`, `assets/css/inwp-pro-theme-override${min}.css`);
mix.js(`src/js/backend.js`, `assets/js/admin-pro${min}.js`);
mix.sass(`src/scss/backend.scss`, `assets/css/admin-pro${min}.css`);
mix.js(`src/js/comp-functions.js`, `assets/js/comp-functions${min}.js`);

