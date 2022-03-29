if (document.querySelector('a')) {
    let hasBeenPrerendered = [],
        hasBeenPrefetched = [],
        prefetch_throttle = parseInt(lhf_ajax_var.prefetch_throttle, 10);

    // setTimeout() delay in milliseconds
    let prefetch_throttle_delay = (prefetch_throttle > 0) ? prefetch_throttle : 65;

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', (e) => {
            let href = link.getAttribute('href');

            if (!hasBeenPrefetched.includes(href)) {
                let prerenderLink = document.createElement('link');

                prerenderLink.setAttribute('rel', 'prerender');
                prerenderLink.setAttribute('rel', 'prefetch');
                prerenderLink.setAttribute('href', href);

                setTimeout(function() {
                    document.head.appendChild(prerenderLink);
                }, prefetch_throttle_delay);

                hasBeenPrerendered.push(href);
                hasBeenPrefetched.push(href);
            }
        });
    });
}
