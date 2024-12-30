function penci_dmgetcookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if ( penci_dark.darkmode ) {
    document.cookie = "penci_mode=dark; path=/";
}

let alllogos = document.querySelectorAll('.penci-limg'),
    body = document.querySelector('body'),
    autoby = penci_dark.auto_by,
    darktheme = penci_dark.darktheme,
    hr = (new Date()).getHours(),
    cv = penci_dmgetcookie('penci_mode'),
    cc,
    lc = 'pclight-mode',
    dc = 'pcdark-mode';

if (darktheme !== '') {
    cc = 'pcdm-enable';
}

if (autoby === 'os' && !darktheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.remove('pcdm-enable', 'pclight-mode')
    body.classList.add(dc, 'pcdm-enable');
    document.cookie = "penci_mode=dark; path=/";
    alllogos.forEach((alllogo) => {
        var lgimg = alllogo.getAttribute('data-darklogo');
        if (lgimg !== null) {
            alllogo.src = lgimg;
            alllogo.setAttribute('data-src', lgimg);
        }
    });
} else if (autoby === 'os' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.classList.remove('pcdm-enable', 'pcdark-mode')
    body.classList.add(lc, cc);
    document.cookie = "penci_mode=light; path=/";
    alllogos.forEach((alllogo) => {
        var lgimg = alllogo.getAttribute('data-lightlogo');
        if (lgimg !== null) {
            alllogo.src = lgimg;
            alllogo.setAttribute('data-src', lgimg);
        }
    });
}

if ((autoby === 'time' && hr > 18) || cv === 'dark') {
    body.classList.remove('pcdm-enable', 'pclight-mode')
    body.classList.add(dc, 'pcdm-enable');
    document.cookie = "penci_mode=dark; path=/";
    alllogos.forEach((alllogo) => {
        var lgimg = alllogo.getAttribute('data-darklogo');
        if (lgimg !== null) {
            alllogo.src = lgimg;
            alllogo.setAttribute('data-src', lgimg);
        }
    });
} else if (autoby === 'time' || cv === 'light') {
    body.classList.remove('pcdm-enable', 'pcdark-mode')
    body.classList.add(lc, cc);
    document.cookie = "penci_mode=light; path=/";
    alllogos.forEach((alllogo) => {
        var lgimg = alllogo.getAttribute('data-lightlogo');
        if (lgimg !== null) {
            alllogo.src = lgimg;
            alllogo.setAttribute('data-src', lgimg);
        }
    });
}
