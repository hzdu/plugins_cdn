// External Dependencies
import React, {Component, Fragment} from 'react';
import wpfdJsonParse from "../../utils";

class WpfdCategoryButton extends Component {

    static slug = 'wpfd_category_button';

    constructor(props) {
        super(props);
        this.state = {
            categoriesList: [],
            searchText: '',
            selectedCatName: '',
            selectedCatId: '',
            showCategoryList: false,
            isManagingFocus: false,
            showInput: true,
            loading: true,
            error: false,
            preview: false,
            chosen: true,
            editCategoryLink: '#'
        };

        this.searchCategoryHandle   = this.searchCategoryHandle.bind(this);
        this.fetchCategories        = this.fetchCategories.bind(this);
        this.setSelectedCategoryId  = this.setSelectedCategoryId.bind(this);
        this.handleClickOutside     = this.handleClickOutside.bind(this);
    }

    /**
    * Handle input value change.
    *
    * @param {string} selected_category_id
    * @param {string} selected_category_path
    */
    _onChange = (selected_category_id, selected_category_path) => {
        const newPath = selected_category_path.split(" > ").join("---");
        const selectedCategoryParams = {categoryId: selected_category_id.toString(), categoryPath: newPath };
        this.props._onChange(this.props.name, JSON.stringify(selectedCategoryParams));
    };

