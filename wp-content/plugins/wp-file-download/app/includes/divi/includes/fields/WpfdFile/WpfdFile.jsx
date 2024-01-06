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
        if(file.categoryFrom === 'aws') {
            file.id = decodeURIComponent(file.id);
            file_id = file.id;
        }
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
        const googleDrive_icon = (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.568 512.568">
                <g transform="translate(1 1)">
                    <path d="M510.266,329.047L336.707,33.996c-1.736-2.603-4.339-4.339-7.81-4.339H172.694c-3.471,0-6.075,1.736-7.81,3.471    L0.002,310.823c-0.868,2.603-1.736,6.075,0,8.678l76.873,153.745c0.15,1.172,0.555,2.315,1.229,3.326    c0.691,1.036,1.66,1.926,2.737,2.632c1.413,1.125,3.098,1.707,5.074,1.707h338.441c3.471,0,6.075-1.736,7.81-4.339l78.102-138.847    C512.002,335.121,512.002,331.65,510.266,329.047z M487.704,324.708H342.782L253.736,165.52c-0.169-1.061-0.568-2.134-1.205-3.09    L187.804,47.013H323.69L487.704,324.708z M322.491,324.708H172.453l72.205-139.28L322.491,324.708z M172.417,56.155l35.248,63.076    l26.642,48.406l-83.309,160.285c-0.307,0.355-0.601,0.726-0.867,1.125l-64.294,123.94L17.358,316.03L172.417,56.155z     M419.148,463.555H100.472l62.983-121.492h174.12h150.129L419.148,463.555z" fill="#404852"/>
                </g>
            </svg>
        );
        const dropbox_icon = (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 508.587 508.587">
                <g transform="translate(2 2)">
                    <path d="M405.775,198.222l100.812-73.929l-143.36-86.187l-101.973,67.982L159.28,38.107L-2,123.44l102.123,78.672l-85.056,78.341    l83.627,48.82v33.953c0,2.56,1.707,5.12,4.267,6.827l142.365,92.956c0.711,1.021,1.624,1.899,2.702,2.617    c1.707,0.853,2.56,0.853,4.267,0.853c1.04,0,1.763-0.003,2.555-0.582c0.701-0.314,1.305-0.718,1.711-1.124l145.067-93.867    c2.56-0.853,4.267-4.267,4.267-6.827v-40.566l83.627-53.3L405.775,198.222z M251.993,276.968l-121.453-74.896l130.087-75.884    l113.804,71.876L251.993,276.968z M335.92,347.867l-69.12-59.733l123.733-79.36l69.973,60.587L335.92,347.867z M363.227,58.587    L475.867,126l-83.337,60.836l-0.29-0.249l-2.184,1.407l-113.458-71.123l0.442-0.258l-0.427-0.284L363.227,58.587z M157.573,58.587    l87.04,58.027l-130.56,75.093L28.72,126.853L157.573,58.587z M114.907,212.187l122.847,75.402l-67.38,62.838l-58.88-34.133    c-0.448-0.299-0.928-0.526-1.42-0.72L44.08,277.04L114.907,212.187z M115.76,339.333l51.2,29.867    c0.642,0.481,1.314,0.842,1.999,1.093l3.975,2.32l25.837-24.178l44.99-41.529v135.68l-128-83.627V339.333z M339.333,366.64    l49.493-31.573v24.747l-128,82.773V306.053l68.267,59.733c0.911,0.911,2.041,1.492,3.269,1.793l1.851,1.62l2.591-1.651    C337.672,367.347,338.527,367.043,339.333,366.64z" fill="#404852"/>
                </g>
            </svg>
        );
        const onedrive_icon = (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <g>
                    <path d="M450.959,275.302c-4.8-31.303-25.794-57.333-54.127-69.272C396.095,140.822,342.829,88,277.45,88    c-32.78,0-63.667,13.272-86.141,36.72c-6.484-1.276-13.082-1.92-19.709-1.92c-51.554,0-94.297,38.443-101.066,88.169    C30.558,217.688,0,252.543,0,294.4C0,341.048,37.952,379,84.6,379h28.681c11.597,26.461,38.027,45,68.719,45h255    c41.355,0,75-33.645,75-75C512,312.413,485.669,281.861,450.959,275.302z M107,349H84.6C54.494,349,30,324.506,30,294.4    s24.494-54.6,54.6-54.6h15v-15c0-39.701,32.299-72,72-72c6.99,0,13.932,1.015,20.634,3.016l9.588,2.864l6.326-7.753    C225.224,130.001,250.483,118,277.45,118c46.502,0,84.819,35.689,89.013,81.115C364.984,199.042,363.497,199,362,199    c-5.471,0-10.917,0.497-16.281,1.483C326.024,180.367,299.198,169,270.75,169c-57.897,0-105,47.103-105,105    c0,0.589,0.005,1.179,0.015,1.77C132.188,283.208,107,313.218,107,349z M437,394H182c-24.813,0-45-20.187-45-45    s20.188-45,45.001-45h17.728l-2.935-17.483c-0.693-4.129-1.044-8.341-1.044-12.517c0-41.355,33.645-75,75-75    c22.623,0,43.814,10.069,58.14,27.625l6.327,7.752l9.587-2.864C350.388,229.846,356.173,229,362,229c33.084,0,60,26.916,60,60v15    h15c24.813,0,45,20.187,45,45S461.813,394,437,394z" fill="#404852"/>
                </g>
            </svg>
        );
        const aws_icon = (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333334 199332" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
              <g id="Layer_x0020_1">
                <g id="amazon-web-services-2.svg">
                  <path d="M93937 72393c0 4102 443 7428 1219 9867 887 2439 1996 5100 3548 7982 554 887 776 1774 776 2550 0 1109-665 2217-2106 3326l-6985 4656c-998 665-1995 998-2882 998-1109 0-2217-554-3326-1552-1552-1663-2882-3437-3991-5211-1109-1885-2217-3991-3437-6541-8648 10200-19512 15299-32594 15299-9312 0-16740-2661-22172-7982-5432-5322-8204-12417-8204-21286 0-9424 3326-17073 10089-22838s15743-8647 27161-8647c3769 0 7650 332 11752 887 4102 554 8315 1441 12749 2439v-8093c0-8426-1774-14301-5211-17738-3548-3437-9534-5100-18071-5100-3880 0-7871 443-11973 1441s-8093 2217-11973 3769c-1774 776-3104 1219-3880 1441s-1330 332-1774 332c-1552 0-2328-1109-2328-3437v-5432c0-1774 222-3104 776-3880s1552-1552 3104-2328c3880-1996 8537-3659 13969-4989C43606 885 49370 220 55468 220c13193 0 22838 2993 29046 8980 6098 5987 9202 15077 9202 27272v35920h222zM48926 89244c3659 0 7428-665 11419-1995s7539-3769 10532-7095c1774-2106 3104-4435 3770-7095 665-2661 1108-5876 1108-9645v-4656c-3215-776-6652-1441-10199-1885-3548-443-6984-665-10421-665-7428 0-12860 1441-16519 4435-3659 2993-5432 7206-5432 12749 0 5211 1330 9091 4102 11751 2661 2772 6541 4102 11641 4102zm89023 11973c-1996 0-3326-332-4213-1109-887-665-1663-2217-2328-4324l-26053-85697c-665-2217-998-3658-998-4434 0-1774 887-2772 2661-2772h10865c2106 0 3548 333 4324 1109 887 665 1552 2217 2217 4324l18625 73391 17295-73391c554-2217 1219-3659 2106-4324s2439-1109 4435-1109h8869c2106 0 3548 333 4435 1109 887 665 1663 2217 2106 4324l17516 74278 19180-74278c665-2217 1441-3659 2217-4324 887-665 2328-1109 4324-1109h10310c1774 0 2772 887 2772 2772 0 554-111 1109-222 1774s-333 1552-776 2772l-26718 85697c-665 2217-1441 3658-2328 4324-887 665-2328 1109-4213 1109h-9534c-2107 0-3548-333-4435-1109s-1663-2217-2106-4435l-17184-71507-17073 71396c-554 2217-1220 3658-2107 4434s-2439 1109-4434 1109h-9534zm142459 2993c-5765 0-11530-665-17073-1995s-9867-2772-12749-4435c-1774-998-2993-2106-3437-3104-443-998-665-2106-665-3104v-5654c0-2328 887-3437 2550-3437 665 0 1330 111 1995 333s1663 665 2772 1109c3769 1663 7871 2993 12195 3880 4435 887 8758 1330 13193 1330 6984 0 12417-1220 16186-3659s5765-5987 5765-10532c0-3104-998-5654-2993-7760-1996-2107-5765-3991-11197-5765l-16075-4989c-8093-2550-14080-6319-17738-11308-3658-4878-5543-10310-5543-16075 0-4656 998-8758 2993-12306s4656-6652 7982-9091c3326-2550 7095-4434 11530-5765S279190-2 284068-2c2439 0 4989 111 7428 443 2550 333 4878 776 7206 1219 2217 554 4324 1109 6319 1774s3548 1330 4656 1996c1552 887 2661 1774 3326 2771 665 887 998 2107 998 3659v5211c0 2328-887 3548-2550 3548-887 0-2328-444-4213-1331-6319-2882-13415-4324-21286-4324-6319 0-11308 998-14745 3104s-5211 5321-5211 9867c0 3104 1109 5765 3326 7871s6319 4213 12195 6097l15743 4989c7982 2550 13747 6098 17184 10643s5100 9756 5100 15521c0 4767-998 9091-2882 12860-1996 3770-4656 7095-8093 9756-3437 2771-7539 4767-12306 6208-4989 1552-10199 2328-15854 2328z" fill="#404852" />
                  <path fill="#404852" d="M301362 158091c-36474 26940-89467 41241-135031 41241-63858 0-121395-23614-164854-62859-3437-3104-332-7317 3770-4878 47006 27272 104988 43791 164964 43791 40465 0 84921-8426 125830-25721 6097-2772 11308 3991 5321 8426z" />
                  <path fill="#404852" d="M316550 140796c-4656-5987-30820-2883-42682-1441-3548 443-4102-2661-887-4989 20842-14634 55099-10421 59090-5543 3991 4989-1109 39246-20620 55653-2993 2550-5876 1220-4545-2106 4435-10976 14301-35698 9645-41574z" />
                </g>
              </g>
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
                                                        const renderCloudIcon = (cloudType) => {
                                                            switch (cloudType) {
                                                                case 'googleDrive':
                                                                    return <i class="wpfd-cloud-icon">{googleDrive_icon}</i>;
                                                                case 'dropbox':
                                                                    return <i class="wpfd-cloud-icon">{dropbox_icon}</i>;
                                                                case 'onedrive':
                                                                    return <i class="wpfd-cloud-icon">{onedrive_icon}</i>;
                                                                case 'onedrive business':
                                                                    return <i class="wpfd-cloud-icon">{onedrive_icon}</i>;
                                                                case 'aws':
                                                                    return <i class="wpfd-cloud-icon">{aws_icon}</i>;
                                                                default:
                                                                    return <i>{folderIcon}</i>;
                                                            }
                                                        };
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
                                                                {renderCloudIcon(category.cloudType)}
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