'use strict';
export var AmeAdminCustomizerBase;
(function (AmeAdminCustomizerBase) {
    class AdminCustomizerBase {
        constructor(scriptData) {
            this.allowedCommOrigins = scriptData.allowedCommOrigins;
            if (this.allowedCommOrigins.length === 0) {
                this.allowedCommOrigins = [window.location.origin];
            }
            this.allowedPreviewUrls = scriptData.allowedPreviewUrls;
            this.parsedAllowedUrls = this.allowedPreviewUrls.map(url => new URL(url));
        }
        isPreviewableUrl(url) {
            if (typeof url === 'string') {
                url = new URL(url);
            }
            if (typeof url.protocol === 'undefined') {
                return false;
            }
            //Only HTTP(S) links are previewable.
            if ((url.protocol !== 'http:') && (url.protocol !== 'https:')) {
                return false;
            }
            //Check against the list of allowed URLs.
            for (const allowedUrl of this.parsedAllowedUrls) {
                //Protocol and host must match. The path must start with the path
                //of the allowed URL (possibly without a trailing slash).
                if ((url.protocol === allowedUrl.protocol) && (url.host === allowedUrl.host)) {
                    const allowedPath = allowedUrl.pathname.replace(/\/$/, '');
                    if (url.pathname.indexOf(allowedPath) === 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    AmeAdminCustomizerBase.AdminCustomizerBase = AdminCustomizerBase;
})(AmeAdminCustomizerBase || (AmeAdminCustomizerBase = {}));
//# sourceMappingURL=admin-customizer-base.js.map