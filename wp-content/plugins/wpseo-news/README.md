Yoast News SEO for Yoast SEO
==========================
Requires at least: 5.6
Tested up to: 5.8
Stable tag: 13.1
Requires PHP: 5.6.20
Depends: Yoast SEO

Yoast News SEO module for the Yoast SEO plugin.

[![Code Climate](https://codeclimate.com/repos/54523c37e30ba0670f0016b8/badges/373c97133cba47d9822b/gpa.svg)](https://codeclimate.com/repos/54523c37e30ba0670f0016b8/feed)

This repository uses [the Yoast grunt tasks plugin](https://github.com/Yoast/plugin-grunt-tasks).

Installation
============

1. Go to Plugins -> Add New.
2. Click "Upload" right underneath "Install Plugins".
3. Upload the zip file that this readme was contained in.
4. Activate the plugin.
5. Go to SEO -> Extensions -> Licenses, enter your license key and Save.
6. Your license key will be validated.
7. You can now use Yoast News SEO. See also https://kb.yoast.com/kb/configuration-guide-for-news-seo/

Frequently Asked Questions
--------------------------

You can find the [Yoast News SEO FAQ](https://kb.yoast.com/kb/category/news-seo/) in our knowledge base.

Changelog
=========

### 13.1: November 16th, 2021
Enhancements:
* Huge performance improvement: moves the XML News sitemap to be based on our Indexables architecture. 
* Removes images from the XML News sitemap as they serve no purpose here and this further improves performance.

Other:
* Excludes attachments and non-indexed post types from the possible post types to include in the News Sitemap.

### 13.0: October 19th, 2021
Enhancements:
* Adds Schema Article News subtypes: `ReviewNewsArticle`, `AnalysisNewsArticle`, `AskPublicNewsArticle`, `BackgroundNewsArticle`, `OpinionNewsArticle`, and `ReportageNewsArticle`. 

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/news-seo-changelog).
