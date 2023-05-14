// Description: This file contains the tutorials object and the function
//to update the tutorials list based on the selected camp type

const tutorials = {
  gpt3: [
    {
      title: "How to use OpenAI GPT3 in WordPress",
      url: "https://www.youtube.com/watch?v=cBfhaq1-BuQ",
    },
  ],
  Articles: [],
  Feeds: [
    {
      title: "How to import from RSS to WordPress",
      url: "https://www.youtube.com/watch?v=YgN5Hv3eJms",
    },
    {
      title: "How to import from RSS feeds protected with Cloudflare",
      url: "https://valvepress.com/how-to-import-from-rss-feeds-protected-with-cloudflare/",
    },
    {
      url: "https://valvepress.com/how-to-auto-post-google-news-to-wordpress/",
      title: "How to auto post Google News to WordPress",
    },
    { url: "https://youtu.be/vPTNRBcWvDY", title: "How to import Web Stories" },
    {url:"https://valvepress.com/how-to-import-from-a-specific-category-in-an-rss-feed/",title:"How to import from a specific category in an RSS feed"},
    {url:"https://valvepress.com/how-to-import-from-any-website-to-wordpress-in-multiple-languages/",title:"How to import from any website to WordPress in multiple languages"},
  
  ],
  Amazon: [
    {
      title: "How to import from Amazon to WordPress",
      url: "https://www.youtube.com/watch?v=RlXYMAP_qlw",
    },
    {
      url: "https://valvepress.com/how-to-import-specific-amazon-products-to-wordpress-using-wordpress-automatic-plugin/",
      title:
        "How to import specific Amazon products to WordPress using WordPress Automatic plugin",
    },
    {
      title:
        "How to import all Amazon wish list products to WordPress using WordPress Automatic",
      url: "https://www.youtube.com/watch?v=LpTgZRRIXJI",
    },

    {
      title: "How to import Amazon products from a specific country",
      url: "https://valvepress.com/how-to-import-amazon-products-from-a-specific-country-using-wordpress-automatic/",
    },

    {
      url: "https://valvepress.com/how-to-replace-your-old-amazon-associate-id-with-a-new-id-on-posts-products/",
      title:
        "How to replace your old Amazon Associate ID with a new ID on posts/products",
    },
    {
      url: "https://valvepress.com/how-to-import-amazon-products-from-a-specific-category-using-wordpress-automatic/",
      title:
        "How to import Amazon products from a specific category using WordPress Automatic",
    },
  ],
  Aliexpress: [
    {
      title: "How to Auto post AliExpress products to WordPress",
      url: "https://www.youtube.com/watch?v=Z9Z9Z9Z9Z9Z",
    },
  ],
  Clickbank: [
    {
      title: "How to import from ClickBank to Wordpress on autopilot",
      url: "https://www.youtube.com/watch?v=SOQeKeHxaUk",
    },
  ],
  Youtube: [
    {
      title: "How to import from Youtube to WordPress",
      url: "https://www.youtube.com/watch?v=UzR5WZq3Ad8",
    },
    {
      title:
        "How to import Youtube video transcript to WordPress and generate OpenAI GPT content from it",
      url: "https://www.youtube.com/watch?v=Ywa7DQ1oWZA",
    },
    {
      url: "https://valvepress.com/how-to-import-trending-youtube-videos-to-wordpress/",
      title: "How to import trending Youtube videos to WordPress",
    },
    {
      url: "https://valvepress.com/how-to-display-videos-as-a-grid-in-wordpress/",
      title: "How to display videos as a grid in WordPress",
    },
  ],
  Vimeo: [
    {
      title: "How to import from Vimeo to WordPress",
      url: "https://www.youtube.com/watch?v=DGVifWZt-yM",
    },
  ],
  Flicker: [
    {
      title: "How to import from Flickr to WordPress",
      url: "https://www.youtube.com/watch?v=60DFsrdR_kM",
    },
  ],
  eBay: [
    {
      title: "How to import from eBay to WordPress",
      url: "https://www.youtube.com/watch?v=at7i9vQUhaE",
    },
  ],
  Spintax: [
    {
      title: "How to use Spintax in WordPress Automatic",
      url: "https://www.youtube.com/watch?v=B3wvS1Q43Jk",
    },
  ],
  Facebook: [
    {
      title: "How to import from Facebook to WordPress",
      url: "https://www.youtube.com/watch?v=H4ASv23s5Bg",
    },
  ],
  Pinterest: [
    {
      title: "How to import from Pinterest to WordPress",
      url: "https://www.youtube.com/watch?v=V8CBQtt1pY8",
    },
  ],
  Instagram: [
    {
      title: "How to import from Instagram to WordPress",
      url: "https://www.youtube.com/watch?v=ygO6nlVBPkQ",
    },
  ],
  TikTok: [
    {
      title: "How to import TikTok videos to WordPress",
      url: "https://www.youtube.com/watch?v=TB64u0J1wz0",
    },
    {
      title:
        "How to post older TikTok videos to WordPress using Automatic Plugin",
      url: "https://valvepress.com/how-to-post-older-tiktok-videos-to-wordpress-using-automatic-plugin/",
    },
  ],
  Twitter: [
    {
      title: "How to import from Twitter to WordPress",
      url: "https://www.youtube.com/watch?v=uxmyfw4GptI",
    },
  ],
  SoundCloud: [
    {
      title: "How to import from SoundCloud to WordPress",
      url: "https://www.youtube.com/watch?v=3KED4jpdskc",
    },
  ],
  Craigslist: [
    {
      title: "How to import from Craigslist to WordPress",
      url: "https://www.youtube.com/watch?v=0G7FViAtdgg",
    },
  ],
  Itunes: [
    {
      title: "How to import from iTunes to WordPress",
      url: "https://www.youtube.com/watch?v=atNsWvKTtDk",
    },
  ],
  Envato: [
    {
      title: "How to import from Envato to WordPress",
      url: "https://www.youtube.com/watch?v=KOYP5uzN7LQ",
    },
  ],
  DailyMotion: [
    {
      title: "How to import DailyMotion videos to WordPress",
      url: "https://www.youtube.com/watch?v=Jokhx79qoU8",
    },
  ],
  Reddit: [
    {
      title: "How to import Reddit posts to WordPress",
      url: "https://www.youtube.com/watch?v=060myQMJoXI",
    },
  ],
  Walmart: [
    {
      title: "How to import from Walmart to WordPress",
      url: "https://www.youtube.com/watch?v=Cd2ODdH9Zpw",
    },
  ],
  Careerjet: [],
  Single: [
    {
      title: "How to import from a single page to WordPress post",
      url: "https://www.youtube.com/watch?v=zxM8CGRSi_w",
    },
  ],
  Multi: [
    {
      title: "Multi Page Scraper Etsy to WordPress",
      url: "https://www.youtube.com/watch?v=Q73nJaMkAH8",
    },
    {
      title: "how to import from any online shop to WooCommerce",
      url: "https://valvepress.com/how-to-import-from-any-online-shop-to-wordpress-woocommerce-products/",
    },
    {
      url: "https://valvepress.com/how-to-import-from-sites-with-infinite-scroll-using-wordpress-automatic-plugin/",
      title:
        "How to import from sites with infinite scroll using WordPress Automatic Plugin",
    },
    {
      url: "https://valvepress.com/how-to-import-protected-sites-content-to-wordpress-automatically/",
      title: "How to import protected sites content to WordPress automatically",
    },
    {
      url: "https://valvepress.com/how-to-import-from-rss-feeds-protected-with-cloudflare/",
      title: "How to import from sites protected with Cloudflare",
    },
    {
      url: "https://valvepress.com/sitemap-to-wordpress-posts/",
      title: "How to import sitemap to WordPress posts",
    },
    { url: "https://youtu.be/vPTNRBcWvDY", title: "How to import Web Stories" },
    {url:"https://valvepress.com/how-to-import-from-any-website-to-wordpress-in-multiple-languages/",title:"How to import from any website to WordPress in multiple languages"},
  ],
  General: [
    {
      url: "https://youtu.be/cBfhaq1-BuQ?t=224",
      title: "How to Integrate OpenAI GPT-3/ChatGPT with any module",
    },
    {
      url: "https://valvepress.com/how-to-automatically-generate-yoast-rank-math-seo-description-using-openai-gpt/",
      title: "How to automatically generate Yoast/Rank Math SEO description using OpenAI GPT",
    },
    {
      url: "https://valvepress.com/how-to-automatically-generate-wordpress-tags-using-openai-gpt-api/",
      title: "How to automatically generate WordPress tags using OpenAI GPT API",
    },
    {
      url: "https://valvepress.com/wordpress-internal-cron-job-work-may-need-setup-external-cron/",
      title: "How to setup a cron job to run WordPress Automatic campaigns automatically",
    },

    {
      url: "https://valvepress.com/how-to-open-wordpress-external-links-in-a-popup/",
      title: "How to open WordPress external links in a popup",
    },

    {
      url: "https://valvepress.com/how-to-know-used-custom-fields-names-by-wordpress-plugins-themes/",
      title: "How to know used custom fields names by WordPress plugins/themes",
    },

    {
      title: "How to set the primary category for posts imported automatically",
      url: "https://valvepress.com/how-to-set-the-primary-category-for-posts-imported-automatically/",
    },
    {
      url: "https://valvepress.com/how-to-format-dates-returned-from-wordpress-automatic/",
      title: "How to format dates returned from WordPress Automatic",
    },
    {
      url: "https://valvepress.com/how-to-post-contentiously-from-a-specific-campaign-at-wordpress-automatic/",
      title:
        "How to post contentiously from a specific campaign at WordPress Automatic",
    },
  ],
};

