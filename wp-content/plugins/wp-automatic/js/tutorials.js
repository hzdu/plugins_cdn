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
  ],
  Amazon: [
    {
      title: "How to import from Amazon to WordPress",
      url: "https://www.youtube.com/watch?v=RlXYMAP_qlw",
    },
    {
      title:
        "How to import all Amazon wish list products to WordPress using WordPress Automatic",
      url: "https://www.youtube.com/watch?v=LpTgZRRIXJI",
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
