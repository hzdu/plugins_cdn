if (document.querySelector('a')) {
    let hasBeenPrerendered = [];

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', (e) => {
            let href = link.getAttribute('href');

            if (!hasBeenPrerendered.includes(href)) {
                let prerenderLink = document.createElement('link');

                prerenderLink.setAttribute('rel', 'prerender');
                prerenderLink.setAttribute('href', href);

                document.head.appendChild(prerenderLink);

                hasBeenPrerendered.push(href);
            }
        });
    });
}
