(function (wpI18n, wpBlocks, wpElement, wpEditor, wpComponents) {
  const {__} = wpI18n;
  const {Component, Fragment} = wpElement;
  const {registerBlockType} = wpBlocks;
  const { Icon, Modal } = wpComponents;
  let fetchingQueue = null

  const previewImageData = 'data:image/png;base64,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';
  const categoryIcon = (
    <svg className={"dashicon"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="none" d="M0 0h24v24H0V0z"/>
      <path
        d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3zm-5.55-8h-2.9v3H8l4 4 4-4h-2.55z"/>
    </svg>
  );
  const folderIcon = (
    <svg className={"dashicon"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  )
  const loadingIcon = (
    <svg className={'wpfd-loading'} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <g transform="translate(25 50)">
        <circle cx="0" cy="0" r="10" fill="#cfcfcf" transform="scale(0.590851 0.590851)">
          <animateTransform attributeName="transform" type="scale" begin="-0.8666666666666667s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="10" fill="#cfcfcf" transform="scale(0.145187 0.145187)">
          <animateTransform attributeName="transform" type="scale" begin="-0.43333333333333335s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
      <g transform="translate(75 50)">
        <circle cx="0" cy="0" r="10" fill="#cfcfcf" transform="scale(0.0339143 0.0339143)">
          <animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline"
                            keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0.5;1;0.5" keyTimes="0;0.5;1" dur="2.6s"
                            repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  )

  class WpfdFileEdit extends Component {
    constructor() {
      super(...arguments);
      this.state = {
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
        preview: false,
      }
      this.fetchCategories = this.fetchCategories.bind(this)
      this.fetchFiles = this.fetchFiles.bind(this)
      this.openModal = this.openModal.bind(this)
      this.setSelectedFile = this.setSelectedFile.bind(this)
      this.updateInput = this.updateInput.bind(this)
      this.toggleCategories = this.toggleCategories.bind(this)
    }

    openModal() {
      this.setState({isOpenModal: true})
      const {categoriesList} = this.state;
      const {attributes} = this.props

      const {selectedFileCatId, selectedFileId} = attributes

      if (categoriesList.length === 0) {
        this.fetchCategories()
      } else {
        if (selectedFileCatId && selectedFileId) {
          this.setState({categorySelectedId: selectedFileCatId, fileHoverId: selectedFileId, fileLoading: true})
          this.fetchFiles(selectedFileCatId);
        }
      }
    }

    setSelectedFile(file) {
      const {setAttributes} = this.props
      let fileName = file.name.replace('[', '&amp;#91;').replace(']', '&amp;#93;');
      const shortCode = `[wpfd_single_file id="${file.id}" catid="${file.term_id}" name="${fileName}"]`

      setAttributes({
        selectedFileCatId: file.term_id,
        selectedFileId: file.id,
        selectedFileName: fileName,
        shortCode: shortCode
      })
      this.setState({selectedFile: file, filename: fileName, isOpenModal: false, shortcode: shortCode})
    }

    updateInput(event) {
      const {setAttributes} = this.props
      const shortcode = event.target.value

      setAttributes({shortCode: shortcode})
      this.setState({isOpenModal: false, shortcode: shortcode})
    }

    fetchCategories() {
      const self = this
      const {attributes} = this.props
      const {selectedFileCatId, selectedFileId} = attributes

      const url = `${ajaxurl}?action=wpfd&task=categories.listCats`

      if (fetchingQueue) {
        clearTimeout(fetchingQueue)
      }

      if (this.state.error) {
        this.setState({error: false})
      }

      fetchingQueue = setTimeout(function () {
        if (!self.state.loading) {
          self.setState({loading: true})
        }
        fetch(url)
          .then(function (response) {
            return response.json()
          })
          .then(function (response) {
            if (false === response.success) {
              self.setState({
                loading: false,
                error: true,
              })
            } else {
              self.setState({
                categoriesList: response.data,
                loading: false,
              })
              if (selectedFileCatId && selectedFileId) {
                self.setState({categorySelectedId: selectedFileCatId, fileHoverId: selectedFileId, fileLoading: true})
                self.fetchFiles(selectedFileCatId);
              } else {
                if (response.data.length > 0) {
                  let firstCategoryId = response.data[0].term_id
                  self.setState({categorySelectedId: firstCategoryId, fileLoading: true})
                  self.fetchFiles(firstCategoryId);
                }
              }
            }
          })
          .catch(function (error) {
            self.setState({
              loading: false,
              error: true,
            })
          })
      }, 500)
    }

    fetchFiles(categoryId) {
      const self = this
      const url = `${ajaxurl}?action=wpfd&view=files&format=json&id_category=${categoryId}`

      if (fetchingQueue) {
        clearTimeout(fetchingQueue)
      }

      if (this.state.fileError) {
        this.setState({fileError: false})
      }

      this.setState({categorySelectedId: categoryId, fileClasses: 'wpfd-animation-enter'})

      fetchingQueue = setTimeout(function () {
        if (!self.state.fileLoading) {
          self.setState({fileLoading: true})
        }
        if (categoryId) {
          fetch(url)
            .then(function (response) {
              return response.json()
            })
            .then(function (response) {
              if (false === response.success) {
                self.setState({
                  fileLoading: false,
                  fileError: true,
                })
              } else {
                self.setState({
                  filesList: response.data,
                  fileLoading: false,
                  fileClasses: 'wpfd-animation-enter'
                })
                setTimeout(function() {
                  self.setState({
                    fileClasses: 'wpfd-animation-enter wpfd-animation-enter-active'
                  })
                }, 250)
              }
            })
            .catch(function (error) {
              self.setState({
                fileLoading: false,
                fileError: true,
              })
            })
        }
      }, 500)
    }

    toggleCategories(e) {
      const categoryItem = $(e.target).closest('.wpfd-category');
      let categoryLevel = categoryItem.data('level');
      const collapsed = categoryItem.hasClass('collapsed');

      categoryItem.nextUntil('.cat-lv-' + categoryLevel).each(function () {
        let thisLevel = $(this).data('level');
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
    componentDidMount() {
      const {shortCode, selectedFileName, isPreview} = this.props.attributes
      if (isPreview) {
        this.setState({preview: true})
      } else {
        if (shortCode && selectedFileName) {
          this.setState({shortcode: shortCode, filename: selectedFileName})
        }
      }
    }
    render() {
      const {categoriesList, filename, filesList, fileHoverId, categorySelectedId, shortcode, isOpenModal, loading, fileClasses, fileLoading, preview} = this.state
      const {className} = this.props
      return (
          preview ?
              <img alt={__('WP File Download File', 'wpfd')} width='100%' src={previewImageData}/>
              :
              <div className={className}>
                <div className="wpfd-file-block">
                  <div className="wpfd-file-search">
                    <label>
                      <Icon icon={categoryIcon}/>{__('WP File Download File', 'wpfd')}
                    </label>
                    <Fragment>
                      <input
                          type={'text'}
                          value={shortcode}
                          className="editor-plain-text input-control"
                          placeholder={__('Please select a file', 'wpfd')}
                          readOnly={true}
                          onChange={this.updateInput}
                      />
                      <button
                          type={'button'}
                          className={'wpfd-browse-files wpfd-button wpfd-material-button'}
                          onClick={() => this.openModal()}
                      >
                        {__('Browse Files', 'wpfd')}
                      </button>
                    </Fragment>
                  </div>
                  {filename !== '' &&
                  <div className="wpfd-selected-file-name">{__('FILE NAME', 'wpfd')}:<span>{filename}</span></div>
                  }
                </div>
                {isOpenModal &&
                <Modal
                    className="wpfd-modal"
                    title={__('WP File Download', 'wpfd')}
                    onRequestClose={() => this.setState({isOpenModal: false})}>

                  {loading ?
                      <div className={'wpfd-loading-wrapper'}>
                        <Icon className={'wpfd-loading'} icon={loadingIcon}/>
                      </div>
                      :
                      <Fragment>
                        <div className="wpfd-modal-content">
                          <div className="wpfd-modal-left-panel">
                            <div className="categories-dropdown">
                              <ul>
                                {categoriesList.length > 0 ?
                                    categoriesList.map((category, index) => {
                                      let haveChild = (typeof (categoriesList[index + 1]) !== 'undefined' && categoriesList[index + 1].level > 0 && categoriesList[index + 1].level > category.level)
                                      let paddingLeft = category.level * 12
                                      if (!haveChild) {
                                        paddingLeft += 14
                                      }
                                      return (
                                          <li
                                              key={index}
                                              className={`wpfd-category cat-lv-${category.level} ${category.term_id === categorySelectedId ? 'active' : ''}`}
                                              style={{paddingLeft: paddingLeft + 'px'}}
                                              data-id-category={category.term_id}
                                              data-id-parent={category.parent}
                                              data-cloud-type={category.cloudType}
                                              data-level={category.level}
                                              onClick={() => this.fetchFiles(category.term_id)}
                                          >
                                            {category.level < 16 && haveChild &&
                                            <span
                                                className={'wpfd-toggle-expand'}
                                                //onClick={this.toggleCategories}
                                                // onClick={() => this.fetchFiles(category.term_id)}
                                            />
                                            }
                                            {category.cloudType === category.term_id || category.cloudType === false
                                                ? <Icon icon={folderIcon}/>
                                                : <i className={category.cloudType.toString().replace('_', '-') + '-icon'}/>
                                            }

                                            <span
                                                className={'wpfd-category-name'}
                                                // onClick={() => this.fetchFiles(category.term_id)}
                                            >
                                  {category.name}
                                </span>
                                            <span className={'wpfd-category-count'}>
                                  {`(${category.count})`}
                                </span>
                                          </li>
                                      )
                                    })
                                    : <div className={'wpfd-nothing-found'}>{__('No category found!', 'wpfd')}</div>
                                }
                              </ul>
                            </div>
                          </div>
                          <div className="wpfd-modal-right-panel">
                            {fileLoading &&
                            <div className={'wpfd-loading-wrapper'}>
                              <Icon className={'wpfd-loading'} icon={loadingIcon}/>
                            </div>
                            }
                            <div className={fileClasses}>
                              {filesList.length > 0 ?
                                  <ul className={'wpfd-files-wrapper'}>
                                    {filesList.map((file, index) => {
                                      let extClass = `ext ext-${file.ext}`
                                      if (wpfd_block_vars.iconSet !== 'default') {
                                        extClass = `wpfd-icon-set-${wpfd_block_vars.iconSet} ext ext-${file.ext}`
                                      }
                                      return (
                                          <li
                                              key={index}
                                              className={'wpfd-file'}
                                              onMouseOver={() => this.setState({fileHoverId: file.id})}
                                          >
                                            <div className={extClass}><span
                                                className={'txt'}>{file.ext}</span></div>
                                            <div className={'file_info'}>
                                              <h3 className={'file_title'}>{file.name}</h3>
                                              <span
                                                  className={'file_size'}><strong>{__('Size:', 'wpfd')}</strong> {file.size}</span>
                                              <span
                                                  className={'file_created'}><strong>{__('Date added:', 'wpfd')}</strong> {file.created}</span>
                                            </div>

                                            <div className={'file_buttons'}>
                                              <button
                                                  type={'button'}
                                                  className={'wpfd-button orange-outline-button'}
                                                  onClick={() => this.setSelectedFile(file)}
                                              >
                                                {__('Insert this file', 'wpfd')}
                                              </button>
                                            </div>
                                          </li>
                                      )
                                    })}
                                  </ul>
                                  :
                                  <div
                                      className={'wpfd-nothing-found'}>{__('There is no file in this category yet', 'wpfd')}</div>
                              }
                            </div>
                          </div>
                        </div>
                      </Fragment>
                  }
                </Modal>
                }
              </div>
      )
    }
  }

  class WpfdFileSave extends Component {
    render() {
      const {attributes, className} = this.props;
      return (
        <div className={className}>
          {attributes.shortCode}
        </div>
      );
    }
  }

  registerBlockType('wpfd/wpfd-file', {
    title: __('WP File Download File', 'wpfd'),
    description: __('Showing WP File Download Single file.', 'wpfd'),
    icon: {
      src: categoryIcon,
      foreground: undefined,
    },
    category: 'wp-file-download',
    keywords: [
      __('wpfd', 'wpfd'),
      __('file', 'wpfd'),
      __('single file', 'wpfd'),
      __('wp file download', 'wpfd'),
      __('download', 'wpfd'),
      __('file', 'wpfd'),
      __('wpfd file', 'wpfd'),
    ],
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
        type: 'number'
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
  })
})(wp.i18n, wp.blocks, wp.element, wp.editor, wp.components)