    componentDidMount() {
        const {isPreview}       = this.state.preview;
        const categoryParams    = this.props.value;
        if (isPreview) {
            this.setState({preview: true})
        } else {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
        if (categoryParams !== 'root') {
            let jsonParsed = wpfdJsonParse(categoryParams);
            if (false !== jsonParsed) {
                const categoryId = jsonParsed.categoryId;
                this.fetchCategoryParams(categoryId);
            }
        }
        this.fetchEditCategory();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    componentDidUpdate(prevProps, prevState ) {
        const {categoriesList, showCategoryList} = this.state;

        if (categoriesList.length === 0 && showCategoryList) {
            this.fetchCategories();
        }
    }

    handleClickOutside(event) {
        const domNode = this.categoriesDropdown;

        if (!domNode || !domNode.contains(event.target)) {
            this.setState({showInput: false, showCategoryList: false})
        }
    }

    fetchCategories(showList = true) {
        const self = this;
        const wpfdCategoriesUrl = window.et_fb_options.ajaxurl +`?action=wpfd&task=categories.listCats`;

        if (!self.state.loading) {
            self.setState({loading: true});
        }

        fetch(wpfdCategoriesUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                if (!response.success) {
                    self.setState({
                        loading: false,
                        error: true,
                    })
                } else {
                    self.setState({
                        categoriesList: response.data,
                        loading: false,
                        showInput: showList,
                        showCategoryList: showList,
                    })
                }
            })
            .catch(function (error) {
                self.setState({
                    loading: false,
                    error: true,
                })
            });

        if (this.state.error) {
            this.setState({error: false});
        }
    }

    fetchCategoryParams(cateId) {
        const self      = this;
        if (cateId) {
            const loading   = self.state.loading;
            if (!loading) {
                self.setState({
                    loading: true
                });
            }
            fetch(window.et_fb_options.ajaxurl + "?action=wpfd&task=category.getCategoryParams&categoryId=" + cateId)
                .then(res => res.json())
                .then(
                    (result) => {
                        self.setState({
                            selectedCatName: result.data.title,
                            loading: false
                        });
                    },

                    (error) => {
                        self.setState({
                            loading: false,
                            error: true,
                        });
                    }
                )
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

    setSelectedCategoryId(id, catname, catpath) {
        this.setState({selectedCatId: id, shoswCategoryList: false, searchText: catname, selectedCatName: catname, showInput: false});
        this._onChange(id, catpath);
    }

    searchCategoryHandle(event) {
        const searchText = event.target.value;
        this.setState({searchText: searchText, showCategoryList: true});
    }

    searchCategoryRecursive(category, categoriesIds, results) {
        if (typeof (results) === "undefined") {
            results = [];
        }

        if (!category || typeof (category) === 'undefined') {
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

    render() {
        const previewImageData = 'data:image/png;base64,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';
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
        const {categoriesList, searchText, selectedCatName, showCategoryList, showInput, loading, preview, editCategoryLink} = this.state;
        let filteredCategoriesList;
        let jsonParsed = wpfdJsonParse(this.props.value);
        let selectedCategoryId = (this.props.value !== 'root' && false !== jsonParsed) ? jsonParsed.categoryId : this.state.selectedCatId;
        let categoriesIds = [];
        let filterCategoryResults = [];
        filteredCategoriesList = categoriesList.filter(category => {
            if (typeof searchText === 'undefined') {
                return true;
            }

            if (searchText.toLowerCase().indexOf('wpfd_category') >= 0) {
                return true;
            }

            return (category.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
        });

        if (filteredCategoriesList.length && searchText !== '') {
            // Index categories list with term_id
            categoriesList.map((lCategory, lIndex) => {
                if (!lCategory || !lCategory.term_id) {
                    return;
                }

                categoriesIds[lCategory.term_id] = lCategory;
            });

            // Search Filter in deep
            let insertedCategoriesIds = [];
            filteredCategoriesList.map((fCategory, fIndex) => {
                if (typeof (fCategory) === "undefined") {
                    return;
                }

                let queueSearchFilters = [];

                if (fCategory.parent && parseInt(fCategory.parent) !== 0) {
                    queueSearchFilters = queueSearchFilters.concat(this.searchCategoryRecursive(fCategory, categoriesIds, queueSearchFilters));
                    filterCategoryResults = filterCategoryResults.concat(queueSearchFilters);
                }
            });

            filterCategoryResults.map(insertedCategory => {
                if (typeof (insertedCategory) === "undefined") {
                    return;
                }

                if (typeof (insertedCategory.term_id) === "undefined") {
                    return;
                }

                insertedCategoriesIds[insertedCategory.term_id] = insertedCategory;
            });

            filteredCategoriesList.filter(isSearchCategory => {
                if (typeof (isSearchCategory) === 'undefined') {
                    return;
                }

                if (parseInt(isSearchCategory.parent) === 0 && !insertedCategoriesIds.hasOwnProperty(isSearchCategory.term_id)) {
                    filterCategoryResults.push(isSearchCategory);
                }
            });

            filterCategoryResults = filterCategoryResults.filter(resultCategory => {
                return(typeof (resultCategory) !== 'undefined');
            });
        } else {
            // Search on init
            filterCategoryResults = filteredCategoriesList;
        }

        const categoryPath = (this.props.value !== 'root' && false !== jsonParsed) ? jsonParsed.categoryPath.split("---").join(" > ") : '';

        return(

            preview ?
                <img alt={'WP File Download Category'} width='100%' src={previewImageData}/>
                :
                <Fragment>
                    <div className="wpfd-category-module">
                        <div className="wpfd-category-search">
                            {
                                showInput ?
                                    <Fragment>
                                        <textarea
                                            type="text"
                                            value={(this.props.value !== 'root' && this.state.chosen === true) ? selectedCatName : searchText}
                                            className="editor-plain-text input-control"
                                            id="wpfd-category"
                                            placeholder={'Search for file category…'}
                                            onFocus={() => this.setState({
                                                showCategoryList: true,
                                                showInput: true,
                                                searchText: '',
                                                loading: true,
                                                selectedCatName: '',
                                                categoriesList: [],
                                                chosen: false
                                            })}
                                            onChange={this.searchCategoryHandle}
                                        />
                                        {this.props.value !== 'root' &&
                                        <div className="wpfd-selected-category-name">{'FILE CATEGORY: '}
                                            <span>{categoryPath}</span>
                                        </div>
                                        }
                                        <div className={`wpfd-edit-category`}>
                                            <a href={editCategoryLink} target="_blank">{`manage files`}</a>
                                        </div>
                                        {showCategoryList &&
                                        <div className="categories-dropdown" ref={(elm) => this.categoriesDropdown = elm}>
                                            {loading ?
                                                <div className={'wpfd-loading-wrapper'}>
                                                    <div className="wpfd-loading">{loadingIcon}</div>
                                                </div>
                                                :
                                                <ul>
                                                    {categoriesList.length > 0 ?
                                                        (filterCategoryResults.length > 0 ?
                                                                filterCategoryResults.map((category, index) => {
                                                                    let haveChild = (typeof (categoriesList[index + 1]) !== 'undefined' && categoriesList[index + 1].level > category.level && categoriesList[index + 1].level > 0);
                                                                    let paddingLeft = category.level * 12;
                                                                    if (!haveChild) {
                                                                        paddingLeft += 14
                                                                    }
                                                                    let selectedClass = '';
                                                                    if (parseInt(selectedCategoryId) === parseInt(category.term_id)) {
                                                                        selectedClass = 'active'
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
                                                                            className={`wpfd-category cat-lv-${category.level} ${selectedClass}`}
                                                                            style={{paddingLeft: paddingLeft + 'px'}}
                                                                            data-id-category={category.term_id}
                                                                            data-id-parent={category.parent}
                                                                            data-cloud-type={category.cloudType}
                                                                            data-level={category.level}
                                                                            onClick={() => this.setSelectedCategoryId(category.term_id, category.name, category.path)}
                                                                        >
                                                                            {category.level < 16 && haveChild &&
                                                                            <span
                                                                                className={'wpfd-toggle-expand'}
                                                                            />
                                                                            }
                                                                            {renderCloudIcon(category.cloudType)}

                                                                            <span className={'wpfd-category-name'}>
                                                                              {category.name}
                                                                            </span>
                                                                        </li>
                                                                    )
                                                                })
                                                                :
                                                                <li>{'No file category found with this name…'}</li>
                                                        )
                                                        :
                                                        <li>{'No category found!'}</li>
                                                    }
                                                </ul>
                                            }
                                        </div>
                                        }
                                    </Fragment>
                                    :
                                    <Fragment>
                                        <textarea
                                            value={searchText}
                                            className="editor-plain-text input-control"
                                            id="wpfd-category"
                                            placeholder={'Click here to select a category'}
                                            onFocus={() => this.setState({
                                                showCategoryList: true,
                                                showInput: true,
                                                searchText: '',
                                                loading: true,
                                                selectedCatname: '',
                                                categoriesList: [],
                                                chosen: false
                                            })}
                                            onBlur={() => this.setState({
                                                showCategoryList: false,
                                                showInput: false,
                                                loading: false,
                                                searchText: '',
                                                selectedCatName: this.state.selectedCatName,
                                                categoriesList: [],
                                            })}
                                            onChange={() => {
                                            }}
                                        />
                                        {this.props.value !== 'root' &&
                                        <div className="wpfd-selected-category-name">{'FILE CATEGORY: '}
                                            <span>{categoryPath}</span>
                                        </div>
                                        }
                                        <div className={`wpfd-edit-category`}>
                                            <a href={editCategoryLink} target="_blank">{`manage files`}</a>
                                        </div>
                                    </Fragment>
                            }
                        </div>
                    </div>
                </Fragment>
            );
       }

 }

export default WpfdCategoryButton;