jQuery(document).ready(function ($) {
  //function to update the current list of tutorials based on the selected camp type
  const update_tutorials = (selected) => {
    //get the matching tutorials
    const current_tutorials = tutorials[selected];

    //clear the tutorials
    jQuery("#tutorials").html("");

    //loop through the tutorials
    current_tutorials.forEach((tutorial) => {
      //create the html
      const html = `<li><a href="${tutorial.url}" target="_blank">${tutorial.title}</a></li>`;
      //append the html
      jQuery("#tutorials").append(html);
    });

    //get general tutorials
    const general_tutorials = tutorials["General"];

    //clear the general tutorials
    jQuery("#general_tutorials").html("");

    //loop through the general tutorials
    general_tutorials.forEach((tutorial) => {
      //get the value of the select with id named camp_type and set as the html of the span with class module_name
      jQuery(".module_name").html( jQuery('#camp_type option:selected').text() );

      //create the html
      const html = `<li><a href="${tutorial.url}" target="_blank">${tutorial.title}</a></li>`;

      //append the html
      jQuery("#general_tutorials").append(html);
    });
  };

  //on page load, update the tutorials
  update_tutorials(jQuery("#camp_type").val());

  //on change of the camp type, update the tutorials
  jQuery("#camp_type").change(function () {
    //get the selected value
    var selected = jQuery(this).val();

    //log the selected value
    console.log("selected", selected);

    //update the tutorials
    update_tutorials(selected);
  });
});
