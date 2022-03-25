=== NinjaFirewall (WP+ Edition) ===
Contributors: nintechnet
Tags: security, firewall, malware, virus, protection, hack, antispam, scanner, hacked site, brute force, seguridad, seguranca, sicherheit, sicurezza, veiligheid, classicpress
Requires at least: 4.7
Tested up to: 5.9
Stable tag: 4.5.1
Requires PHP: 5.5
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

A true Web Application Firewall to protect and secure WordPress.

== Description ==

= A true Web Application Firewall =

NinjaFirewall (WP+ Edition) is a true Web Application Firewall. Although it can be installed and configured just like a plugin, it is a stand-alone firewall that stands in front of WordPress.

It allows any blog administrator to benefit from very advanced and powerful security features that usually aren't available at the WordPress level, but only in security applications such as the Apache [ModSecurity](http://www.modsecurity.org/ "") module or the PHP [Suhosin](http://suhosin.org/ "") extension.

> NinjaFirewall requires at least PHP 5.6, MySQLi extension and is only compatible with Unix-like OS (Linux, BSD). It is **not compatible with Microsoft Windows**.

NinjaFirewall can hook, scan, sanitise or reject any HTTP/HTTPS request sent to a PHP script before it reaches WordPress or any of its plugins. All scripts located inside the blog installation directories and sub-directories will be protected, including those that aren't part of the WordPress package. Even encoded PHP scripts, hackers shell scripts and backdoors will be filtered by NinjaFirewall.

= Powerful filtering engine =

