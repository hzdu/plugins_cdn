/**
 * wcj-admin.
 *
 * @version 1.0.2
 * @since  1.0.0
 */

jQuery(document).ready(function () {
    let circleBadge = document.querySelector('.circle-badge'),
    subCircles = document.querySelectorAll('.subCircles > div');
    if (null !== circleBadge) {
    circleBadge.addEventListener('click', showCircles);
    
    function showCircles() {
        subCircles.forEach(circle => {
            circle.classList.toggle("show");
        })
    };
}
});