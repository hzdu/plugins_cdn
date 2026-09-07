const { useEffect, useRef, useState } = wp.element;
import ReplyActions from '@app/components/ReplyActions';

const FormOutput = ( props ) => {
  const { params } = props;
  const { id, copyButton, className } = params;

  const divRef = useRef( null );               // 🔄 moved up
  const [ divContent, setDivContent ] = useState(
    () => divRef.current?.textContent || ''    // safe to read now
  );

  const baseClass = 'mwai-form-field-output';
  const classStr  = `${ baseClass }${ className ? ' ' + className : '' }`;

  useEffect( () => {
    if ( ! divRef.current ) return;

    const observer = new MutationObserver( () => {
      setDivContent( divRef.current.innerText );
    } );

    observer.observe( divRef.current, { childList: true, subtree: true } );
    return () => observer.disconnect();
  }, [] );

  return (
    <div style={ { position: 'relative' } }>
      <ReplyActions content={ divContent } enabled={ copyButton }>
        <div id={ id } ref={ divRef } className={ classStr } />
      </ReplyActions>
    </div>
  );
};

export default FormOutput;
