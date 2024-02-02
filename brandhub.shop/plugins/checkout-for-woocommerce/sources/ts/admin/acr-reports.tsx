import ReactDOM           from 'react-dom';
import React              from 'react';
import ACRCartsTable      from './components/acr/carts';
import ACRReport          from './components/acr/dashboard';

ReactDOM.render( <ACRReport />, document.getElementById( 'cfw-acr-reports' ) );
ReactDOM.render( <ACRCartsTable />, document.getElementById( 'cfw-acr-carts' ) );
