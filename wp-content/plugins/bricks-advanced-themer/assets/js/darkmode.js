(function() {
    let darkmodeCookie = localStorage.getItem("brxc-theme");
    if(darkmodeCookie === 'dark') {
        if (document.body) document.body.classList.add('brxc-dark');
        const toggles = document.querySelectorAll('.brxe-brxc-darkmode-toggle, .brxe-brxc-darkmode-btn');
        if (toggles.length < 1) return;
        toggles.forEach(toggle => {
            const checkbox = toggle.querySelector('input.brxc-toggle-checkbox')
            if (!checkbox) return;
            checkbox.checked = true;
        })
    } 
})();

window.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.brxe-brxc-darkmode-toggle, .brxe-brxc-darkmode-btn');
    if (toggles.length < 1) return;
    const body = document.body;
    toggles.forEach(toggle => {
        const checkbox = toggle.querySelector('input.brxc-toggle-checkbox')
        checkbox.addEventListener('change', () => {
            if(body.classList.contains('brxc-dark')) {
                body.classList.remove('brxc-dark');
                toggles.forEach(cb => {cb.querySelector('input.brxc-toggle-checkbox').checked = false;});
                localStorage.setItem("brxc-theme", "light");
            } else {
                body.classList.add('brxc-dark');
                toggles.forEach(cb => {cb.querySelector('input.brxc-toggle-checkbox').checked = true;});
                localStorage.setItem("brxc-theme", "dark");
            }
        })

    })
})