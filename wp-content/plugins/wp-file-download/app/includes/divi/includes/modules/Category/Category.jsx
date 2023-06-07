// External Dependencies
import React, { Component } from 'react';
import wpfdJsonParse from "../../utils";

class Category extends Component {

    static slug = 'divi_wpfd_file_category';

    constructor(props) {
        super(props);
        this.state = {
            categoryId: 'root',
            categoryTitle: '',
            categoryTheme: 'default',
            categoryFolderTree: true,
            isLoaded: true,
            loadingCategory: true,
            categoryShortcode: ''
        };
    }

    componentDidMount() {
        let categoryParams = this.props.category_id, selectedCategoryId = false;;
        if (categoryParams !== 'root') {
            let parsedJson = wpfdJsonParse(categoryParams);

            if (false !== parsedJson) {
                selectedCategoryId = parsedJson.categoryId;
            }

            this.fetCategoryShortcode(selectedCategoryId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let categoryParams = this.props.category_id, selectedCategoryId = false;
        if (categoryParams !== 'root') {
            let parsedJson = wpfdJsonParse(categoryParams);

            if (false !== parsedJson) {
                selectedCategoryId = parsedJson.categoryId;
            }
            if (prevState.categoryId.toString() !== selectedCategoryId.toString()) {
                this.fetCategoryShortcode(selectedCategoryId);
            }
        }
    }

    fetCategoryShortcode(category_id) {
        let loading = this.state.loadingCategory;
        if (!loading) {
            this.setState({
                loadingCategory: true
            });
        }
        fetch(window.et_fb_options.ajaxurl + "?action=wpfd&task=category.getCategoryShortcode&categoryId=" + category_id)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        categoryId: category_id,
                        categoryShortcode: result.data,
                        categoryTitle: result.title,
                        categoryTheme: result.theme,
                        loadingCategory: false
                    });
                },

                (error) => {
                    this.setState({
                        loadingCategory: true,
                        error
                    });
                }
            )
    }

    render() {
        const {categoryTheme, loadingCategory, categoryShortcode} = this.state;

        const categoryParams = this.props.category_id;

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

        if (categoryParams === 'root') {
            return (
                <div className="wpfd-divi-category-container">
                    <div id="divi-category-placeholder" className="divi-category-placeholder">
                        <span className="category-message">
                            {'Please select a WP File Download content to activate the preview'}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={`wpfd-divi-category-container wpfd-category-theme-${categoryTheme}`}>
                    {loadingCategory &&
                    <div className={'wpfd-loading-wrapper'}>
                        <i className={'wpfd-loading'}>{loadingIcon}</i>
                    </div>
                    }

                    {!loadingCategory &&
                    <div dangerouslySetInnerHTML={{ __html: categoryShortcode }} />
                    }
                </div>
            );
        }
    }
}



export default Category;
