import React, { useState }   from 'react';
import ReactQuill            from 'react-quill';
import { useField }          from 'formik';
import withVisibilityControl from '../withVisibilityControl';

const WYSIWYGField = ( { name, label, description, initialMode, onModeChange, ...props } ) => {
    const [ field,, helpers ] = useField( name );
    const [ mode, setMode ] = useState( initialMode || 'WYSIWYG' );

    const handleEditorChange = ( updatedContent ) => {
        helpers.setValue( updatedContent );
    };

    const handleModeChange = ( updatedMode ) => {
        setMode( updatedMode );
        onModeChange( updatedMode );
    };

    const modules = {
        toolbar: [
            [ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
            [ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' } ],
            [ 'link' ],
            [ 'clean', 'code' ],
        ],
    };

    const editorModes = [
        { id: 'WYSIWYG', title: 'WYSIWYG' },
        { id: 'HTML', title: 'HTML' },
    ];

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            {mode === 'WYSIWYG' ? (
                <ReactQuill
                    id={name}
                    onChange={handleEditorChange}
                    value={field.value}
                    modules={modules}
                    theme="snow"
                    className={'cfw-wysiwyg-visual-mode-element'}
                />
            ) : (
                <textarea
                    id={name}
                    {...field}
                    onChange={( e ) => handleEditorChange( e.target.value )}
                    className={'cfw-wysiwyg-text-mode-element'}
                />
            )}

            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 mt-2">
                {editorModes.map( ( editorMode ) => (
                    <div key={editorMode.id} className="flex items-center">
                        <input
                            id={editorMode.id}
                            name={`editor-mode-${name}`}
                            type="radio"
                            defaultChecked={editorMode.id === mode}
                            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                            onChange={() => handleModeChange( editorMode.id )}
                        />
                        <label htmlFor={editorMode.id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                            {editorMode.title}
                        </label>
                    </div>
                ) )}
            </div>
            <p className="mt-2 text-sm text-gray-500" dangerouslySetInnerHTML={ { __html: description }}></p>
        </div>
    );
};

export default withVisibilityControl( WYSIWYGField );
