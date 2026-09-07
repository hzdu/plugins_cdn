const { render } = wp.element;
import FormField from './forms/FormField';
import FormUpload from './forms/FormUpload';
import FormSubmit from './forms/FormSubmit';
import FormOutput from './forms/FormOutput';
import FormReset from './forms/FormReset';
import FormConditional from './forms/FormConditional';

function decodeHtmlEntities(encodedStr) {
  if (!encodedStr) {
    return "{}";
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedStr;
  return textarea.value;
}

document.addEventListener('DOMContentLoaded', function() {

  function processContainers(containers, Component) {
    containers.forEach((container) => {
      const params = JSON.parse(decodeHtmlEntities(container.getAttribute('data-params')));
      const system = JSON.parse(decodeHtmlEntities(container.getAttribute('data-system')));
      const theme = JSON.parse(decodeHtmlEntities(container.getAttribute('data-theme')));
      container.removeAttribute('data-params');
      container.removeAttribute('data-system');
      container.removeAttribute('data-theme');
      render(wp.element.createElement(Component, { system, params, theme }), container);
    });
  }

  const formUploads = document.querySelectorAll('.mwai-form-upload-container');
  processContainers(formUploads, FormUpload);

  const formFields = document.querySelectorAll('.mwai-form-field-container');
  processContainers(formFields, FormField);

  const submitFields = document.querySelectorAll('.mwai-form-submit-container');
  processContainers(submitFields, FormSubmit);

  const resetFields = document.querySelectorAll('.mwai-form-reset-container');
  processContainers(resetFields, FormReset);

  const outputFields = document.querySelectorAll('.mwai-form-output-container');
  processContainers(outputFields, FormOutput);

  const conditionalBlocks = document.querySelectorAll('.mwai-form-conditional-container');
  processContainers(conditionalBlocks, FormConditional);
});
