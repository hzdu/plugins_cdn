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
veb-variation-swatches.php
images
includes
languages
package.json
README.txt
uninstall.php
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
        package   : 'WooCommerce Additional Variation Images And Swatches',
        bugReport : 'https://innovativewp.org/support/plugins/forum/swatches-images/',
        src       : '**/*.php',
        domain    : 'veb-variation-swatches',
        destFile  : `languages/veb-variation-swatches.pot`
    });
}

mix.banner({
    banner : "WooCommerce Additional Variation Images And Swatches v2.0.1 \n\nAuthor: InnovativeWP ( support@innovativewp.org ) \nDate: " + new Date().toLocaleDateString('en-GB') + "\nReleased under the GPLv3 license."
});

mix.notification({
    title : 'Swatches',
    
});



mix.js(`src/js/backend.js`, `assets/js/admin${min}.js`);
mix.js(`src/js/frontend.js`, `assets/js/frontend${min}.js`);
mix.js(`src/js/comp-admin.js`, `assets/js/comp-admin${min}.js`);
mix.copy(`src/js/bluebird.js`, `assets/js/bluebird${min}.js`);
mix.babel(`src/js/divi_veb_layout_injector.js`, `assets/js/divi_veb_layout_injector${min}.js`);
mix.babel(`src/js/FormFieldDependency.js`, `assets/js/form-field-dependency${min}.js`);
mix.babel(`src/js/wp-color-picker-alpha.js`, `assets/js/wp-color-picker-alpha${min}.js`);
mix.babel(`src/js/comp-backbone-modal.js`, `assets/js/comp-backbone-modal${min}.js`);
mix.sass(`src/scss/backend.scss`, `assets/css/admin${min}.css`);
mix.sass(`src/scss/comp-admin.scss`, `assets/css/comp-admin${min}.css`);
mix.sass(`src/scss/comp-admin-notice.scss`, `assets/css/comp-admin-notice${min}.css`);
mix.sass(`src/scss/frontend.scss`, `assets/css/frontend${min}.css`);
mix.sass(`src/scss/tooltip.scss`, `assets/css/frontend-tooltip${min}.css`);
mix.sass(`src/scss/theme-override.scss`, `assets/css/inwp-theme-override${min}.css`);