NinjaFirewall includes **the most powerful filtering engine available in a WordPress plugin**. Its most important feature is its ability to normalize and transform data from incoming HTTP requests which allows it to detect Web Application Firewall evasion techniques and obfuscation tactics used by hackers, as well as to support and decode a large set of encodings. See our blog for a full description: [An introduction to NinjaFirewall filtering engine](https://blog.nintechnet.com/introduction-to-ninjafirewall-filtering-engine/ "").

= Features =

* Full standalone web application firewall. Works before WordPress is loaded.
* Powerful filtering engine.
* Supports a large set of encodings.
* Detects and blocks obfuscated code and evasion techniques used to bypass Web Application Firewalls.
* Protects against remote file inclusion, local file inclusion, cross-site scripting, code execution, SQL injections, brute-force scanners, shell scripts, backdoors etc.
* Scans and sanitises GET/POST requests, HTTP/HTTPS traffic, cookies, server variables (`HTTP_USER_AGENT`, `HTTP_REFERER`, `PHP_SELF`, `PATH_TRANSLATED`, `PATH_INFO`) and raw POST data.
* Sanitises variables names and values.
* Privilege escalation protection.
* Advanced filtering options to block ASCII control characters, NULL bytes and PHP built-in wrappers.
* Decodes and scans Base64-encoded POST requests to detect backdoors and code injection attempts.
* Hooks and secures HTTP reponse headers to prevent XSS, phishing and clickjacking attempts (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, `Content-Security-Policy`).
* Hooks and modifies cookies to set the `HttpOnly` flag.
* Blocks username enumeration scanning attempts through the author archives and the login page.
* Blocks/allows uploads, sanitises uploaded file names.
* Blocks suspicious bots and scanners.
* Hides PHP error and notice messages.
* Blocks direct access to PHP scripts located inside specific directories (e.g., `/wp-content/uploads/`).
* Protects WordPress XML-RPC API.
* Whitelist option for WordPress administrator(s), localhost and private IP address spaces.
* Configurable HTTP return code and message.
* Rules editor to enable/disable built-in security rules.
* Activity log and statistics.
* Debugging mode.
* And many more...

= Fastest and most efficient brute-force attack protection for WordPress =

By processing incoming HTTP requests before your blog and any of its plugins, NinjaFirewall is the only plugin for WordPress able to protect it against very large brute-force attacks, including distributed attacks coming from several thousands of different IPs.

See our benchmarks and stress-tests: [Brute-force attack detection plugins comparison](https://blog.nintechnet.com/wordpress-brute-force-attack-detection-plugins-comparison-2015/ "")

The protection applies to the `wp-login.php` script but can be extended to the `xmlrpc.php` one. The incident can also be written to the server `AUTH` log, which can be useful to the system administrator for monitoring purposes or banning IPs at the server level (e.g., Fail2ban).

= Real-time detection =

**File Guard** real-time detection is a totally unique feature provided by NinjaFirewall: it can detect, in real-time, any access to a PHP file that was recently modified or created, and alert you about this. If a hacker uploaded a shell script to your site (or injected a backdoor into an already existing file) and tried to directly access that file using his browser or a script, NinjaFirewall would hook the HTTP request and immediately detect that the file was recently modified or created. It would send you an alert with all details (script name, IP, request, date and time).

= File integrity monitoring  =

**File Check** lets you perform file integrity monitoring by scanning your website hourly, twicedaily or daily. Any modification made to a file will be detected: file content, file permissions, file ownership, timestamp as well as file creation and deletion.

= Watch your website traffic in real time =

**Live Log** lets you watch your website traffic in real time. It displays connections in a format similar to the one used by the `tail -f` Unix command. Because it communicates directly with the firewall, i.e., without loading WordPress, **Live Log** is fast, lightweight and it will not affect your server load, even if you set its refresh rate to the lowest value.

= Event Notifications =

NinjaFirewall can alert you by email on specific events triggered within your blog. Some of those alerts are enabled by default and it is highly recommended to keep them enabled. It is not unusual for a hacker, after breaking into your WordPress admin console, to install or just to upload a backdoored plugin or theme in order to take full control of your website. NinjaFirewall can also [attach a PHP backtrace](https://blog.nintechnet.com/ninjafirewall-wp-edition-adds-php-backtrace-to-email-notifications/ "NinjaFirewall adds PHP backtrace to email notifications") to important notifications.

Monitored events:

* Administrator login.
* Modification of any administrator account in the database.
* Plugins upload, installation, (de)activation, update, deletion.
* Themes upload, installation, activation, deletion.
* WordPress update.
* Pending security update in your plugins and themes.

= Stay protected against the latest WordPress security vulnerabilities =

To get the most efficient protection, NinjaFirewall can automatically update its security rules daily, twice daily or even hourly. Each time a new vulnerability is found in WordPress or one of its plugins/themes, a new set of security rules will be made available to protect your blog immediately.

= Shared Memory use =

Although NinjaFirewall is already much faster than other WordPress plugins, the WP+ Edition brings its performance to a whole new level by using Unix shared memory in order to speed things up even more. This allows easier and faster inter-process communication between the firewall and the plugin part of NinjaFirewall and, because its data and configuration are stored in shared memory segments, the firewall does not need to connect to the database any longer. This dramatically increases the processing speed (there is nothing faster than RAM), prevents blocking I/O and MySQL slow queries, specially on a very busy server like a multi-site network for instance. On average, the firewall processing speed will increase from 25% to 30%. Resource-intensive options like NinjaFirewall's Web Filter can get a 50% speed boost.

= Access Control =

Access Control is a powerful set of directives that can be used to allow or restrict access to your blog, depending on the User Role, IP, Geolocation, Requested URL, User-agent and visitors behavior (Rate Limiting). Those directives will be processed before the Firewall Policies and NinjaFirewall's built-in security rules. You can enable/disable firewall logging (Log event checkbox) for each access control directive separately.

= Web Filter =

If NinjaFirewall can hook and scan incoming requests, the WP+ Edition can also hook the response body (i.e., the output of the HTML page right before it is sent to your visitors browser) and search it for some specific keywords. Such a filter can be useful to detect hacking or malware patterns injected into your HTML page (text strings, spam links, malicious JavaScript code), hackers shell script, redirections and even errors (PHP/MySQL errors). Some suggested keywords as well as a default list are included.
In the case of a positive detection, NinjaFirewall will not block the response body but will send you an alert by email. It can even attach the whole HTML source of the page for your review.

= Centralized Logging =

NinjaFirewall (WP+ Edition) lets you remotely access the firewall log of all your NinjaFirewall protected websites from one single installation, using the [Centralized Logging](https://blog.nintechnet.com/centralized-logging-with-ninjafirewall/ "") feature. You do not need any longer to log in to individual servers to analyse your log data. There is no limit to the number of websites you can connect to, and they can be running any edition of NinjaFirewall: WP, WP+, Pro or Pro+.

= Antispam =

NinjaFirewall (WP+ Edition) can protect your blog comment and registration forms against spam. The protection is totally transparent to your visitors and does not require any interaction: no CAPTCHA, no math puzzles or trivia questions. Extremely easy to activate, but powerful enough to make spam bots life as miserable as possible.

= IPv6 compatibility =

IPv6 compatibility is a mandatory feature for a security plugin: if it supports only IPv4, **hackers can easily bypass the plugin by using an IPv6**. NinjaFirewall natively supports IPv4 and IPv6 protocols, for both public and private addresses.

= Multi-site support =

NinjaFirewall is multi-site compatible. It will protect all sites from your network and its configuration interface will be accessible only to the Super Admin from the network main site.

= Possibility to prepend your own PHP code to the firewall =

You can prepend your own PHP code to the firewall with the help of an [optional user configuration file](https://nintechnet.com/ninjafirewall/wp-edition/help/?htninja). It will be processed **before WordPress and all its plugins are loaded**. This is a very powerful feature, and there is almost no limit to what you can do: add your own security rules, manipulate HTTP requests, variables etc.

= Low Footprint Firewall =

NinjaFirewall is very fast, optimised, compact, and requires very low system resource.
See for yourself: download and install [Query Monitor](https://wordpress.org/plugins/query-monitor/ "") and [Xdebug Profiler](https://xdebug.org/ "") and compare NinjaFirewall performances with other security plugins.

= Non-Intrusive User Interface =

NinjaFirewall looks and feels like a built-in WordPress feature. It does not contain intrusive banners, warnings or flashy colors. It uses the WordPress simple and clean interface and is also smartphone-friendly.

= Contextual Help =

Each NinjaFirewall menu page has a contextual help screen with useful information about how to use and configure it.
If you need help, click on the *Help* menu tab located in the upper right corner of each page in your admin panel.

= Strong Privacy =

Unlike a Cloud Web Application Firewall, or Cloud WAF, NinjaFirewall works and filters the traffic on your own server and infrastructure. That means that your sensitive data (contact form messages, customers credit card number, login credentials etc) remains on your server and is not routed through a third-party company's servers, which could pose unnecessary risks (e.g., decryption of your HTTPS traffic in order to inspect it, employees accessing your data or logs in plain text, theft of private information, man-in-the-middle attack etc).

= Supported Languages =

* English
* French

= Requirements =

* WordPress 4.7+
* Admin/Superadmin with `manage_options` + `unfiltered_html capabilities`.
* MySQLi extension
* Apache / Nginx / LiteSpeed / Openlitespeed
* Unix-like OS (Linux, BSD) only. NinjaFirewall is **NOT** compatible with Microsoft Windows.

NinjaFirewall includes GeoLite data created by MaxMind, available from http://www.maxmind.com/

== Installation ==

1. Upload `nfwplus` folder to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Plugin settings are located in 'NinjaFirewall+' menu.


== Changelog ==

= 4.5.1 =

* Fixed a PHP "Cannot use object of type WP_Error as array" error.
* Activating/deactivating NinjaFirewall from WP CLI doesn't require the `--user` parameter anymore.
* On websites running PHP 7.3 or above, NinjaFirewall will use the hrtime() function instead of microtime() for its metrics, because it is more reliable as it is not based on the internal system clock.
* WP+ Edition (Premium): Fixed a bug with right-to-left (RTL) WordPress sites where the checkboxes below the log were all messed up.
* The detection of base64-encoded injection has been slightly tweaked to lower the risk of false positives.
* WP+ Edition (Premium): The Bot Access Control input now accepts the following 6 additional characters: `( ) , ; ' "`.
* The "Monthly Statistics" graph and tooltip colours were improved.
* Updated Charts.js library.
* Small fixes and adjustments.
* WP+ Edition (Premium): Updated GeoIP databases.

= 4.5 =

* Added the possibility to enter custom HTTP response headers. See "Firewall Policies > Advanced Policies > HTTP response headers > Custom HTTP headers".
* Added the possibility to view the server's HTTP response headers. Click on the "Firewall Policies > Advanced Policies > HTTP response headers > HTTP headers test" button.
* Added a warning if WordPress is running inside a Docker image and the user wants to upgrade NinjaFirewall to Full WAF mode.
* Fixed a PHP "Undefined array key pluginzip" warning when reinstalling a plugin from a ZIP archive.
* WP+ Edition (Premium): The Access Control URI whitelist and blacklist now support permalinks.
* Fixed an issue where the daily report could be sent multiple times on some multisite installations.
* Fixed deprecated readonly() function message on WordPress 5.9.
* Fixed an issue where the firewall would wrongly send a WordPress update notification.
* WP+ Edition (Premium): Updated Stripes webhook notifications IP addresses in the Access Control section.
* Updated Charts.js library.
* WP+ Edition (Premium): Updated GeoIP databases.
* Many small fixes and adjustments.
