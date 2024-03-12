import ReactQuill          from 'react-quill';
import React, { useState } from 'react';

const RichTextArea = ( { value, onSelect, onModeChange, initialMode, id } ) => {
    const [ content, setContent ] = useState( value );
    const [ mode, setMode ] = useState( initialMode );  // Add this line

    const handleEditorChange = ( updatedContent ) => {
        setContent( updatedContent );
        onSelect( updatedContent );
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
            {mode === 'WYSIWYG' ? (
                <ReactQuill
                    value={content}
                    onChange={handleEditorChange}
                    modules={modules}
                    theme="snow"
                />
            ) : (
                <textarea
                    value={content}
                    onChange={( e ) => handleEditorChange( e.target.value )}
                    className="block min-w-[414px] min-h-[100px] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
            )}

            <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0 mt-2">
                {editorModes.map( ( editorMode ) => (
                    <div key={editorMode.id} className="flex items-center">
                        <input
                            id={editorMode.id}
                            name={`editor-mode-${id}`}
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
        </div>
    );
};

export default RichTextArea;
