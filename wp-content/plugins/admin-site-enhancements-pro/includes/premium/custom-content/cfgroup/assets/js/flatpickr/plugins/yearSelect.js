/**
 * Flatpickr Year Select Plugin
 *
 * Vendored from https://github.com/MikeSha/flatpickr-year-select-plugin (MIT License)
 * Copyright (c) MikeSha
 *
 * Transforms the Flatpickr calendar into a decade-based year selector.
 */
(function( global, factory ) {
    if ( typeof module === 'object' && typeof module.exports === 'object' ) {
        module.exports = factory();
    } else {
        global.yearSelectPlugin = factory();
    }
}( typeof window !== 'undefined' ? window : this, function() {
    'use strict';

    var defaultConfig = {
        dateFormat: 'Y',
        altFormat: 'Y',
        theme: 'dark',
    };

    function clearNode( node ) {
        while ( node.firstChild ) {
            node.removeChild( node.firstChild );
        }
    }

    function getEventTarget( event ) {
        try {
            if ( typeof event.composedPath === 'function' ) {
                var path = event.composedPath();
                return path[0];
            }
            return event.target;
        } catch ( error ) {
            return event.target;
        }
    }

    function yearSelectPlugin( pluginConfig ) {
        var config = Object.assign( {}, defaultConfig, pluginConfig || {} );

        return function( fp ) {
            fp.config.dateFormat = config.dateFormat;
            fp.config.altFormat = config.altFormat;

            var self = {
                stubbedCurrentYear: null,
                yearsContainer: null,
                headerWrapper: null,
                rangeEl: null,
            };

            function setRangeElement() {
                if ( ! fp.rContainer ) {
                    return;
                }

                self.headerWrapper = fp.yearElements[0].parentNode ? fp.yearElements[0].parentNode.parentNode : null;
            }

            function clearUnnecessaryDOMElements() {
                if ( ! fp.rContainer ) {
                    return;
                }

                clearNode( fp.rContainer );

                for ( var i = 0; i < fp.monthElements.length; i += 1 ) {
                    var monthElement = fp.monthElements[i];
                    if ( ! monthElement.parentNode ) {
                        continue;
                    }
                    monthElement.parentNode.removeChild( monthElement );
                }

                for ( var j = 0; j < fp.yearElements.length; j += 1 ) {
                    var yearElement = fp.yearElements[j];
                    if ( ! yearElement.parentNode ) {
                        continue;
                    }
                    yearElement.parentNode.removeChild( yearElement );
                }

                while ( self.headerWrapper && self.headerWrapper.lastElementChild ) {
                    self.headerWrapper.removeChild( self.headerWrapper.lastElementChild );
                }
            }

            function buildYears() {
                if ( ! self.yearsContainer ) {
                    return;
                }

                clearNode( self.yearsContainer );

                var frag = document.createDocumentFragment();
                var startYear = fp.currentYear - ( fp.currentYear % 10 ) - 1;
                var endYear = startYear + 12;

                for ( var i = 0; i < 12; i += 1 ) {
                    var year = fp.createDay(
                        'flatpickr-yearSelect-year',
                        new Date( startYear + i, 0, 1 ),
                        0,
                        i
                    );

                    if ( year.dateObj.getFullYear() === new Date().getFullYear() ) {
                        year.classList.add( 'today' );
                    }

                    year.textContent = String( year.dateObj.getFullYear() );
                    year.setAttribute( 'data-year', year.textContent );
                    year.addEventListener( 'click', selectYear );
                    frag.appendChild( year );
                }

                self.yearsContainer.appendChild( frag );

                if ( fp.config.minDate && startYear <= fp.config.minDate.getFullYear() ) {
                    fp.prevMonthNav.classList.add( 'flatpickr-disabled' );
                } else {
                    fp.prevMonthNav.classList.remove( 'flatpickr-disabled' );
                }

                if ( fp.config.maxDate && endYear > fp.config.maxDate.getFullYear() ) {
                    fp.nextMonthNav.classList.add( 'flatpickr-disabled' );
                } else {
                    fp.nextMonthNav.classList.remove( 'flatpickr-disabled' );
                }
            }

            function build() {
                if ( ! fp.rContainer ) {
                    return;
                }

                self.yearsContainer = fp._createElement( 'div', 'flatpickr-yearSelect-years' );

                if ( ! self.yearsContainer ) {
                    return;
                }

                self.yearsContainer.tabIndex = -1;
                buildYears();
                fp.rContainer.appendChild( self.yearsContainer );

                self.rangeEl = fp._createElement( 'div', 'flatpickr-yearSelect-range' );

                var decadeStart = fp.currentYear - ( fp.currentYear % 10 );
                var decadeEnd = decadeStart + 10;
                self.rangeEl.textContent = decadeStart + ' - ' + decadeEnd;

                if ( self.headerWrapper ) {
                    self.headerWrapper.appendChild( self.rangeEl );
                }

                fp.calendarContainer.classList.add( 'flatpickr-yearSelect-theme-' + config.theme );
            }

            function setCurrentlySelected() {
                if ( ! fp.rContainer ) {
                    return;
                }
                if ( ! fp.selectedDates.length ) {
                    return;
                }

                var currentlySelected = fp.rContainer.querySelectorAll( '.flatpickr-yearSelect-year.selected' );

                for ( var i = 0; i < currentlySelected.length; i += 1 ) {
                    currentlySelected[i].classList.remove( 'selected' );
                }

                var targetYear = fp.selectedDates[0].getFullYear();
                var selectedYear = fp.rContainer.querySelector(
                    '.flatpickr-yearSelect-year[data-year="' + targetYear + '"]'
                );

                if ( targetYear && selectedYear ) {
                    selectedYear.classList.add( 'selected' );
                }
            }

            function setYear( date ) {
                var selectedDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );
                var selectedDates = [];

                switch ( fp.config.mode ) {
                    case 'single':
                        selectedDates = [ selectedDate ];
                        break;
                    case 'multiple':
                        selectedDates.push( selectedDate );
                        break;
                    case 'range':
                        if ( fp.selectedDates.length === 2 ) {
                            selectedDates = [ selectedDate ];
                        } else {
                            selectedDates = fp.selectedDates.concat( [ selectedDate ] );
                            selectedDates.sort( function( a, b ) {
                                return a.getTime() - b.getTime();
                            } );
                        }
                        break;
                }

                fp.setDate( selectedDates, true );
                setCurrentlySelected();
            }

            function selectYear( e ) {
                e.preventDefault();
                e.stopPropagation();

                var eventTarget = getEventTarget( e );

                if ( ! ( eventTarget instanceof Element ) ) {
                    return;
                }
                if ( eventTarget.classList.contains( 'flatpickr-disabled' ) ) {
                    return;
                }
                if ( eventTarget.classList.contains( 'notAllowed' ) ) {
                    return;
                }

                setYear( eventTarget.dateObj );

                if ( fp.config.closeOnSelect ) {
                    var single = fp.config.mode === 'single';
                    var range = fp.config.mode === 'range' && fp.selectedDates.length === 2;

                    if ( single || range ) {
                        fp.close();
                    }
                }
            }

            function bindEvents() {
                fp._bind( fp.prevMonthNav, 'click', function( e ) {
                    e.preventDefault();
                    e.stopPropagation();

                    var prevStartYear = fp.currentYear - ( fp.currentYear % 10 ) - 1;
                    fp.changeYear( prevStartYear - 1 );
                    buildYears();

                    if ( self.rangeEl ) {
                        var startToDisplay = fp.currentYear - ( fp.currentYear % 10 );
                        var endToDisplay = startToDisplay + 10;
                        self.rangeEl.textContent = startToDisplay + ' - ' + endToDisplay;
                    }
                } );

                fp._bind( fp.nextMonthNav, 'click', function( e ) {
                    e.preventDefault();
                    e.stopPropagation();

                    var nextStartYear = fp.currentYear - ( fp.currentYear % 10 ) - 1;
                    var nextEndYear = nextStartYear + 12;

                    fp.changeYear( nextEndYear );
                    buildYears();

                    if ( self.rangeEl ) {
                        var nextStartToDisplay = fp.currentYear - ( fp.currentYear % 10 );
                        var nextEndToDisplay = nextStartToDisplay + 10;
                        self.rangeEl.textContent = nextStartToDisplay + ' - ' + nextEndToDisplay;
                    }
                } );

                fp._bind( self.yearsContainer, 'mouseover', function( e ) {
                    var target = getEventTarget( e );
                    if ( fp.config.mode === 'range' && target ) {
                        fp.onMouseOver( target, 'flatpickr-yearSelect-year' );
                    }
                } );
            }

            var shifts = {
                ArrowLeft: -1,
                ArrowRight: 1,
                ArrowDown: 3,
                ArrowUp: -3,
            };

            function onKeyDown( _v, _vs, _instance, e ) {
                var shouldMove = shifts[e.key] !== undefined;
                if ( ! shouldMove && e.key !== 'Enter' ) {
                    return;
                }

                if ( ! fp.rContainer || ! self.yearsContainer ) {
                    return;
                }

                var currentlySelected = fp.rContainer.querySelector( '.flatpickr-yearSelect-year.selected' );
                var idx = Array.prototype.indexOf.call(
                    self.yearsContainer.children,
                    document.activeElement
                );

                if ( idx === -1 ) {
                    var target = currentlySelected || self.yearsContainer.firstElementChild;
                    target.focus();
                    idx = target.$i;
                }

                if ( shouldMove ) {
                    self.yearsContainer.children[
                        ( 12 + idx + shifts[e.key] ) % 12
                    ].focus();
                } else if (
                    e.key === 'Enter' &&
                    self.yearsContainer.contains( document.activeElement )
                ) {
                    setYear( document.activeElement.dateObj );
                }
            }

            function closeHook() {
                if ( fp.config && fp.config.mode === 'range' && fp.selectedDates.length === 1 ) {
                    fp.clear( false );
                }

                if ( ! fp.selectedDates.length ) {
                    buildYears();
                }
            }

            function stubCurrentYear() {
                self.stubbedCurrentYear = fp._initialDate.getFullYear();
                fp._initialDate.setFullYear( self.stubbedCurrentYear );
                fp.currentYear = self.stubbedCurrentYear;
                fp.currentMonth = 0;
            }

            function unstubCurrentYear() {
                if ( ! self.stubbedCurrentYear ) {
                    return;
                }
                fp._initialDate.setFullYear( self.stubbedCurrentYear );
                fp.currentYear = self.stubbedCurrentYear;
                self.stubbedCurrentYear = null;
                fp.currentMonth = 0;
            }

            function destroyPluginInstance() {
                if ( self.yearsContainer === null ) {
                    return;
                }

                var years = self.yearsContainer.querySelectorAll( '.flatpickr-yearSelect-year' );

                for ( var i = 0; i < years.length; i += 1 ) {
                    years[i].removeEventListener( 'click', selectYear );
                }
            }

            return {
                onParseConfig: function() {
                    fp.config.enableTime = false;
                },
                onValueUpdate: setCurrentlySelected,
                onKeyDown: onKeyDown,
                onReady: [
                    stubCurrentYear,
                    setRangeElement,
                    clearUnnecessaryDOMElements,
                    build,
                    bindEvents,
                    setCurrentlySelected,
                    function() {
                        fp.config.onClose.push( closeHook );
                        fp.loadedPlugins.push( 'yearSelect' );
                    },
                ],
                onDestroy: [
                    unstubCurrentYear,
                    destroyPluginInstance,
                    function() {
                        fp.config.onClose = fp.config.onClose.filter( function( hook ) {
                            return hook !== closeHook;
                        } );
                    },
                ],
            };
        };
    }

    return yearSelectPlugin;
} ) );
