document.addEventListener('DOMContentLoaded', function() {
    tpgbimageParellax(document)
});

function tpgbimageParellax(doc) {
    doc.querySelectorAll('.tpgb-section:not(.tpgb-section-editor), .tpgb-container-row:not(.tpgb-container-row-editor)').forEach(function(element) {
        var container = element.querySelector('.tpgb-deep-layer');

        if (container && container.classList.contains('tpgb-img-parallax-hover')) {
            var dopacity = container.getAttribute('data-opacity');
            var damount = container.getAttribute('data-amount');
            var dperspective = container.getAttribute('data-perspective');
            var dscale = container.getAttribute('data-scale');
            var dtype = container.getAttribute('data-type');

            container.style.opacity = dopacity;
            var offset = 0;
            if (dtype === 'tilt') {
                offset = -parseInt(damount) * 0.6 + '%';
            } else {
                offset = -parseInt(damount) + 'px';
            }
            container.style.top = offset;
            container.style.left = offset;
            container.style.right = offset;
            container.style.bottom = offset;
            container.style.transform = 'scale(' + dscale + ') perspective(' + dperspective + 'px)';
                var elements = document.querySelectorAll('.tpgb-img-parallax-mouse');
                
                Array.prototype.forEach.call(elements, function(el, i) {
                    // find Row
                    var row = el.parentNode;
                    //row.style.overflow = 'hidden';
                    row.classList.add('image_parallax_row');
                    
                });
                
                
                // Bind to mousemove so animate the hover row
                var elements = document.querySelectorAll('.image_parallax_row');
                Array.prototype.forEach.call(elements, function(row, i) {
                    
                    row.addEventListener('mousemove', function(e) {
                        
                        // Get the parent row
                        var parentRow = e.target.parentNode;
                        while ( ! parentRow.classList.contains('image_parallax_row') ) {
                            
                            if ( parentRow.tagName === 'HTML' ) {
                                return;
                            }
                            
                            parentRow = parentRow.parentNode;
                        }
                        
                        // Get the % location of the mouse position inside the row
                        var rect = parentRow.getBoundingClientRect();
                        var top = e.pageY - ( rect.top + window.pageYOffset );
                        var left = e.pageX  - ( rect.left + window.pageXOffset );
                        top /= parentRow.clientHeight;
                        left /= parentRow.clientWidth;
                        
                        // Move all the hover inner divs
                        var hoverRows = parentRow.querySelectorAll('.tpgb-img-parallax-hover');
                        Array.prototype.forEach.call(hoverRows, function(hoverBg, i) {
                            
                            // Parameters
                            var amount = parseFloat( hoverBg.getAttribute( 'data-amount' ) );
                            var dperspective = parseFloat( hoverBg.getAttribute( 'data-perspective' ) );
                            var dscale = parseFloat( hoverBg.getAttribute( 'data-scale' ) );
                            var inverted = hoverBg.getAttribute( 'data-inverted' ) === 'true';
                            var transform;
                            
                            if ( hoverBg.getAttribute( 'data-type' ) === 'tilt' ) {
                                var rotateY = left * amount - amount / 2;
                                var rotateX = ( 1 - top ) * amount - amount / 2;
                                if ( inverted ) {
                                    rotateY = ( 1 - left ) * amount - amount / 2;
                                    rotateX = top * amount - amount / 2;
                                    
                                }
                                
                                transform = 'scale('+dscale+') perspective('+dperspective+'px) ';
                                transform += 'rotateY(' + rotateY + 'deg) ';
                                transform += 'rotateX(' + rotateX + 'deg) ';
                                
                                hoverBg.style.transition = 'all 0s';
                                hoverBg.style.webkitTransform = transform;
                                hoverBg.style.transform = transform;
                                
                            } else {
                                
                                var moveX = left * amount - amount / 2;
                                var moveY = top * amount - amount / 2;
                                if ( inverted ) {
                                    moveX *= -1;
                                    moveY *= -1;
                                }
                                transform = 'scale('+dscale+') translate3D(' + moveX + 'px, ' + moveY + 'px, 0) ';
                                
                                hoverBg.style.transition = 'all 0s';
                                hoverBg.style.webkitTransform = transform;
                                hoverBg.style.transform = transform;
                            }
                            
                        });
                    });
                    
                    
                    // Bind to mousemove so animate the hover
                    row.addEventListener('mouseout', function(e) {
                        
                        // Get the parent row
                        var parentRow = e.target.parentNode;
                        while ( ! parentRow.classList.contains('image_parallax_row') ) {
                            
                            if ( parentRow.tagName === 'HTML' ) {
                                return;
                            }
                            
                            parentRow = parentRow.parentNode;
                        }
                        
                        // Reset all the animations
                        var hoverRows = parentRow.querySelectorAll('.tpgb-img-parallax-hover');
                        Array.prototype.forEach.call(hoverRows, function(hoverBg, i) {
                            
                            var amount = parseFloat( hoverBg.getAttribute( 'data-amount' ) );
                            var scale = parseFloat( hoverBg.getAttribute( 'data-scale' ) );
                            var perspective = parseFloat( hoverBg.getAttribute( 'data-perspective' ) );
                            
                            hoverBg.style.transition = 'all 3s ease-in-out';
                            if ( hoverBg.getAttribute( 'data-type' ) === 'tilt' ) {
                                hoverBg.style.webkitTransform = 'scale('+scale+') perspective('+perspective+'px) rotateY(0) rotateX(0)';
                                hoverBg.style.transform = 'scale('+scale+') perspective('+perspective+'px) rotateY(0) rotateX(0)';
                                } else {
                                hoverBg.style.webkitTransform = 'scale('+scale+') translate3D(0, 0, 0)';
                                hoverBg.style.transform = 'scale('+scale+') translate3D(0, 0, 0)';
                            }
                            
                        });
                    });
                });

        }
    });
}