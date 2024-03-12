import React                 from 'react';
import Editor                from '@monaco-editor/react';
import withVisibilityControl from '../withVisibilityControl'; // Adjusted import

const CodeEditorField = ( { field, form, label, description, language, ...props } ) => (
    <div className={`cfw-admin-field-container ${props.nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <Editor
            height="400px"
            width="100%"
            language={language}
            value={field.value}
            theme="vs-dark"
            onChange={( newValue ) => {
                form.setFieldValue( field.name, newValue );
            }}
            options={{
                selectOnLineNumbers: true,
                scrollbar: {
                    alwaysConsumeMouseWheel: false,
                },
            }}
        />
        <p className="mt-2 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: description }}></p>
    </div>
);

export default withVisibilityControl( CodeEditorField );
