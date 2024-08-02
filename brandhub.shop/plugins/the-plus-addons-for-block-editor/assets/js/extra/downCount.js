
// Define downCount function
function downCount(selector, options, callback) {
    var settings = Object.assign({
        date: null,
        offset: null
    }, options);

    // Throw error if date is not set
    if (!settings.date) {
        throw new Error('Date is not defined.');
    }

    // Throw error if date is set incorrectly
    if (!Date.parse(settings.date)) {
        throw new Error('Incorrect date format, it should look like this, 12/24/2012 12:00:00.');
    }

    // Save container
    var container = selector

    /**
     * Change client's local date to match offset timezone
     * @return {Object} Fixed Date object.
     */
    function currentDate() {
        // get client's current date
        var date = new Date();

        // turn date to utc
        var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

        // set new Date object
        var new_date = new Date(utc + (3600000 * settings.offset))

        return new_date;
    }

    /**
     * Main downCount function that calculates everything
     */
    function countdown() {
        var target_date = new Date(settings.date), // set target date
            current_date = currentDate(); // get fixed current date

        // difference of dates
        var difference = target_date - current_date;

        // if difference is negative then it's past the target date
        if (difference < 0) {
            // stop timer
            clearInterval(interval);

            if (callback && typeof callback === 'function') callback();

            return;
        }

        // basic math variables
        var _second = 1000,
            _minute = _second * 60,
            _hour = _minute * 60,
            _day = _hour * 24;

        // calculate dates
        var days = Math.floor(difference / _day),
            hours = Math.floor((difference % _day) / _hour),
            minutes = Math.floor((difference % _hour) / _minute),
            seconds = Math.floor((difference % _minute) / _second);

        // fix dates so that it will show two digits
        days = (String(days).length >= 2) ? days : '0' + days;
        hours = (String(hours).length >= 2) ? hours : '0' + hours;
        minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
        seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

        // based on the date change the reference wording
        var ref_days = (days === 1) ? 'day' : 'days',
            ref_hours = (hours === 1) ? 'hour' : 'hours',
            ref_minutes = (minutes === 1) ? 'minute' : 'minutes',
            ref_seconds = (seconds === 1) ? 'second' : 'seconds';

        // set to DOM
        container.querySelector('.days').textContent = days;
        container.querySelector('.hours').textContent = hours;
        container.querySelector('.minutes').textContent = minutes;
        container.querySelector('.seconds').textContent = seconds;

        container.querySelector('.days_ref').textContent = ref_days;
        container.querySelector('.hours_ref').textContent = ref_hours;
        container.querySelector('.minutes_ref').textContent = ref_minutes;
        container.querySelector('.seconds_ref').textContent = ref_seconds;
    };

    // start
    var interval = setInterval(countdown, 1000);
}

// Expose the downCount function globally
window.downCount = downCount;

