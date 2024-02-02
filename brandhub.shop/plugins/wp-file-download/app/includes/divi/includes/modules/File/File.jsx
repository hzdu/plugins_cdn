// External Dependencies
import React, { Component } from 'react';
import wpfdJsonParse from "../../utils";

class File extends Component {

    static slug = 'divi_wpfd_single_file';

    constructor(props) {
        super(props);
        this.state = {
            file_id: 'root',
            category_id: '',
            category_title: '',
            fileLoading: true,
            fileInfo: '',
            error: false
        };
    }

    componentDidMount() {
        let parsedJson = wpfdJsonParse(this.props.file_params);
        if (this.props.file_params !== 'root' && false !== parsedJson) {
            const fileId                = parsedJson.selected_file_id;
            const categoryId            = parsedJson.selected_category_id;
            this.fetFileShortcode(fileId, categoryId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let parsedJson = wpfdJsonParse(this.props.file_params);
        if (this.props.file_params !== 'root' && false !== parsedJson) {
            let fileId = parsedJson.selected_file_id;
            let categoryId = parsedJson.selected_category_id;
            if (prevState.file_id.toString() !== fileId.toString()) {
                this.fetFileShortcode(fileId, categoryId);
            }
        }
    }

    fetFileShortcode(file_id, category_id) {
        const self = this;
        const url = window.et_fb_options.ajaxurl + `?action=wpfd&task=file.callFileShortcode&file_id=${encodeURIComponent(file_id)}&category_id=${category_id}`;
        if (file_id && category_id) {
            setTimeout(function () {
                if (!self.state.fileLoading) {
                    self.setState({fileLoading: true})
                }

                fetch(url)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (response) {
                        if (false === response.success) {
                            self.setState({
                                fileLoading: false,
                                fileError: true,
                            })
                        } else {
                            self.setState({
                                file_id: file_id,
                                fileInfo: response.data,
                                fileLoading: false
                            });
                        }
                    })
                    .catch(function (error) {
                        self.setState({
                            fileLoading: false,
                            error: true,
                        })
                    });
            }, 500);
        }
    }

    render() {

        const fileParams = this.props.file_params;

        const loading = this.state.fileLoading;

        const loadingIcon = (
            <svg className={'wpfd-loading'} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
                 viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">icon
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

        if (fileParams === 'root') {
            return (
                <div className="divi-file-container">
                    <div id="divi-single-file-placeholder" className="divi-single-file-placeholder">
                        <span className="file-message">
                            {'Please select a WP File Download content to activate the preview'}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="divi-file-container">
                    {loading &&
                        <div className={'wpfd-loading-wrapper'}>
                            <i className={'wpfd-loading'}>{loadingIcon}</i>
                        </div>
                    }
                    {!loading &&
                        <div dangerouslySetInnerHTML={{ __html: this.state.fileInfo }} />
                    }
                </div>
            );
        }
    }
}


export default File;
