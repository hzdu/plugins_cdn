// External Dependencies
import React, {Component, Fragment} from 'react';
import Modal from 'react-modal';
import wpfdJsonParse from "../../utils";

class WpfdFile extends Component {

    static slug = 'wpfd_file';

    constructor(props) {
        super(props);
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
            categoryPath: '',
            editCategoryLink: '#'
        };
        this.fetchCategories = this.fetchCategories.bind(this);
        this.fetchFiles = this.fetchFiles.bind(this);
        this.openModal = this.openModal.bind(this);
        this.updateInput = this.updateInput.bind(this);
        this.setSelectedFile = this.setSelectedFile.bind(this);
    }

    componentDidMount() {
        this.fetchEditCategory();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const fileAttributes = this.props.value;
        const {categoryPath, categoriesList} = this.state;
        if (fileAttributes.toString() === 'root' && categoryPath === '' && categoriesList.length > 0) {
            this.setState({
                categoryPath: categoriesList[0].path
            });
        } else if(fileAttributes.toString() !== 'root' && categoryPath === '' && categoriesList.length > 0) {
            let parsedJson = wpfdJsonParse(fileAttributes);
            if (false !== parsedJson) {
                const selectedCategoryId = parsedJson.selected_category_id;
                let categoryPath = categoriesList.filter(category => (parseInt(category.term_id) === parseInt(selectedCategoryId)));
                if (categoryPath) {
                    this.setState({
                        categoryPath: categoryPath.path
                    });
                }
            }
        }
    }

    updateInput(event) {
        const shortcode = event.target.value;

        this.setState({shortcode: shortcode, isOpenModal: false});
    }

    openModal() {
        this.setState({isOpenModal: true});
        const {categoriesList} = this.state;
        let parsedJson = wpfdJsonParse(this.props.value);
        const categorySeletedId = (this.props.value !== 'root' && false !== parsedJson) ? parsedJson.selected_category_id : this.state.categorySeletedId;
        const selectedFileId = (this.props.value !== 'root' && false !== parsedJson) ? parsedJson.selected_file_id : this.state.selectedFileId;

        if (categoriesList.length === 0) {
            this.fetchCategories();
        } else {
            if (categorySeletedId && selectedFileId) {
                this.setState({categorySelectedId: categorySeletedId, fileHoverId: selectedFileId, fileLoading: true});
                this.fetchFiles(categorySeletedId);
            }
        }
    }

    fetchCategories() {
        const self = this;
        let parsedJson = wpfdJsonParse(this.props.value);
        const categorySeletedId = (this.props.value !== 'root' && false !== parsedJson) ? parsedJson.selected_category_id : this.state.categorySeletedId;
        const selectedFileId = (this.props.value !== 'root' && false !== parsedJson) ? parsedJson.selected_file_id : this.state.selectedFileId;

        const url = window.et_fb_options.ajaxurl + `?action=wpfd&task=categories.listCats`;

        if (this.state.error) {
            this.setState({error: false})
        }

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
                    });
                    if (categorySeletedId && selectedFileId) {
                        self.setState({categorySelectedId: categorySeletedId, fileHoverId: selectedFileId, fileLoading: true});
                        self.fetchFiles(categorySeletedId);
                    } else {
                        if (response.data.length > 0) {
                            let firstCategoryId = response.data[0].term_id;
                            self.setState({categorySelectedId: firstCategoryId, fileLoading: true});
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
    }

    fetchFiles(categoryId, categoryPath='') {
        const self = this;
        const url = window.et_fb_options.ajaxurl + `?action=wpfd&view=files&format=json&id_category=${categoryId}`;
        this.setState({
            categoryPath: categoryPath
        });

        if (this.state.fileError) {
            this.setState({fileError: false})
        }
        this.setState({categorySelectedId: categoryId, fileClasses: 'wpfd-animation-enter'});

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
                        });
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
    }

    fetchEditCategory() {
        const self      = this;
        fetch(window.et_fb_options.ajaxurl + "?action=wpfd&task=category.editCategoryLink")
            .then(res => res.json())
            .then(
                (result) => {
                    self.setState({
                        editCategoryLink: result.data
                    });
                },

                (error) => {
                    self.setState({
                        error: true,
                    });
                }
            )
    }

    setSelectedFile(file) {
        let file_id = file.id;
        let fileName = file.name.replace('[', '&amp;#91;').replace(']', '&amp;#93;');
        let category_id = file.term_id;
        const shortCode = `${fileName}`;

        this.setState({selectedFile: file, filename: fileName, isOpenModal: false, shortcode: shortCode});
        this._onChange(file_id, category_id, fileName);
    }

    /**
     * Handle input value change.
     *
     * @param {string} file_id
     * @param {string} cate_id
     * @param {string} file_name
     */
    _onChange = (file_id, cate_id, file_name) => {
        const categoryPath  = (this.state.categoryPath !== '' && this.state.categoryPath !== undefined) ? this.state.categoryPath.split(" > ").join("---") : '';
        const params        = {selected_file_id: file_id, selected_category_id: cate_id, selected_file_name: file_name, categoryPath: categoryPath};
        const result        = JSON.stringify(params);

        this.props._onChange(this.props.name, result);
    };

    render() {
        const {categoriesList, filesList, categorySelectedId, shortcode, isOpenModal, loading, fileClasses, fileLoading, editCategoryLink} = this.state;
        const folderIcon = (
            <svg className={"dashicon"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
        );
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
        );

        const cancelbtn = (
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                <path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
            </svg>
        );

        const customModalStyles = {
            content : {
                backgroundColor : 'rgb(255, 255, 255)',
                width: '90%',
                margin: '0 auto',
                borderRadius: '8px',
                // height: '90vh',
                boxSizing: 'border-box',
                padding: '0 24px 24px'
            }
        };
        let parsedJson = wpfdJsonParse(this.props.value);
        const categoryPath      = (this.props.value !== 'root' && false !== parsedJson) ? parsedJson.categoryPath.split("---").join(" > ") : '';
        const fileName          = (this.props.value !== 'root' && false !== parsedJson) ? parsedJson.selected_file_name : '';

        return(
                <Fragment>
                        <div className="wpfd-file-module wpfd-file-block">
                            <div className="wpfd-file-search">
                                <Fragment>
                                    <input
                                        type={'text'}
                                        value={this.props.value !== 'root' ? fileName : shortcode}
                                        className="editor-plain-text input-control"
                                        placeholder={'Please select a file'}
                                        readOnly={true}
                                        onChange={this.updateInput}
                                    />
                                    <button
                                        type={'button'}
                                        className={'wpfd-browse-files wpfd-button wpfd-material-button'}
                                        onClick={() => this.openModal()}
                                    >
                                        {'Choose File'}
                                    </button>
                                </Fragment>
                            </div>
                            {this.props.value !== 'root' &&
                            <div className="wpfd-selected-category-name">{'FILE CATEGORY: '}
                                <span>{categoryPath}</span>
                            </div>
                            }
                            <div className={`wpfd-edit-category`}>
                                <a href={editCategoryLink} target="_blank">{`manage files`}</a>
                            </div>
                        </div>

                        {/* Wpfd Modal Section */}
                        <Modal
                            className="wpfd-divi-modal"
                            isOpen={isOpenModal}
                            contentLabel={'WP File Download'}
                            ariaHideApp={false}
                            onRequestClose={() => this.setState({isOpenModal: false})}
                            parentSelector={() => window.parent.document.querySelector('body')}
                            style={customModalStyles}
                        >
                            {loading ?
                                <div className={'wpfd-loading-wrapper'}>
                                    <i className={'wpfd-loading'}>{loadingIcon}</i>
                                </div>
                                :
                                <div className="wpfd-modal-container">
                                    <div className="wpfd-modal-header">
                                        <div className="wpfd-modal-header-container">
                                            <h1 id="modal-header-label" className="modal-header-label">{`WP File Download`}</h1>
                                        </div>
                                        <button
                                            type="button"
                                            className="wpfd-modal-button main-home-parents has-icon"
                                            aria-label="Close dialog"
                                            onClick={() => this.setState({isOpenModal: false})}
                                        >
                                            {cancelbtn}
                                        </button>
                                    </div>
                                    <div className="wpfd-modal-content">
                                        <div className="wpfd-modal-left-panel">
                                            <div className="categories-dropdown">
                                                <ul>
                                                    {categoriesList.length > 0 ?
                                                    categoriesList.map((category, index) => {
                                                        let haveChild = (typeof (categoriesList[index + 1]) !== 'undefined' && categoriesList[index + 1].level > 0 && categoriesList[index + 1].level > category.level);
                                                        let paddingLeft = category.level * 12;
                                                        if (!haveChild) {
                                                            paddingLeft += 14;
                                                        }
                                                        return (
                                                            <li
                                                                key={index}
                                                                className={`wpfd-category cate-lv-${category.level} ${category.term_id === categorySelectedId ? 'active' : ''}`}
                                                                style={{paddingLeft: paddingLeft + 'px'}}
                                                                data-id-category={category.term_id}
                                                                data-id-parent={category.parent}
                                                                data-cloud-type={category.cloudType}
                                                                data-level={category.level}
                                                                onClick={() => this.fetchFiles(category.term_id, category.path)}
                                                            >
                                                                {category.level < 16 && haveChild &&
                                                                <span
                                                                    className={'wpfd-toggle-expand'}
                                                                />
                                                                }
                                                                {category.cloudType === category.term_id || category.cloudType === false
                                                                    ? <i>{folderIcon}</i>
                                                                    : <i className={category.cloudType.toString().replace(' ', '-') + '-icon'}/>
                                                                }
                                                                <span
                                                                    className={'wpfd-category-name'}
                                                                >
                                                                    {category.name}
                                                                </span>
                                                            </li>
                                                        );
                                                        }
                                                    )
                                                        :
                                                        <div className={'wpfd-nothing-found'}>{'No category found!'}</div>
                                                    }
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="wpfd-modal-right-panel">
                                            {fileLoading &&
                                            <div className={'wpfd-loading-wrapper'}>
                                                <i className={'wpfd-loading'}>{loadingIcon}</i>
                                            </div>
                                            }
                                            <div className={fileClasses}>
                                                {filesList.length > 0 ?
                                                    <ul className={'wpfd-files-wrapper'}>
                                                        {filesList.map((file, index) => {
                                                            let extClass = `ext ext-${file.ext}`;
                                                            return (
                                                                <li
                                                                    key={index}
                                                                    className={`wpfd-file`}
                                                                    onMouseOver={() => this.setState({fileHoverId: file.id})}
                                                                >
                                                                    <div className={extClass}>
                                                                        <span className={`txt`}>{file.ext}</span>
                                                                    </div>
                                                                    <div className={`file_info`}>
                                                                        <h3 className={'file_title'}>{file.name}</h3>
                                                                        <span className={'file_size'}>
                                                                            <strong>{'Size:'}</strong> {file.size}
                                                                        </span>
                                                                        <span className={`file_created`}>
                                                                            <strong>{`Date added:`}</strong> {file.created}
                                                                        </span>
                                                                    </div>
                                                                    <div className={`file_buttons`}>
                                                                        <button
                                                                            type={'button'}
                                                                            className={'wpfd-button orange-outline-button'}
                                                                            onClick={() => this.setSelectedFile(file)}
                                                                        >
                                                                            {'Insert this file'}
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                    :
                                                    <div className={'nothing-file-found!'}>{'There is no file in this category yet!'}</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Modal>
                </Fragment>
        );
    }

}

export default WpfdFile;