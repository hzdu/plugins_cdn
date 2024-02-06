export default function cwfFormatDate( format: string, date: Date = null ): string {
    /**
     * Return a formatted string from a date Object mimicking PHP's date() functionality
     *
     * @param {string} format "Y-m-d H:i:s" or similar PHP-style date format string
     * @param {* | null} date Date Object, Datestring, or milliseconds
     *
     */
    if ( !date ) {
        // eslint-disable-next-line no-param-reassign
        date = new Date();
    }

    let string = '';
    const mo = date.getMonth(); // month (0-11)
    const m1 = mo + 1; // month (1-12)
    const dow = date.getDay(); // day of week (0-6)
    const d = date.getDate(); // day of the month (1-31)
    const y = date.getFullYear(); // 1999 or 2003
    const h = date.getHours(); // hour (0-23)
    const mi = date.getMinutes(); // minute (0-59)
    const s = date.getSeconds(); // seconds (0-59)

    for ( let i of format.match( /(\\)*./g ) ) {
        switch ( i ) {
            case 'j': // Day of the month without leading zeros  (1 to 31)
                string += d;
                break;

            case 'd': // Day of the month, 2 digits with leading zeros (01 to 31)
                string += ( d < 10 ) ? `0${d}` : d;
                break;

            case 'l': // (lowercase 'L') A full textual representation of the day of the week
                string += [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ][ dow ];
                break;

            case 'w': // Numeric representation of the day of the week (0=Sunday,1=Monday,...6=Saturday)
                string += dow;
                break;

            case 'D': // A textual representation of a day, three letters
                string += [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat' ][ dow ];
                break;

            case 'm': // Numeric representation of a month, with leading zeros (01 to 12)
                string += ( m1 < 10 ) ? `0${m1}` : m1;
                break;

            case 'n': // Numeric representation of a month, without leading zeros (1 to 12)
                string += m1;
                break;

            case 'F': // A full textual representation of a month, such as January or March
                string += [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ][ mo ];
                break;

            case 'M': // A short textual representation of a month, three letters (Jan - Dec)
                string += [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][ mo ];
                break;

            case 'Y': // A full numeric representation of a year, 4 digits (1999 OR 2003)
                string += y;
                break;

            case 'y': // A two digit representation of a year (99 OR 03)
                string += y.toString().slice( -2 );
                break;

            case 'H': // 24-hour format of an hour with leading zeros (00 to 23)
                string += ( h < 10 ) ? `0${h}` : h;
                break;

            case 'g': // 12-hour format of an hour without leading zeros (1 to 12)
                var hour = ( h === 0 ) ? 12 : h;
                string += ( hour > 12 ) ? hour - 12 : hour;
                break;

            case 'h': // 12-hour format of an hour with leading zeros (01 to 12)
                var hour = ( h === 0 ) ? 12 : h;
                hour = ( hour > 12 ) ? hour - 12 : hour;
                string += ( hour < 10 ) ? `0${hour}` : hour;
                break;

            case 'a': // Lowercase Ante meridiem and Post meridiem (am or pm)
                string += ( h < 12 ) ? 'am' : 'pm';
                break;

            case 'i': // Minutes with leading zeros (00 to 59)
                string += ( mi < 10 ) ? `0${mi}` : mi;
                break;

            case 's': // Seconds, with leading zeros (00 to 59)
                string += ( s < 10 ) ? `0${s}` : s;
                break;

            case 'c': // ISO 8601 date (eg: 2012-11-20T18:05:54.944Z)
                string += date.toISOString();
                break;

            default:
                if ( i.startsWith( '\\' ) ) i = i.substr( 1 );
                string += i;
        }
    }
    return string;
}
