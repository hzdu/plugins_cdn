( function( wpI18n, wpBlocks, wpElement, wpEditor, wpComponents, wpBlockEditor ) {
  const { __ } = wpI18n;
  const { Component, Fragment } = wpElement;
  const { registerBlockType } = wpBlocks;
  const { InspectorControls } = wpBlockEditor;
  const { Icon, ToggleControl, SelectControl } = wpComponents;

  const wpfdIcon = (
    <svg className={"dashicon"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z"/>
    </svg>
  );

  class WpfdSearchEdit extends Component {
    constructor(props) {
      super(props);
      this.state = {
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
    }

    componentDidMount() {
      const { shortcode, showCatFilter, showTagFilter, display_tag_as, showCreateDateFilter, showUpdateDateFilter, showTypeFilter, showWeightFilter, showMinimizeFilter, showPagination, paginationValue } = this.props.attributes;
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

      const params = {
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
      }
      this.initLoadSearchShortcode(params);
    }

    componentDidUpdate(prevProps, prevState) {
        const { showCatFilter, showTagFilter, display_tag_as, showCreateDateFilter, showUpdateDateFilter, showTypeFilter, showWeightFilter, showMinimizeFilter, showPagination, paginationValue } = this.state;
        if (
            prevState.showCatFilter !== showCatFilter ||
            prevState.showTagFilter !== showTagFilter ||
            prevState.display_tag_as !== display_tag_as ||
            prevState.showCreateDateFilter !== showCreateDateFilter ||
            prevState.showUpdateDateFilter !== showUpdateDateFilter ||
            prevState.showTypeFilter !== showTypeFilter ||
            prevState.showWeightFilter !== showWeightFilter ||
            prevState.showMinimizeFilter !== showMinimizeFilter ||
            prevState.showPagination !== showPagination ||
            prevState.paginationValue !== paginationValue
        ) {
            this.updateShortcode();
        }
    }

    updateShortcode() {
        const { showCatFilter, showTagFilter, display_tag_as, showCreateDateFilter, showUpdateDateFilter, showTypeFilter, showWeightFilter, showMinimizeFilter, showPagination, paginationValue } = this.state;
        const { setAttributes } = this.props;

        let updatedShortcode = this.state.shortcode;

        updatedShortcode = updatedShortcode.replace(/cat_filter="[^"]+"/, `cat_filter="${showCatFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/tag_filter="[^"]+"/, `tag_filter="${showTagFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/display_tag="[^"]+"/, `display_tag="${display_tag_as}"`);
        updatedShortcode = updatedShortcode.replace(/create_filter="[^"]+"/, `create_filter="${showCreateDateFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/update_filter="[^"]+"/, `update_filter="${showUpdateDateFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/type_filter="[^"]+"/, `type_filter="${showTypeFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/weight_filter="[^"]+"/, `weight_filter="${showWeightFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/show_filters="[^"]+"/, `show_filters="${showMinimizeFilter ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/show_pagination="[^"]+"/, `show_pagination="${showPagination ? '1' : '0'}"`);
        updatedShortcode = updatedShortcode.replace(/file_per_page="[^"]+"/, `file_per_page="${paginationValue}"`);

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
        
        const params = {
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
        }
        this.initLoadSearchShortcode(params);
    }

    initLoadSearchShortcode(params) {
      const {setAttributes} = this.props;

      const wpfdSearchPreview = `${ajaxurl}?action=wpfd&task=search.previewBlock`;
      fetch(wpfdSearchPreview, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      .then(res => res.json())
      .then(result => {
        if (result.status) {
          setAttributes({
            searchPreview: result.html
          });
        }
      })
      .catch(error => {});
    }

    render() {
      const { shortcode, showCatFilter, showTagFilter, showCreateDateFilter, showUpdateDateFilter, showTypeFilter, showWeightFilter, showMinimizeFilter, showPagination, display_tag_as, paginationValue } = this.state;
      const { className, attributes } = this.props;
      const { searchPreview } = attributes;

      return (
        <div className={className }>
          <InspectorControls>
            <div className="wpfd-search-block-setting">
              <h3>{ __( 'WPFD Search Settings', 'wpfd' ) }</h3>
              <ToggleControl
                label={ __( 'Filter by category', 'wpfd' ) }
                checked={ showCatFilter }
                onChange={ () => this.setState( { showCatFilter: !showCatFilter } ) }
              />
              <ToggleControl
                label={ __( 'Filter by tag', 'wpfd' ) }
                checked={ showTagFilter }
                onChange={ () => this.setState( { showTagFilter: !showTagFilter } ) }
              />
              <SelectControl
                label={ __( 'Display tag as', 'wpfd' ) }
                value={ display_tag_as }
                options={ [
                    { label: 'Search box', value: 'searchbox' },
                    { label: 'Multiple select', value: 'checkbox' }
                ] }
                onChange={ ( newValue ) => this.setState( { display_tag_as: newValue } ) }
              />
              <ToggleControl
                label={ __( 'Filter by creation date', 'wpfd' ) }
                checked={ showCreateDateFilter }
                onChange={ () => this.setState( { showCreateDateFilter: !showCreateDateFilter } ) }
              />
              <ToggleControl
                label={ __( 'Filter by update date', 'wpfd' ) }
                checked={ showUpdateDateFilter }
                onChange={ () => this.setState( { showUpdateDateFilter: !showUpdateDateFilter } ) }
              />
              <ToggleControl
                label={ __( 'Filter by type', 'wpfd' ) }
                checked={ showTypeFilter }
                onChange={ () => this.setState( { showTypeFilter: !showTypeFilter } ) }
              />
              <ToggleControl
                label={ __( 'Filter by weight', 'wpfd' ) }
                checked={ showWeightFilter }
                onChange={ () => this.setState( { showWeightFilter: !showWeightFilter } ) }
              />
              <ToggleControl
                label={ __( 'Minimize filters', 'wpfd' ) }
                checked={ showMinimizeFilter }
                onChange={ () => this.setState( { showMinimizeFilter: !showMinimizeFilter } ) }
              />
              <ToggleControl
                label={ __( 'Show Pagination', 'wpfd' ) }
                checked={ showPagination }
                onChange={ () => this.setState( { showPagination: !showPagination } ) }
              />
              <SelectControl
                label={ __( '# Files per page', 'wpfd' ) }
                value={ paginationValue }
                options={ [
                    { label: '5', value: '5' },
                    { label: '10', value: '10' },
                    { label: '15', value: '15' },
                    { label: '20', value: '20' },
                    { label: '25', value: '25' },
                    { label: '30', value: '30' },
                    { label: '50', value: '50' },
                    { label: '100', value: '100' },
                    { label: 'All', value: '-1' },
                ] }
                onChange={ ( newValue ) => this.setState( { paginationValue: newValue } ) }
              />
            </div>
          </InspectorControls>
          <div className="wpfd-search-block">
            <div className="wpfd-file-search">
              <label htmlFor="wpfd-search">
                <Icon icon={wpfdIcon} />{__('WP File Download Search', 'wpfd')}
              </label>
              <Fragment>
                <textarea
                  value={shortcode}
                  className="editor-plain-text input-control"
                  id="wpfd-search"
                  onFocus={() => this.setState({ shortcode: shortcode })}
                  onBlur={() => this.setState({ shortcode: shortcode })}
                  onChange={() => {}}
                />
              </Fragment>
            </div>
            {searchPreview !== '' && 
            <div className="wpfd-selected-category" dangerouslySetInnerHTML={{ __html: searchPreview || '' }} />
            }
          </div>
        </div>
      );
    }
  }

  registerBlockType( 'wpfd/wpfd-search', {
    title: __('WP File Download Search', 'wpfd'),
    description: __('Showing WP File Download Search.', 'wpfd'),
    icon: {
      src: wpfdIcon,
      foreground: undefined,
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
    save: function({ attributes }) {
      return attributes.shortcode;
    },
  } );
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components, wp.blockEditor);
