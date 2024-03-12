module.exports = {
    getSetting: ( key, backup ) => global.wcSettings[ key ] || backup,
    getAdminLink: ( path ) => {
        if ( global.wcSettings && global.wcSettings.adminUrl ) {
            return global.wcSettings.adminUrl + path;
        }
        return path;
    },
};
