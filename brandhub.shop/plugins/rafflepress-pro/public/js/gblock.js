var {
  __
} = wp.i18n;
var {
  createElement
} = wp.element;
var {
  registerBlockType
} = wp.blocks;
var {
  InspectorControls
} = wp.editor;
var {
  SelectControl,
  ToggleControl,
  PanelBody,
  ServerSideRender,
  Placeholder
} = wp.components;
const rafflepressIcon = createElement('svg', {
  width: 20,
  height: 20,
  viewBox: '0 0 394 416',
  className: 'dashicon'
}, createElement('path', {
  fill: 'currentColor',
  d: 'M161.294,281.219 C151.445,281.219 143.462,289.202 143.462,299.049 C143.462,308.896 151.445,316.878 161.294,316.878 C171.139,316.878 179.122,308.896 179.122,299.049 C179.122,289.202 171.139,281.219 161.294,281.219 Z M232.979,281.219 C223.132,281.219 215.149,289.202 215.149,299.049 C215.149,308.896 223.132,316.878 232.979,316.878 C242.826,316.878 250.806,308.896 250.806,299.049 C250.806,289.202 242.826,281.219 232.979,281.219 Z M32.608,123.757 C30.714,158.655 31.726,255.445 32.608,292.617 C32.68,295.618 34.565,297.889 37.042,299.527 C58.017,313.458 79.698,326.395 101.835,338.541 C98.77,308.445 98.261,273.714 107.731,252.542 C111.467,244.191 119.577,237.434 130.383,232.272 C111.019,204.919 98.751,172.762 95.699,143.461 C91.243,100.685 159.191,80.829 161.091,113.506 C163.202,149.839 167.026,185.74 173.214,221.056 C180.966,220.166 188.963,219.72 196.962,219.708 C205.077,219.704 213.195,220.154 221.06,221.056 C227.245,185.74 231.071,149.839 233.18,113.506 C235.079,80.829 303.03,100.685 298.574,143.461 C295.523,172.762 283.254,204.919 263.891,232.272 C274.694,237.434 282.806,244.191 286.542,252.542 C295.99,273.665 295.504,308.286 292.458,338.332 C314.469,326.252 336.023,313.381 356.885,299.527 C359.356,297.889 361.245,295.618 361.316,292.617 C362.199,255.445 363.21,158.655 361.316,123.757 C361.008,120.766 359.356,118.487 356.885,116.846 C307.739,84.205 254.723,57.023 201.025,32.736 C199.667,32.123 198.314,31.818 196.962,31.818 C195.61,31.818 194.257,32.123 192.902,32.736 C139.201,57.023 86.185,84.205 37.042,116.846 C34.565,118.487 32.913,120.766 32.608,123.757 Z M1.328,120.554 C2.595,108.178 9.333,97.499 19.644,90.651 C70.294,57.012 124.602,29.116 179.943,4.087 C190.893,-0.864 203.032,-0.864 213.981,4.087 C269.323,29.116 323.628,57.012 374.28,90.651 C384.913,97.713 392.019,109.24 392.712,122.052 C394.273,150.787 393.913,180.541 393.792,209.337 C393.674,237.33 393.416,265.374 392.75,293.359 C392.432,306.785 385.326,318.385 374.28,325.719 C323.628,359.361 269.323,387.262 213.981,412.29 C203.032,417.237 190.893,417.237 179.943,412.29 C124.602,387.262 70.294,359.361 19.644,325.719 C8.596,318.385 1.493,306.785 1.174,293.359 C0.509,265.374 0.248,237.33 0.132,209.337 C0.047,189.407 -0.464,137.991 1.328,120.554 L1.328,120.554 Z'
}));
registerBlockType('rafflepress/giveaway-selector', {
  title: rafflepress_gutenberg_giveaway_selector.i18n.title,
  description: rafflepress_gutenberg_giveaway_selector.i18n.description,
  icon: rafflepressIcon,
  keywords: [rafflepress_gutenberg_giveaway_selector.i18n.giveaway_keyword],
  category: 'widgets',
  attributes: {
    giveawayId: {
      type: 'string'
    }
  },
  edit(props) {
    const {
      attributes: {
        giveawayId = '',
        displayTitle = false,
        displayDesc = false
      },
      setAttributes
    } = props;
    const giveawayOptions = rafflepress_gutenberg_giveaway_selector.giveaways.map(value => ({
      value: value.id,
      label: value.name
    }));
    let jsx;
    giveawayOptions.unshift({
      value: '',
      label: rafflepress_gutenberg_giveaway_selector.i18n.giveaway_select
    });
    function selectForm(value) {
      setAttributes({
        giveawayId: value
      });
    }
    jsx = [/*#__PURE__*/React.createElement(InspectorControls, {
      key: "rafflepress-gutenberg-giveaway-selector-inspector-controls"
    }, /*#__PURE__*/React.createElement(PanelBody, {
      title: rafflepress_gutenberg_giveaway_selector.i18n.giveaway_settings
    }, /*#__PURE__*/React.createElement(SelectControl, {
      label: rafflepress_gutenberg_giveaway_selector.i18n.giveaway_selected,
      value: giveawayId,
      options: giveawayOptions,
      onChange: selectForm
    })))];
    if (giveawayId) {
      jsx.push( /*#__PURE__*/React.createElement(ServerSideRender, {
        key: "rafflepress-gutenberg-giveaway-selector-server-side-renderer",
        block: "rafflepress/giveaway-selector",
        attributes: props.attributes
      }));
    } else {
      jsx.push( /*#__PURE__*/React.createElement(Placeholder, {
        key: "rafflepress-gutenberg-giveaway-selector-wrap",
        className: "rafflepress-gutenberg-giveaway-selector-wrap"
      }, /*#__PURE__*/React.createElement("img", {
        src: rafflepress_gutenberg_giveaway_selector.logo_url
      }), /*#__PURE__*/React.createElement("h3", null, rafflepress_gutenberg_giveaway_selector.i18n.title), /*#__PURE__*/React.createElement(SelectControl, {
        key: "rafflepress-gutenberg-giveaway-selector-select-control",
        value: giveawayId,
        options: giveawayOptions,
        onChange: selectForm
      })));
    }
    return jsx;
  },
  save() {
    return null;
  }
});