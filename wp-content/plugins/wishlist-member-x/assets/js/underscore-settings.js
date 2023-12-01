// set underscores template tags to {% %} instead of <% %>
_.templateSettings = {
  evaluate: /{%([\s\S]+?)%}/g,
  interpolate: /{%=([\s\S]+?)%}/g,
  escape: /{%-([\s\S]+?)%}/g
};
