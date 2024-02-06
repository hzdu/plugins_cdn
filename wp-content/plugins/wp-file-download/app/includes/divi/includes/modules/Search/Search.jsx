// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';

class Search extends Component {

    static slug = 'divi_wpfd_search';

    constructor(props) {
        super(props);
        this.state = {
            categoryFilter: '1',
            tagFilter: '1',
            tagAs: 'searchbox',
            creationDateFilter: '1',
            updateDateFilter: '1',
            typeFilter: '1',
            weightFilter: '1',
            minimizeFilters: '1',
            pageFilter: '20',
            searchShortCode: '',
            searchLoading: true,
            error: false
        };
    }

    componentDidMount() {
        let categoryFilter      = (this.props.category_filter === 'on') ? '1' : '0';
        let tagFilter           = (this.props.tag_filter === 'on') ? '1' : '0';
        let tagAs               = this.props.display_tag_as;
        let creationDateFilter  = (this.props.creation_date_filter === 'on') ? '1' : '0';
        let updateDateFilter    = (this.props.update_date_filter === 'on') ? '1' : '0';
        let typeFilter          = (this.props.type_filter === 'on') ? '1' : '0';
        let weightFilter        = (this.props.weight_filter === 'on') ? '1' : '0';
        let minimizeFilters    = (this.props.minimize_filters === 'on') ? '1' : '0';
        let pageFilter          = this.props.per_page_filter;
        this.fetSearchShortcode(categoryFilter, tagFilter, tagAs, creationDateFilter, updateDateFilter, typeFilter, weightFilter, minimizeFilters, pageFilter);

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const categoryFilter      = (this.props.category_filter === 'on') ? '1' : '0';
        const tagFilter           = (this.props.tag_filter === 'on') ? '1' : '0';
        const tagAs               = this.props.display_tag_as;
        const creationDateFilter  = (this.props.creation_date_filter === 'on') ? '1' : '0';
        const updateDateFilter    = (this.props.update_date_filter === 'on') ? '1' : '0';
        const typeFilter          = (this.props.type_filter === 'on') ? '1' : '0';
        const weightFilter        = (this.props.weight_filter === 'on') ? '1' : '0';
        const minimizeFilters     = (this.props.minimize_filters === 'on') ? '1' : '0';
        const pageFilter          = this.props.per_page_filter;
        if (this.state.categoryFilter.toString() !== categoryFilter.toString() || this.state.tagFilter.toString() !== tagFilter.toString()
            || this.state.tagAs.toString() !== tagAs.toString() || this.state.creationDateFilter.toString() !== creationDateFilter.toString()
            || this.state.updateDateFilter.toString() !== updateDateFilter.toString() || this.state.pageFilter.toString() !== pageFilter.toString()
            || this.state.typeFilter.toString() !== typeFilter.toString() || this.state.weightFilter.toString() !== weightFilter.toString() || this.state.minimizeFilters.toString() !== minimizeFilters.toString()) {
            this.fetSearchShortcode(categoryFilter, tagFilter, tagAs, creationDateFilter, updateDateFilter, typeFilter, weightFilter, minimizeFilters, pageFilter);
        }
    }

    fetSearchShortcode(categoryFilter, tagFilter, tagAs, creationDateFilter, updateDateFilter, typeFilter, weightFilter, minimizeFilters, pageFilter) {
        let loading = this.state.searchLoading;
        const url   = window.et_fb_options.ajaxurl + "?action=wpfd&task=category.callSearchShortcode&categoryFilter=" + categoryFilter + "&tagFilter=" + tagFilter + "&tagAs=" + tagAs + "&creationDateFilter=" + creationDateFilter + "&updateDateFilter=" + updateDateFilter + "&typeFilter="+ typeFilter +"&weightFilter="+ weightFilter +"&pageFilter=" + pageFilter + "&minimizeFilters=" + minimizeFilters;
        if (!loading) {
            this.setState({
                searchLoading: true
            });
        }
        fetch(url)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        categoryFilter: categoryFilter,
                        tagFilter: tagFilter,
                        tagAs: tagAs,
                        creationDateFilter: creationDateFilter,
                        updateDateFilter: updateDateFilter,
                        typeFilter: typeFilter,
                        weightFilter: weightFilter,
                        minimizeFilters: minimizeFilters,
                        pageFilter: pageFilter,
                        searchShortCode: result.data,
                        searchLoading: false
                    });
                },

                (error) => {
                    this.setState({
                        searchLoading: true,
                        error
                    });
                }
            )
    }

    render() {

        const preview = this.state.searchShortCode;

        const loading = this.state.searchLoading;

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

        return (
            <div className="divi-search-container">
                {loading &&
                    <div className={'wpfd-loading-wrapper'}>
                        <i className={'wpfd-loading'}>{loadingIcon}</i>
                    </div>
                }
                {!loading &&
                    <div dangerouslySetInnerHTML={{__html: preview}} />
                }
            </div>
        );
    }
}


export default Search;
