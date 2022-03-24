=== Give Manual Donations ===
Contributors: givewp
Tags: manual, donations, donation
Requires at least: 4.9
Tested up to: 5.8
Stable tag: 1.6.0
Requires Give: 2.17.0
License: GPLv3
License URI: https://opensource.org/licenses/GPL-3.0

Provides an admin interface for manually creating donations in Give.

== Description ==

Provides an admin interface for manually creating donations in Give.

More information at [givewp.com](https://givewp.com/addons/manual-donations).

== Installation ==

= Minimum Requirements =

* WordPress 4.9 or greater
* PHP version 5.6 or greater
* MySQL version 5.5 or greater

= Installation =

1. Activate the plugin
2. Go to Donations > Donations > New Donation

== Changelog ==

= 1.6.0: January 13th, 2022 =
* New: Add support for Peer-to-Peer add-on — you can now specify the campaign, team, and fundraiser for a donation

= 1.5.1: November 1st, 2021 =
* Change: Compatible with the new Form Field Manager 2.0 release!
* Fix: Payment method shows up correctly in donation receipt

= 1.5.0: October 28th, 2020 =
* New: Added compatibility with GiveWP 2.9.0
* New: Added compatibility with the new [Give Funds & Designations add-on](https://givewp.com/addons/funds-and-designations)
* Fix: Manual donations now show in reports data

= 1.4.7: August 25th, 2020 =
* Fix:  The Currency Switcher add-on compatibility received improvements so that when assigning a custom amount and switching between currencies the amount is accurately converted and applied.

= 1.4.6: January 15th, 2020 =
* Fix: Resolved an issue where the custom amount message on a set donation form would be incorrectly appended to the donation form title on the {donation} email tag.

= 1.4.5: June 6th, 2019 =
* Fix: Resolved issues with adding manual donations in different currencies when the Currency Switcher add-on is enabled. Custom amount values are now properly formatted to the selected currency format setting.

= 1.4.4: May 9th, 2019 =
* Fix: Resolved an issue validating whether the donor title prefix (Mr. Mrs. etc) field was required or not when creating a manual donation. In some configurations the title prefix was incorrectly preventing the manual donation from being created.

= 1.4.3: February 20th, 2019 =
* Fix: Internationalized date formats like "j F Y" are now properly formatted for the database entry.
* Fix: The "Company" field now properly saves to both the payment and donor meta.
* Fix: The "Donors" dropdown select now properly searches for additional donors via AJAX.
* Fix: Quickly double-clicking on the submit button will no longer result in multiple donations being created.

= 1.4.2: November 8th, 2018 =
* New: Added the ability to add Company name to a manual donation.
* New: Added the ability to mark a donor as anonymous.
* New: Added the ability to add a donor prefix (Mr. Mrs. etc) to a donor.
* New: Added the ability to add a donor comment to a manually added donation.

= 1.4.1: July 5th, 2018 =
* Fix: Properly store First Name and Last Name when created manually.
* Fix: Ensure emails get sent properly when a manual donation is made and email is selected.
* Fix: Apply correct date to newly created manual donations with a custom date.

= 1.4: May 2nd, 2018 =
* New: Added support for new recurring options found in Recurring Donations 1.6+ - please update recurring if you're using it alongside Manual Donations!

= 1.3.2: February 15th, 2018 =
* New: Added a filter within the donation validation method so other add-ons can hook in properly. This is in preparation for the Tributes add-on coming compatiblity release with Manual Donations.

= 1.3.1: January 29th, 2018 =
* Tweak: Added a metakey to easily detect whether a donation has been added manually or not.
* Tweak: Revised how manual donations loads translation files.

= 1.3: January 17th, 2018 =
* New: Added compatiblity with Give's MailChimp add-on so that now there's an option to opt-in a donor when creating a manual donation.
* New: Added compatiblity with Give's Fee Recovery add-on so that now there's an option to add fees covered when creating a manual donation.
* New: Added an option to create a WP Users while creating a new donor.
* Fix: Various UI touch ups and fixes.

= 1.2.2: December 29th, 2017 =
* New: Added the ability to attach new users to manual donations and make donors out of them. Previously you could only select existing donors or create a new donor without any ability to select already existing WP users.
* Tweak: Admins will be prompted when attempting to add a manual donation to a donation form that has been set to be closed after meeting the goal if that goal has been met. In order to add the manual donation the admin will need to increase the goal or not close the form.
* Fix: The address fieldset now loads with the default settings for country, state/county/province fields.
* Fix: Emails were not properly being sent in some PHP versions when the admin selected to send them to admins/donors.
* Fix: Minor PHP warnings.

= 1.2.1: December 11th, 2017 =
* Tweak: Removed "Settings" link from activation banner since this add-on doesn't have any settings page.
* Fix: Error when creating a recurring subscription that does not match a donation level.
* Fix: Currency field has incorrect number of decimals.
* Fix: State field was incorrectly loading red falsely indicating a validation issue on page load.
* Fix: The donor email field is now validated when creating a new donor with donation.
* Fix: The Form Field Manager repeater element wouldn't properly add new rows when being clicked.
* Fix: An incorrect dates would be generated for newly created donations not made on same day.

= 1.2 =
* New: Added the "Billing Address" fieldset to the manual donations screen.
* New: Added support for forms with custom forms built using the Form Field Manager add-on.
* Tweak: Once a donation is created you will no longer be redirected to the payments listing screen but rather remain on a page and a helpful notice will appear confirming the donation payment has been created.
* Fix: When a new donor is added the wp cache is busted so you will see that donor added even with aggressive caching.
* Fix: When switching to a multi-level form the amount field will update with the with default level amount.
* Fix: Date of Donation reverts to January 1970 when a different site language and date/time is selected.

= 1.1.1 =
* Fix: In Give 1.8 the "New Donor" button doesn't display the New Donor fields correctly.

= 1.1 =
* Fix: Main heading CSS conflict on donation listing page when a wp-admin notice was displayed. https://github.com/impress-org/give-manual-donations/issues/22
* Fix: Do not show "None" as an option for multi-level donation forms. https://github.com/impress-org/give-manual-donations/issues/38
* Fix: When there are more than 30 donation forms, they don't show up donation form dropdown select. https://github.com/impress-org/give-manual-donations/issues/42
* Tweak: Renamed `give_create_payment` action to `give_create_manual_payment` and `give_create_payment_nonce` to `give_create_manual_payment_nonce` to prevent potential conflicts with Give core. https://github.com/impress-org/give-manual-donations/issues/39

= 1.0.3 =
* New: The plugin now checks to see if Give is active and up to the minimum version required to run the plugin.

= 1.0.2 =
* Fix: Custom donation amounts now save correctly.
* Fix: All donors are listed in the Donor Dropdown field.

= 1.0.1 =
* Fix: Decimal amounts are now supported and validated according to currency settings - https://github.com/impress-org/give-manual-donations/issues/27
* New: Translation POT file for i18n and gulp task to easily generate updates.

= 1.0 =
* Plugin Release
