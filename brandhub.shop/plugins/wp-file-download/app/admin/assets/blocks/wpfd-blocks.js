/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
module.exports = __webpack_require__(3);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
  var __ = wpI18n.__;
  var Component = wpElement.Component,
      Fragment = wpElement.Fragment,
      React = wpElement.React;
  var registerBlockType = wpBlocks.registerBlockType;
  var TextControl = wpComponents.TextControl,
      Spinner = wpComponents.Spinner,
      Icon = wpComponents.Icon;


  var fetchingQueue = null;
  var categoriesDropdown = null;
  var previewImageData = 'data:image/png;base64,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';
  var categoryIcon = wp.element.createElement(
    "svg",
    { className: "dashicon", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
    wp.element.createElement("path", { fill: "none", d: "M0 0h24v24H0V0z" }),
    wp.element.createElement("path", {
      d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z" })
  );
  var folderIcon = wp.element.createElement(
    "svg",
    { className: "dashicon", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
    wp.element.createElement("path", { d: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" }),
    wp.element.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
  );
  var loadingIcon = wp.element.createElement(
    "svg",
    { className: 'wpfd-loading', width: "100%", height: "100%", xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid" },
    wp.element.createElement(
      "g",
      { transform: "translate(25 50)" },
      wp.element.createElement(
        "circle",
        { cx: "0", cy: "0", r: "10", fill: "#cfcfcf", transform: "scale(0.590851 0.590851)" },
        wp.element.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.8666666666666667s", calcMode: "spline",
          keySplines: "0.3 0 0.7 1;0.3 0 0.7 1", values: "0.5;1;0.5", keyTimes: "0;0.5;1", dur: "2.6s",
          repeatCount: "indefinite" })
      )
    ),
    wp.element.createElement(
      "g",
      { transform: "translate(50 50)" },
      wp.element.createElement(
        "circle",
        { cx: "0", cy: "0", r: "10", fill: "#cfcfcf", transform: "scale(0.145187 0.145187)" },
        wp.element.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.43333333333333335s", calcMode: "spline",
          keySplines: "0.3 0 0.7 1;0.3 0 0.7 1", values: "0.5;1;0.5", keyTimes: "0;0.5;1", dur: "2.6s",
          repeatCount: "indefinite" })
      )
    ),
    wp.element.createElement(
      "g",
      { transform: "translate(75 50)" },
      wp.element.createElement(
        "circle",
        { cx: "0", cy: "0", r: "10", fill: "#cfcfcf", transform: "scale(0.0339143 0.0339143)" },
        wp.element.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "0s", calcMode: "spline",
          keySplines: "0.3 0 0.7 1;0.3 0 0.7 1", values: "0.5;1;0.5", keyTimes: "0;0.5;1", dur: "2.6s",
          repeatCount: "indefinite" })
      )
    )
  );

  var WpfdCategoryEdit = function (_Component) {
    _inherits(WpfdCategoryEdit, _Component);

    function WpfdCategoryEdit() {
      _classCallCheck(this, WpfdCategoryEdit);

      var _this = _possibleConstructorReturn(this, (WpfdCategoryEdit.__proto__ || Object.getPrototypeOf(WpfdCategoryEdit)).apply(this, arguments));

      _this.state = {
        categoriesList: [],
        searchText: '',
        selectedCatName: '',
        selectedCatId: '',
        showCategoryList: false,
        isManagingFocus: false,
        showInput: false,
        loading: true,
        error: false,
        preview: false
        // this.categoriesDropdown = this.categoriesDropdown.bind(this)
      };_this.searchCategoryHandle = _this.searchCategoryHandle.bind(_this);
      _this.fetchCategories = _this.fetchCategories.bind(_this);
      _this.setSelectedCategoryId = _this.setSelectedCategoryId.bind(_this);
      _this.handleClickOutside = _this.handleClickOutside.bind(_this);
      return _this;
    }

    _createClass(WpfdCategoryEdit, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _props$attributes = this.props.attributes,
            shortcode = _props$attributes.shortcode,
            selectedCatName = _props$attributes.selectedCatName,
            isPreview = _props$attributes.isPreview,
            selectedCategoryId = _props$attributes.selectedCategoryId;

        if (isPreview) {
          this.setState({ preview: true });
        } else {
          document.addEventListener('mousedown', this.handleClickOutside);

          // this.fetchCategories(false);

          if (shortcode) {
            this.setState({ showInput: false, searchText: shortcode, selectedCatName: selectedCatName });
          }
        }

        if (typeof selectedCategoryId != 'undefined') {
          this.initLoadCategories(selectedCategoryId);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var _state = this.state,
            categoriesList = _state.categoriesList,
            showCategoryList = _state.showCategoryList,
            searchText = _state.searchText;
        var attributes = this.props.attributes;
        var selectedCategoryId = attributes.selectedCategoryId;

        var self = this;

        if (categoriesList.length === 0 && showCategoryList) {
          this.fetchCategories();
        }
        jQuery(document).ready(function () {
          var wpfd_tree = jQuery('.wpfd-foldertree');
          if (wpfd_tree.length) {
            wpfd_tree.each(function () {
              var curTheme = jQuery(this).closest('.wpfd-content').find('.wpfd_root_category_theme').val();
              var wpfd_topCat = jQuery(this).parents('.wpfd-content-' + curTheme + '.wpfd-content-multi').data('category');
              jQuery(this).jaofiletree({
                script: ajaxurl + "?juwpfisadmin=false&action=wpfd&task=categories.getCats",
                usecheckboxes: false,
                root: wpfd_topCat,
                expanded: false
              });
            });
          }
          var wpfd_subcategory = jQuery('.wpfd-content a.wpfdcategory');
          if (wpfd_subcategory.length) {
            wpfd_subcategory.each(function () {
              var curTheme = jQuery(this).closest('.wpfd-content').find('.wpfd_root_category_theme').val();
              jQuery(this).addClass(curTheme + '_category');
            });
          }
          if (jQuery('.wpfd-category-block').length && !jQuery('.categories-dropdown').length) {
            jQuery('.wpfd-category-block').removeClass('wpfd-category-block-selected');
          }
        });
      }
    }, {
      key: "handleClickOutside",
      value: function handleClickOutside(event) {
        var domNode = this.categoriesDropdown;
        var shortcode = this.props.attributes.shortcode;


        if (!domNode || !domNode.contains(event.target)) {
          this.setState({ showInput: false, showCategoryList: false });
        }
      }
    }, {
      key: "initLoadCategories",
      value: function initLoadCategories(id) {
        if (parseInt(id) !== 0) {
          var setAttributes = this.props.setAttributes;

          var wpfdCategoriesHTML = ajaxurl + "?action=wpfd&task=category.preview&wpfd_category_id=" + id;
          fetch(wpfdCategoriesHTML).then(function (res) {
            return res.json();
          }).then(function (result) {
            if (result.status) {
              setAttributes({
                catPreview: result.html
              });
            }
          },
          // errors
          function (error) {});
        }
      }
    }, {
      key: "fetchCategories",
      value: function fetchCategories() {
        var showList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

        var self = this;
        var wpfdCategoriesUrl = ajaxurl + "?action=wpfd&task=categories.listCats";

        if (fetchingQueue) {
          clearTimeout(fetchingQueue);
        }

        if (this.state.error) {
          this.setState({ error: false });
        }

        fetchingQueue = setTimeout(function () {
          if (!self.state.loading) {
            self.setState({ loading: true });
          }
          fetch(wpfdCategoriesUrl).then(function (response) {
            return response.json();
          }).then(function (response) {
            if (!response.success) {
              self.setState({
                loading: false,
                error: true
              });
            } else {
              self.setState({
                categoriesList: response.data,
                loading: false,
                showInput: showList,
                showCategoryList: showList
              });
              if (jQuery('.categories-dropdown').length) {
                jQuery('.categories-dropdown').closest('.wpfd-category-block').addClass('wpfd-category-block-selected');
              }
            }
          }).catch(function (error) {
            self.setState({
              loading: false,
              error: true
            });
          });
        }, 500);
      }
    }, {
      key: "setSelectedCategoryId",
      value: function setSelectedCategoryId(id, catname) {
        var setAttributes = this.props.setAttributes;
        // const {selectedCategoryId, shortcode} = attributes

        var shortCode = "[wpfd_category id=\"" + id + "\"]";

        setAttributes({ selectedCategoryId: id, shortcode: shortCode, catName: catname });

        this.initLoadCategories(id);

        this.setState({ selectedCatId: id, showCategoryList: false, searchText: shortCode, selectedCatName: catname, showInput: false });
      }
    }, {
      key: "searchCategoryHandle",
      value: function searchCategoryHandle(event) {
        var searchText = event.target.value;
        this.setState({ searchText: searchText, showCategoryList: true });
      }
    }, {
      key: "searchCategoryRecursive",
      value: function searchCategoryRecursive(category, categoriesIds, results) {
        if (typeof results === "undefined") {
          results = [];
        }

        if (!category || typeof category === 'undefined') {
          return results;
        }

        results.push(category);

        if (parseInt(category.parent) !== 0) {
          results = this.searchCategoryRecursive(categoriesIds[category.parent], categoriesIds, results);
        } else {
          results = this.searchCategoryRecursive(categoriesIds[category.parent], categoriesIds, results);
          results = results.reverse();
          return results;
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _state2 = this.state,
            categoriesList = _state2.categoriesList,
            searchText = _state2.searchText,
            selectedCatName = _state2.selectedCatName,
            showCategoryList = _state2.showCategoryList,
            showInput = _state2.showInput,
            loading = _state2.loading,
            preview = _state2.preview;
        var _props = this.props,
            attributes = _props.attributes,
            className = _props.className;
        var shortcode = attributes.shortcode,
            selectedCategoryId = attributes.selectedCategoryId,
            catName = attributes.catName,
            catPreview = attributes.catPreview;

        var filteredCategoriesList = void 0;
        var categoriesIds = [];
        var filterCategoryResults = [];

        filteredCategoriesList = categoriesList.filter(function (category) {
          if (typeof searchText === 'undefined') {
            return true;
          }
          if (searchText.toLowerCase().indexOf('wpfd_category') >= 0) {
            return true;
          }
          return category.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
        });

        // Search tree category handle on searching key exists
        if (filteredCategoriesList.length && searchText !== '') {
          // Index categories list with term_id
          categoriesList.map(function (lCategory, lIndex) {
            if (!lCategory || !lCategory.term_id) {
              return;
            }

            categoriesIds[lCategory.term_id] = lCategory;
          });

          // Search Filter in deep
          var insertedCategoriesIds = [];
          filteredCategoriesList.map(function (fCategory, fIndex) {
            if (typeof fCategory === "undefined") {
              return;
            }

            var queueSearchFilters = [];

            if (fCategory.parent && parseInt(fCategory.parent) !== 0) {
              queueSearchFilters = queueSearchFilters.concat(_this2.searchCategoryRecursive(fCategory, categoriesIds, queueSearchFilters));
              filterCategoryResults = filterCategoryResults.concat(queueSearchFilters);
            }
          });

          filterCategoryResults.map(function (insertedCategory) {
            if (typeof insertedCategory === "undefined") {
              return;
            }

            if (typeof insertedCategory.term_id === "undefined") {
              return;
            }

            insertedCategoriesIds[insertedCategory.term_id] = insertedCategory;
          });

          filteredCategoriesList.filter(function (isSearchCategory) {
            if (typeof isSearchCategory === 'undefined') {
              return;
            }

            if (parseInt(isSearchCategory.parent) === 0 && !insertedCategoriesIds.hasOwnProperty(isSearchCategory.term_id)) {
              filterCategoryResults.push(isSearchCategory);
            }
          });

          filterCategoryResults = filterCategoryResults.filter(function (resultCategory) {
            return typeof resultCategory !== 'undefined';
          });
        } else {
          // Search on init
          filterCategoryResults = filteredCategoriesList;
        }

        return preview ? wp.element.createElement("img", { alt: __('WP File Download Category', 'wpfd'), width: "100%", src: previewImageData }) : wp.element.createElement(
          "div",
          { className: className },
          wp.element.createElement(
            "div",
            { className: "wpfd-category-block" },
            wp.element.createElement(
              "div",
              { className: "wpfd-category-search" },
              wp.element.createElement(
                "label",
                { htmlFor: "wpfd-category" },
                wp.element.createElement(Icon, { icon: categoryIcon }),
                __('WP File Download Category', 'wpfd')
              ),
              showInput ? wp.element.createElement(
                Fragment,
                null,
                wp.element.createElement("textarea", {
                  type: "text",
                  value: searchText,
                  className: "editor-plain-text input-control",
                  id: "wpfd-category",
                  placeholder: __('Search for file category…', 'wpfd'),
                  onChange: this.searchCategoryHandle
                }),
                showCategoryList && wp.element.createElement(
                  "div",
                  { className: "categories-dropdown", ref: function ref(elm) {
                      return _this2.categoriesDropdown = elm;
                    } },
                  loading ? wp.element.createElement(
                    "div",
                    { className: 'wpfd-loading-wrapper' },
                    wp.element.createElement(Icon, { className: 'wpfd-loading', icon: loadingIcon })
                  ) : wp.element.createElement(
                    "ul",
                    null,
                    categoriesList.length > 0 ? filterCategoryResults.length > 0 ? filterCategoryResults.map(function (category, index) {
                      var haveChild = typeof categoriesList[index + 1] !== 'undefined' && categoriesList[index + 1].level > 0 && categoriesList[index + 1].level > category.level;
                      var paddingLeft = category.level * 12;
                      if (!haveChild) {
                        paddingLeft += 14;
                      }
                      var selectedClass = '';
                      if (selectedCategoryId === category.term_id) {
                        selectedClass = 'active';
                      }
                      return wp.element.createElement(
                        "li",
                        {
                          key: index,
                          className: "wpfd-category cat-lv-" + category.level + " " + selectedClass,
                          style: { paddingLeft: paddingLeft + 'px' },
                          "data-id-category": category.term_id,
                          "data-id-parent": category.parent,
                          "data-cloud-type": category.cloudType,
                          "data-level": category.level,
                          onClick: function onClick() {
                            return _this2.setSelectedCategoryId(category.term_id, category.path);
                          }
                        },
                        category.level < 16 && haveChild && wp.element.createElement("span", {
                          className: 'wpfd-toggle-expand'
                        }),
                        category.cloudType === category.term_id || category.cloudType === false ? wp.element.createElement(Icon, { icon: folderIcon }) : wp.element.createElement("i", { className: category.cloudType.toString().replace('_', '-') + '-icon' }),
                        wp.element.createElement(
                          "span",
                          { className: 'wpfd-category-name' },
                          category.name
                        ),
                        category.cloudType === false && wp.element.createElement(
                          "span",
                          { className: 'wpfd-category-count' },
                          "(" + category.count + ")"
                        )
                      );
                    }) : wp.element.createElement(
                      "li",
                      null,
                      __('No file category found with this name…', 'wpfd')
                    ) : wp.element.createElement(
                      "li",
                      null,
                      __('No category found!', 'wpfd')
                    )
                  )
                )
              ) : wp.element.createElement(
                Fragment,
                null,
                wp.element.createElement("textarea", {
                  value: shortcode,
                  className: "editor-plain-text input-control",
                  id: "wpfd-category",
                  placeholder: __('Click here to select a category', 'wpfd'),
                  onFocus: function onFocus() {
                    return _this2.setState({
                      showCategoryList: true,
                      showInput: true,
                      searchText: '',
                      loading: true,
                      selectedCatname: '',
                      categoriesList: []
                    });
                  },
                  onBlur: function onBlur() {
                    return _this2.setState({
                      showCategoryList: false,
                      showInput: false,
                      loading: false,
                      searchText: shortcode,
                      selectedCatName: catName,
                      categoriesList: []
                    });
                  },
                  onChange: function onChange() {}
                })
              )
            ),
            catName !== '' && selectedCategoryId && showInput === false && wp.element.createElement("div", { className: "wpfd-selected-category", dangerouslySetInnerHTML: { __html: catPreview || '' } })
          )
        );
      }
    }], [{
      key: "checkAttrChanged",
      value: function checkAttrChanged(prevAttrs, curAttrs) {
        var prevSelectedCategoryId = prevAttrs.selectedCategoryId;
        var selectedCategoryId = curAttrs.selectedCategoryId;


        return selectedCategoryId !== prevSelectedCategoryId;
      }
    }]);

    return WpfdCategoryEdit;
  }(Component);

  var WpfdCategorySave = function (_Component2) {
    _inherits(WpfdCategorySave, _Component2);

    function WpfdCategorySave() {
      _classCallCheck(this, WpfdCategorySave);

      return _possibleConstructorReturn(this, (WpfdCategorySave.__proto__ || Object.getPrototypeOf(WpfdCategorySave)).apply(this, arguments));
    }

    _createClass(WpfdCategorySave, [{
      key: "render",
      value: function render() {
        var _props2 = this.props,
            attributes = _props2.attributes,
            className = _props2.className;

        return wp.element.createElement(
          "div",
          { className: className },
          attributes.shortcode
        );
      }
    }]);

    return WpfdCategorySave;
  }(Component);

  registerBlockType('wpfd/wpfd-category', {
    title: __('WP File Download Category', 'wpfd'),
    description: __('Showing WP File Download Category.', 'wpfd'),
    icon: {
      src: categoryIcon,
      foreground: undefined
    },
    category: 'wp-file-download',
    keywords: [__('wpfd', 'wpfd'), __('category', 'wpfd'), __('file category', 'wpfd'), __('wp file download', 'wpfd'), __('download', 'wpfd'), __('file', 'wpfd'), __('wpfd category', 'wpfd'), __('wpfd folder', 'wpfd'), __('folder', 'wpfd'), __('wpfd file', 'wpfd')],
    example: {
      attributes: {
        isPreview: true
      }
    },
    attributes: {
      isPreview: {
        type: 'boolean'
      },
      selectedCategoryId: {
        type: 'number'
      },
      shortcode: {
        type: 'string'
      },
      catName: {
        type: 'string'
      },
      className: {
        type: 'string'
      }
    },
    edit: WpfdCategoryEdit,
    save: WpfdCategorySave
  });
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
  var __ = wpI18n.__;
  var Component = wpElement.Component,
      Fragment = wpElement.Fragment;
  var registerBlockType = wpBlocks.registerBlockType;
  var Icon = wpComponents.Icon,
      Modal = wpComponents.Modal;

  var fetchingQueue = null;

  var previewImageData = 'data:image/png;base64,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';
  var categoryIcon = wp.element.createElement(
    "svg",
    { className: "dashicon", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
    wp.element.createElement("path", { fill: "none", d: "M0 0h24v24H0V0z" }),
    wp.element.createElement("path", {
      d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z" })
  );
  var folderIcon = wp.element.createElement(
    "svg",
    { className: "dashicon", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
    wp.element.createElement("path", { d: "M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" }),
    wp.element.createElement("path", { d: "M0 0h24v24H0z", fill: "none" })
  );
  var loadingIcon = wp.element.createElement(
    "svg",
    { className: 'wpfd-loading', width: "100%", height: "100%", xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid" },
    wp.element.createElement(
      "g",
      { transform: "translate(25 50)" },
      wp.element.createElement(
        "circle",
        { cx: "0", cy: "0", r: "10", fill: "#cfcfcf", transform: "scale(0.590851 0.590851)" },
        wp.element.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.8666666666666667s", calcMode: "spline",
          keySplines: "0.3 0 0.7 1;0.3 0 0.7 1", values: "0.5;1;0.5", keyTimes: "0;0.5;1", dur: "2.6s",
          repeatCount: "indefinite" })
      )
    ),
    wp.element.createElement(
      "g",
      { transform: "translate(50 50)" },
      wp.element.createElement(
        "circle",
        { cx: "0", cy: "0", r: "10", fill: "#cfcfcf", transform: "scale(0.145187 0.145187)" },
        wp.element.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "-0.43333333333333335s", calcMode: "spline",
          keySplines: "0.3 0 0.7 1;0.3 0 0.7 1", values: "0.5;1;0.5", keyTimes: "0;0.5;1", dur: "2.6s",
          repeatCount: "indefinite" })
      )
    ),
    wp.element.createElement(
      "g",
      { transform: "translate(75 50)" },
      wp.element.createElement(
        "circle",
        { cx: "0", cy: "0", r: "10", fill: "#cfcfcf", transform: "scale(0.0339143 0.0339143)" },
        wp.element.createElement("animateTransform", { attributeName: "transform", type: "scale", begin: "0s", calcMode: "spline",
          keySplines: "0.3 0 0.7 1;0.3 0 0.7 1", values: "0.5;1;0.5", keyTimes: "0;0.5;1", dur: "2.6s",
          repeatCount: "indefinite" })
      )
    )
  );

  var WpfdFileEdit = function (_Component) {
    _inherits(WpfdFileEdit, _Component);

    function WpfdFileEdit() {
      _classCallCheck(this, WpfdFileEdit);

      var _this = _possibleConstructorReturn(this, (WpfdFileEdit.__proto__ || Object.getPrototypeOf(WpfdFileEdit)).apply(this, arguments));

      _this.state = {
        filesList: [],
        categoriesList: [],
        shortcode: '',
        selectedFileId: '',
        filename: null,
        fileHoverId: null,
        categorySeletedId: null,
        isOpenModal: false,
        loading: true,
        fileLoading: false,
        error: false,
        fileError: false,
        fileClasses: '',
        preview: false
      };
      _this.fetchCategories = _this.fetchCategories.bind(_this);
      _this.fetchFiles = _this.fetchFiles.bind(_this);
      _this.openModal = _this.openModal.bind(_this);
      _this.setSelectedFile = _this.setSelectedFile.bind(_this);
      _this.updateInput = _this.updateInput.bind(_this);
      _this.toggleCategories = _this.toggleCategories.bind(_this);
      return _this;
    }

    _createClass(WpfdFileEdit, [{
      key: "openModal",
      value: function openModal() {
        this.setState({ isOpenModal: true });
        var categoriesList = this.state.categoriesList;
        var attributes = this.props.attributes;
        var selectedFileCatId = attributes.selectedFileCatId,
            selectedFileId = attributes.selectedFileId;


        if (categoriesList.length === 0) {
          this.fetchCategories();
        } else {
          if (selectedFileCatId && selectedFileId) {
            this.setState({ categorySelectedId: selectedFileCatId, fileHoverId: selectedFileId, fileLoading: true });
            this.fetchFiles(selectedFileCatId);
          }
        }
      }
    }, {
      key: "setSelectedFile",
      value: function setSelectedFile(file) {
        var setAttributes = this.props.setAttributes;

        var fileName = file.name.replace('[', '&amp;#91;').replace(']', '&amp;#93;');
        if (file.categoryFrom == 'aws') {
          file.id = decodeURIComponent(file.id);
        }
        var shortCode = "[wpfd_single_file id=\"" + file.id + "\" catid=\"" + file.term_id + "\" name=\"" + fileName + "\"]";

        setAttributes({
          selectedFileCatId: file.term_id,
          selectedFileId: String(file.id),
          selectedFileName: fileName,
          shortCode: shortCode
        });

        this.initLoadFile(file.id, file.term_id);

        this.setState({ selectedFile: file, filename: fileName, isOpenModal: false, shortcode: shortCode });
      }
    }, {
      key: "updateInput",
      value: function updateInput(event) {
        var setAttributes = this.props.setAttributes;

        var shortcode = event.target.value;

        setAttributes({ shortCode: shortcode });
        this.setState({ isOpenModal: false, shortcode: shortcode });
      }
    }, {
      key: "fetchCategories",
      value: function fetchCategories() {
        var self = this;
        var attributes = this.props.attributes;
        var selectedFileCatId = attributes.selectedFileCatId,
            selectedFileId = attributes.selectedFileId;


        var url = ajaxurl + "?action=wpfd&task=categories.listCats";

        if (fetchingQueue) {
          clearTimeout(fetchingQueue);
        }

        if (this.state.error) {
          this.setState({ error: false });
        }

        fetchingQueue = setTimeout(function () {
          if (!self.state.loading) {
            self.setState({ loading: true });
          }
          fetch(url).then(function (response) {
            return response.json();
          }).then(function (response) {
            if (false === response.success) {
              self.setState({
                loading: false,
                error: true
              });
            } else {
              self.setState({
                categoriesList: response.data,
                loading: false
              });
              if (selectedFileCatId && selectedFileId) {
                self.setState({ categorySelectedId: selectedFileCatId, fileHoverId: selectedFileId, fileLoading: true });
                self.fetchFiles(selectedFileCatId);
              } else {
                if (response.data.length > 0) {
                  var firstCategoryId = response.data[0].term_id;
                  self.setState({ categorySelectedId: firstCategoryId, fileLoading: true });
                  self.fetchFiles(firstCategoryId);
                }
              }
            }
          }).catch(function (error) {
            self.setState({
              loading: false,
              error: true
            });
          });
        }, 500);
      }
    }, {
      key: "initLoadFile",
      value: function initLoadFile(id, term_id) {
        var setAttributes = this.props.setAttributes;

        var wpfdCategoriesHTML = ajaxurl + "?action=wpfd&task=file.preview&wpfd_file_id=" + id + "&wpfd_cat_id=" + term_id;
        fetch(wpfdCategoriesHTML).then(function (res) {
          return res.json();
        }).then(function (result) {
          if (result.status) {
            setAttributes({
              filePreview: result.html
            });
          }
        },
        // errors
        function (error) {});
      }
    }, {
      key: "fetchFiles",
      value: function fetchFiles(categoryId) {
        var self = this;
        var url = ajaxurl + "?action=wpfd&view=files&format=json&id_category=" + categoryId;

        if (fetchingQueue) {
          clearTimeout(fetchingQueue);
        }

        if (this.state.fileError) {
          this.setState({ fileError: false });
        }

        this.setState({ categorySelectedId: categoryId, fileClasses: 'wpfd-animation-enter' });

        fetchingQueue = setTimeout(function () {
          if (!self.state.fileLoading) {
            self.setState({ fileLoading: true });
          }
          if (categoryId) {
            fetch(url).then(function (response) {
              return response.json();
            }).then(function (response) {
              if (false === response.success) {
                self.setState({
                  fileLoading: false,
                  fileError: true
                });
              } else {
                self.setState({
                  filesList: response.data,
                  fileLoading: false,
                  fileClasses: 'wpfd-animation-enter'
                });
                setTimeout(function () {
                  self.setState({
                    fileClasses: 'wpfd-animation-enter wpfd-animation-enter-active'
                  });
                }, 250);
              }
            }).catch(function (error) {
              self.setState({
                fileLoading: false,
                fileError: true
              });
            });
          }
        }, 500);
      }
    }, {
      key: "toggleCategories",
      value: function toggleCategories(e) {
        var categoryItem = $(e.target).closest('.wpfd-category');
        var categoryLevel = categoryItem.data('level');
        var collapsed = categoryItem.hasClass('collapsed');

        categoryItem.nextUntil('.cat-lv-' + categoryLevel).each(function () {
          var thisLevel = $(this).data('level');
          if (thisLevel <= categoryLevel) {
            categoryLevel = thisLevel;
            return false;
          }
        });

        if (!collapsed) {
          categoryItem.nextUntil('.cat-lv-' + categoryLevel).hide();
          categoryItem.addClass('collapsed');
        } else {
          categoryItem.nextUntil('.cat-lv-' + categoryLevel).show().removeClass('collapsed');
          categoryItem.removeClass('collapsed');
        }
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _props$attributes = this.props.attributes,
            shortCode = _props$attributes.shortCode,
            selectedFileName = _props$attributes.selectedFileName,
            isPreview = _props$attributes.isPreview,
            selectedFileId = _props$attributes.selectedFileId,
            selectedFileCatId = _props$attributes.selectedFileCatId;

        if (isPreview) {
          this.setState({ preview: true });
        } else {
          if (shortCode && selectedFileName) {
            this.setState({ shortcode: shortCode, filename: selectedFileName });
          }
        }

        if (typeof selectedFileId != 'undefined' && typeof selectedFileCatId != 'undefined') {
          this.initLoadFile(selectedFileId, selectedFileCatId);
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _state = this.state,
            categoriesList = _state.categoriesList,
            filename = _state.filename,
            filesList = _state.filesList,
            fileHoverId = _state.fileHoverId,
            categorySelectedId = _state.categorySelectedId,
            shortcode = _state.shortcode,
            isOpenModal = _state.isOpenModal,
            loading = _state.loading,
            fileClasses = _state.fileClasses,
            fileLoading = _state.fileLoading,
            preview = _state.preview;
        var _props = this.props,
            className = _props.className,
            attributes = _props.attributes;
        var filePreview = attributes.filePreview;

        return preview ? wp.element.createElement("img", { alt: __('WP File Download File', 'wpfd'), width: "100%", src: previewImageData }) : wp.element.createElement(
          "div",
          { className: className },
          wp.element.createElement(
            "div",
            { className: "wpfd-file-block" },
            wp.element.createElement(
              "div",
              { className: "wpfd-file-search" },
              wp.element.createElement(
                "label",
                null,
                wp.element.createElement(Icon, { icon: categoryIcon }),
                __('WP File Download File', 'wpfd')
              ),
              wp.element.createElement(
                Fragment,
                null,
                wp.element.createElement("input", {
                  type: 'text',
                  value: shortcode,
                  className: "editor-plain-text input-control",
                  placeholder: __('Please select a file', 'wpfd'),
                  readOnly: true,
                  onChange: this.updateInput
                }),
                wp.element.createElement(
                  "button",
                  {
                    type: 'button',
                    className: 'wpfd-browse-files wpfd-button wpfd-material-button',
                    onClick: function onClick() {
                      return _this2.openModal();
                    }
                  },
                  __('Browse Files', 'wpfd')
                )
              )
            ),
            filename !== '' && wp.element.createElement("div", { className: "wpfd-selected-file-name", dangerouslySetInnerHTML: { __html: filePreview || '' } })
          ),
          isOpenModal && wp.element.createElement(
            Modal,
            {
              className: "wpfd-modal",
              title: __('WP File Download', 'wpfd'),
              onRequestClose: function onRequestClose() {
                return _this2.setState({ isOpenModal: false });
              } },
            loading ? wp.element.createElement(
              "div",
              { className: 'wpfd-loading-wrapper' },
              wp.element.createElement(Icon, { className: 'wpfd-loading', icon: loadingIcon })
            ) : wp.element.createElement(
              Fragment,
              null,
              wp.element.createElement(
                "div",
                { className: "wpfd-modal-content" },
                wp.element.createElement(
                  "div",
                  { className: "wpfd-modal-left-panel" },
                  wp.element.createElement(
                    "div",
                    { className: "categories-dropdown" },
                    wp.element.createElement(
                      "ul",
                      null,
                      categoriesList.length > 0 ? categoriesList.map(function (category, index) {
                        var haveChild = typeof categoriesList[index + 1] !== 'undefined' && categoriesList[index + 1].level > 0 && categoriesList[index + 1].level > category.level;
                        var paddingLeft = category.level * 12;
                        if (!haveChild) {
                          paddingLeft += 14;
                        }
                        return wp.element.createElement(
                          "li",
                          {
                            key: index,
                            className: "wpfd-category cat-lv-" + category.level + " " + (category.term_id === categorySelectedId ? 'active' : ''),
                            style: { paddingLeft: paddingLeft + 'px' },
                            "data-id-category": category.term_id,
                            "data-id-parent": category.parent,
                            "data-cloud-type": category.cloudType,
                            "data-level": category.level,
                            onClick: function onClick() {
                              return _this2.fetchFiles(category.term_id);
                            }
                          },
                          category.level < 16 && haveChild && wp.element.createElement("span", {
                            className: 'wpfd-toggle-expand'
                          }),
                          category.cloudType === category.term_id || category.cloudType === false ? wp.element.createElement(Icon, { icon: folderIcon }) : wp.element.createElement("i", { className: category.cloudType.toString().replace('_', '-') + '-icon' }),
                          wp.element.createElement(
                            "span",
                            {
                              className: 'wpfd-category-name'
                            },
                            category.name
                          ),
                          wp.element.createElement(
                            "span",
                            { className: 'wpfd-category-count' },
                            "(" + category.count + ")"
                          )
                        );
                      }) : wp.element.createElement(
                        "div",
                        { className: 'wpfd-nothing-found' },
                        __('No category found!', 'wpfd')
                      )
                    )
                  )
                ),
                wp.element.createElement(
                  "div",
                  { className: "wpfd-modal-right-panel" },
                  fileLoading && wp.element.createElement(
                    "div",
                    { className: 'wpfd-loading-wrapper' },
                    wp.element.createElement(Icon, { className: 'wpfd-loading', icon: loadingIcon })
                  ),
                  wp.element.createElement(
                    "div",
                    { className: fileClasses },
                    filesList.length > 0 ? wp.element.createElement(
                      "ul",
                      { className: 'wpfd-files-wrapper' },
                      filesList.map(function (file, index) {
                        var extClass = "ext ext-" + file.ext;
                        if (wpfd_block_vars.iconSet !== 'default') {
                          extClass = "wpfd-icon-set-" + wpfd_block_vars.iconSet + " ext ext-" + file.ext;
                        }
                        return wp.element.createElement(
                          "li",
                          {
                            key: index,
                            className: 'wpfd-file',
                            onMouseOver: function onMouseOver() {
                              return _this2.setState({ fileHoverId: file.id });
                            }
                          },
                          wp.element.createElement(
                            "div",
                            { className: extClass },
                            wp.element.createElement(
                              "span",
                              {
                                className: 'txt' },
                              file.ext
                            )
                          ),
                          wp.element.createElement(
                            "div",
                            { className: 'file_info' },
                            wp.element.createElement(
                              "h3",
                              { className: 'file_title' },
                              file.title
                            ),
                            wp.element.createElement(
                              "span",
                              {
                                className: 'file_size' },
                              wp.element.createElement(
                                "strong",
                                null,
                                __('Size:', 'wpfd')
                              ),
                              " ",
                              file.size
                            ),
                            wp.element.createElement(
                              "span",
                              {
                                className: 'file_created' },
                              wp.element.createElement(
                                "strong",
                                null,
                                __('Date added:', 'wpfd')
                              ),
                              " ",
                              file.created
                            )
                          ),
                          wp.element.createElement(
                            "div",
                            { className: 'file_buttons' },
                            wp.element.createElement(
                              "button",
                              {
                                type: 'button',
                                className: 'wpfd-button orange-outline-button',
                                onClick: function onClick() {
                                  return _this2.setSelectedFile(file);
                                }
                              },
                              __('Insert this file', 'wpfd')
                            )
                          )
                        );
                      })
                    ) : wp.element.createElement(
                      "div",
                      {
                        className: 'wpfd-nothing-found' },
                      __('There is no file in this category yet', 'wpfd')
                    )
                  )
                )
              )
            )
          )
        );
      }
    }]);

    return WpfdFileEdit;
  }(Component);

  var WpfdFileSave = function (_Component2) {
    _inherits(WpfdFileSave, _Component2);

    function WpfdFileSave() {
      _classCallCheck(this, WpfdFileSave);

      return _possibleConstructorReturn(this, (WpfdFileSave.__proto__ || Object.getPrototypeOf(WpfdFileSave)).apply(this, arguments));
    }

    _createClass(WpfdFileSave, [{
      key: "render",
      value: function render() {
        var _props2 = this.props,
            attributes = _props2.attributes,
            className = _props2.className;

        return wp.element.createElement(
          "div",
          { className: className },
          attributes.shortCode
        );
      }
    }]);

    return WpfdFileSave;
  }(Component);

  registerBlockType('wpfd/wpfd-file', {
    title: __('WP File Download File', 'wpfd'),
    description: __('Showing WP File Download Single file.', 'wpfd'),
    icon: {
      src: categoryIcon,
      foreground: undefined
    },
    category: 'wp-file-download',
    keywords: [__('wpfd', 'wpfd'), __('file', 'wpfd'), __('single file', 'wpfd'), __('wp file download', 'wpfd'), __('download', 'wpfd'), __('file', 'wpfd'), __('wpfd file', 'wpfd')],
    example: {
      attributes: {
        isPreview: true
      }
    },
    attributes: {
      isPreview: {
        type: 'boolean'
      },
      selectedFileCatId: {
        type: 'number'
      },
      selectedFileId: {
        type: 'string'
      },
      selectedFileName: {
        type: 'string'
      },
      shortCode: {
        type: 'string'
      },
      className: {
        type: 'string'
      }
    },
    edit: WpfdFileEdit,
    save: WpfdFileSave
  });
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents, wpBlockEditor) {
  var __ = wpI18n.__;
  var Component = wpElement.Component,
      Fragment = wpElement.Fragment;
  var registerBlockType = wpBlocks.registerBlockType;
  var InspectorControls = wpBlockEditor.InspectorControls;
  var Icon = wpComponents.Icon,
      ToggleControl = wpComponents.ToggleControl,
      SelectControl = wpComponents.SelectControl;


  var wpfdIcon = wp.element.createElement(
    "svg",
    { className: "dashicon", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24" },
    wp.element.createElement("path", { fill: "none", d: "M0 0h24v24H0V0z" }),
    wp.element.createElement("path", {
      d: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z" })
  );

  var WpfdSearchEdit = function (_Component) {
    _inherits(WpfdSearchEdit, _Component);

    function WpfdSearchEdit(props) {
      _classCallCheck(this, WpfdSearchEdit);

      var _this = _possibleConstructorReturn(this, (WpfdSearchEdit.__proto__ || Object.getPrototypeOf(WpfdSearchEdit)).call(this, props));

      _this.state = {
        shortcode: '[wpfd_search catid="0" exclude="" cat_filter="1" tag_filter="1" display_tag="searchbox" create_filter="1" update_filter="1" type_filter="0" weight_filter="0" file_per_page="15" show_filters="0" show_pagination="1"  theme_column="title,description,version,size,hits,date added,download"]',
        showCatFilter: true,
        showTagFilter: true,
        display_tag_as: 'searchbox',
        showCreateDateFilter: true,
        showUpdateDateFilter: true,
        showTypeFilter: false,
        showWeightFilter: false,
        showMinimizeFilter: false,
        showPagination: true,
        paginationValue: '15'
      };
      return _this;
    }

    _createClass(WpfdSearchEdit, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _props$attributes = this.props.attributes,
            shortcode = _props$attributes.shortcode,
            showCatFilter = _props$attributes.showCatFilter,
            showTagFilter = _props$attributes.showTagFilter,
            display_tag_as = _props$attributes.display_tag_as,
            showCreateDateFilter = _props$attributes.showCreateDateFilter,
            showUpdateDateFilter = _props$attributes.showUpdateDateFilter,
            showTypeFilter = _props$attributes.showTypeFilter,
            showWeightFilter = _props$attributes.showWeightFilter,
            showMinimizeFilter = _props$attributes.showMinimizeFilter,
            showPagination = _props$attributes.showPagination,
            paginationValue = _props$attributes.paginationValue;

        this.setState({
          shortcode: shortcode,
          showCatFilter: showCatFilter,
          showTagFilter: showTagFilter,
          display_tag_as: display_tag_as,
          showCreateDateFilter: showCreateDateFilter,
          showUpdateDateFilter: showUpdateDateFilter,
          showTypeFilter: showTypeFilter,
          showWeightFilter: showWeightFilter,
          showMinimizeFilter: showMinimizeFilter,
          showPagination: showPagination,
          paginationValue: paginationValue
        });

        var params = {
          cat_filter: showCatFilter,
          tag_filter: showTagFilter,
          display_tag: display_tag_as,
          create_filter: showCreateDateFilter,
          update_filter: showUpdateDateFilter,
          type_filter: showTypeFilter,
          weight_filter: showWeightFilter,
          show_filters: showMinimizeFilter,
          show_pagination: showPagination,
          file_per_page: paginationValue
        };
        this.initLoadSearchShortcode(params);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        var _state = this.state,
            showCatFilter = _state.showCatFilter,
            showTagFilter = _state.showTagFilter,
            display_tag_as = _state.display_tag_as,
            showCreateDateFilter = _state.showCreateDateFilter,
            showUpdateDateFilter = _state.showUpdateDateFilter,
            showTypeFilter = _state.showTypeFilter,
            showWeightFilter = _state.showWeightFilter,
            showMinimizeFilter = _state.showMinimizeFilter,
            showPagination = _state.showPagination,
            paginationValue = _state.paginationValue;

        if (prevState.showCatFilter !== showCatFilter || prevState.showTagFilter !== showTagFilter || prevState.display_tag_as !== display_tag_as || prevState.showCreateDateFilter !== showCreateDateFilter || prevState.showUpdateDateFilter !== showUpdateDateFilter || prevState.showTypeFilter !== showTypeFilter || prevState.showWeightFilter !== showWeightFilter || prevState.showMinimizeFilter !== showMinimizeFilter || prevState.showPagination !== showPagination || prevState.paginationValue !== paginationValue) {
          this.updateShortcode();
        }
      }
    }, {
      key: "updateShortcode",
      value: function updateShortcode() {
        var _state2 = this.state,
            showCatFilter = _state2.showCatFilter,
            showTagFilter = _state2.showTagFilter,
            display_tag_as = _state2.display_tag_as,
            showCreateDateFilter = _state2.showCreateDateFilter,
            showUpdateDateFilter = _state2.showUpdateDateFilter,
            showTypeFilter = _state2.showTypeFilter,
            showWeightFilter = _state2.showWeightFilter,
            showMinimizeFilter = _state2.showMinimizeFilter,
            showPagination = _state2.showPagination,
            paginationValue = _state2.paginationValue;
        var setAttributes = this.props.setAttributes;


        var updatedShortcode = this.state.shortcode;

        updatedShortcode = updatedShortcode.replace(/cat_filter="[^"]+"/, "cat_filter=\"" + (showCatFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/tag_filter="[^"]+"/, "tag_filter=\"" + (showTagFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/display_tag="[^"]+"/, "display_tag=\"" + display_tag_as + "\"");
        updatedShortcode = updatedShortcode.replace(/create_filter="[^"]+"/, "create_filter=\"" + (showCreateDateFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/update_filter="[^"]+"/, "update_filter=\"" + (showUpdateDateFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/type_filter="[^"]+"/, "type_filter=\"" + (showTypeFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/weight_filter="[^"]+"/, "weight_filter=\"" + (showWeightFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/show_filters="[^"]+"/, "show_filters=\"" + (showMinimizeFilter ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/show_pagination="[^"]+"/, "show_pagination=\"" + (showPagination ? '1' : '0') + "\"");
        updatedShortcode = updatedShortcode.replace(/file_per_page="[^"]+"/, "file_per_page=\"" + paginationValue + "\"");

        this.setState({ shortcode: updatedShortcode });
        setAttributes({
          shortcode: updatedShortcode,
          showCatFilter: showCatFilter,
          showTagFilter: showTagFilter,
          display_tag_as: display_tag_as,
          showCreateDateFilter: showCreateDateFilter,
          showUpdateDateFilter: showUpdateDateFilter,
          showTypeFilter: showTypeFilter,
          showWeightFilter: showWeightFilter,
          showMinimizeFilter: showMinimizeFilter,
          showPagination: showPagination,
          paginationValue: paginationValue
        });

        var params = {
          cat_filter: showCatFilter,
          tag_filter: showTagFilter,
          display_tag: display_tag_as,
          create_filter: showCreateDateFilter,
          update_filter: showUpdateDateFilter,
          type_filter: showTypeFilter,
          weight_filter: showWeightFilter,
          show_filters: showMinimizeFilter,
          show_pagination: showPagination,
          file_per_page: paginationValue
        };
        this.initLoadSearchShortcode(params);
      }
    }, {
      key: "initLoadSearchShortcode",
      value: function initLoadSearchShortcode(params) {
        var setAttributes = this.props.setAttributes;


        var wpfdSearchPreview = ajaxurl + "?action=wpfd&task=search.previewBlock";
        fetch(wpfdSearchPreview, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }).then(function (res) {
          return res.json();
        }).then(function (result) {
          if (result.status) {
            setAttributes({
              searchPreview: result.html
            });
          }
        }).catch(function (error) {});
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _state3 = this.state,
            shortcode = _state3.shortcode,
            showCatFilter = _state3.showCatFilter,
            showTagFilter = _state3.showTagFilter,
            showCreateDateFilter = _state3.showCreateDateFilter,
            showUpdateDateFilter = _state3.showUpdateDateFilter,
            showTypeFilter = _state3.showTypeFilter,
            showWeightFilter = _state3.showWeightFilter,
            showMinimizeFilter = _state3.showMinimizeFilter,
            showPagination = _state3.showPagination,
            display_tag_as = _state3.display_tag_as,
            paginationValue = _state3.paginationValue;
        var _props = this.props,
            className = _props.className,
            attributes = _props.attributes;
        var searchPreview = attributes.searchPreview;


        return wp.element.createElement(
          "div",
          { className: className },
          wp.element.createElement(
            InspectorControls,
            null,
            wp.element.createElement(
              "div",
              { className: "wpfd-search-block-setting" },
              wp.element.createElement(
                "h3",
                null,
                __('WPFD Search Settings', 'wpfd')
              ),
              wp.element.createElement(ToggleControl, {
                label: __('Filter by category', 'wpfd'),
                checked: showCatFilter,
                onChange: function onChange() {
                  return _this2.setState({ showCatFilter: !showCatFilter });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Filter by tag', 'wpfd'),
                checked: showTagFilter,
                onChange: function onChange() {
                  return _this2.setState({ showTagFilter: !showTagFilter });
                }
              }),
              wp.element.createElement(SelectControl, {
                label: __('Display tag as', 'wpfd'),
                value: display_tag_as,
                options: [{ label: 'Search box', value: 'searchbox' }, { label: 'Multiple select', value: 'checkbox' }],
                onChange: function onChange(newValue) {
                  return _this2.setState({ display_tag_as: newValue });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Filter by creation date', 'wpfd'),
                checked: showCreateDateFilter,
                onChange: function onChange() {
                  return _this2.setState({ showCreateDateFilter: !showCreateDateFilter });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Filter by update date', 'wpfd'),
                checked: showUpdateDateFilter,
                onChange: function onChange() {
                  return _this2.setState({ showUpdateDateFilter: !showUpdateDateFilter });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Filter by type', 'wpfd'),
                checked: showTypeFilter,
                onChange: function onChange() {
                  return _this2.setState({ showTypeFilter: !showTypeFilter });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Filter by weight', 'wpfd'),
                checked: showWeightFilter,
                onChange: function onChange() {
                  return _this2.setState({ showWeightFilter: !showWeightFilter });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Minimize filters', 'wpfd'),
                checked: showMinimizeFilter,
                onChange: function onChange() {
                  return _this2.setState({ showMinimizeFilter: !showMinimizeFilter });
                }
              }),
              wp.element.createElement(ToggleControl, {
                label: __('Show Pagination', 'wpfd'),
                checked: showPagination,
                onChange: function onChange() {
                  return _this2.setState({ showPagination: !showPagination });
                }
              }),
              wp.element.createElement(SelectControl, {
                label: __('# Files per page', 'wpfd'),
                value: paginationValue,
                options: [{ label: '5', value: '5' }, { label: '10', value: '10' }, { label: '15', value: '15' }, { label: '20', value: '20' }, { label: '25', value: '25' }, { label: '30', value: '30' }, { label: '50', value: '50' }, { label: '100', value: '100' }, { label: 'All', value: '-1' }],
                onChange: function onChange(newValue) {
                  return _this2.setState({ paginationValue: newValue });
                }
              })
            )
          ),
          wp.element.createElement(
            "div",
            { className: "wpfd-search-block" },
            wp.element.createElement(
              "div",
              { className: "wpfd-file-search" },
              wp.element.createElement(
                "label",
                { htmlFor: "wpfd-search" },
                wp.element.createElement(Icon, { icon: wpfdIcon }),
                __('WP File Download Search', 'wpfd')
              ),
              wp.element.createElement(
                Fragment,
                null,
                wp.element.createElement("textarea", {
                  value: shortcode,
                  className: "editor-plain-text input-control",
                  id: "wpfd-search",
                  onFocus: function onFocus() {
                    return _this2.setState({ shortcode: shortcode });
                  },
                  onBlur: function onBlur() {
                    return _this2.setState({ shortcode: shortcode });
                  },
                  onChange: function onChange() {}
                })
              )
            ),
            searchPreview !== '' && wp.element.createElement("div", { className: "wpfd-selected-category", dangerouslySetInnerHTML: { __html: searchPreview || '' } })
          )
        );
      }
    }]);

    return WpfdSearchEdit;
  }(Component);

  registerBlockType('wpfd/wpfd-search', {
    title: __('WP File Download Search', 'wpfd'),
    description: __('Showing WP File Download Search.', 'wpfd'),
    icon: {
      src: wpfdIcon,
      foreground: undefined
    },
    category: 'wp-file-download',
    attributes: {
      shortcode: {
        type: 'string',
        default: '[wpfd_search catid="0" exclude="" cat_filter="1" tag_filter="1" display_tag="searchbox" create_filter="1" update_filter="1" type_filter="0" weight_filter="0" file_per_page="15" show_filters="0" show_pagination="1"  theme_column="title,description,version,size,hits,date added,download"]'
      },
      showCatFilter: {
        type: 'boolean',
        default: true
      },
      showTagFilter: {
        type: 'boolean',
        default: true
      },
      display_tag_as: {
        type: 'string',
        default: 'searchbox'
      },
      showCreateDateFilter: {
        type: 'boolean',
        default: true
      },
      showUpdateDateFilter: {
        type: 'boolean',
        default: true
      },
      showTypeFilter: {
        type: 'boolean',
        default: false
      },
      showWeightFilter: {
        type: 'boolean',
        default: false
      },
      showMinimizeFilter: {
        type: 'boolean',
        default: false
      },
      showPagination: {
        type: 'boolean',
        default: true
      },
      paginationValue: {
        type: 'string',
        default: '15'
      }
    },
    edit: WpfdSearchEdit,
    save: function save(_ref) {
      var attributes = _ref.attributes;

      return attributes.shortcode;
    }
  });
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components, wp.blockEditor);

/***/ })
/******/ ]);
//# sourceMappingURL=wpfd-blocks.js.map