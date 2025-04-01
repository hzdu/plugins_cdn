/**
 * External dependencies
 */
import { Fragment }               from '@wordpress/element';
import apiFetch                   from '@wordpress/api-fetch';
import React                      from 'react';
import { computeSuggestionMatch } from '@woocommerce/components/build/search/autocompleters/utils';

/**
 * Internal dependencies
 */
import { AutoCompleter }          from '@woocommerce/components/build-types/search/autocompleters';

/**
 * A completer for selecting user roles.
 */
const completer: AutoCompleter = {
    name: 'user_roles',
    className: 'woocommerce-search__product-result',
    options( search ) {
        return apiFetch( {
            path: '/checkoutwc/v1/user-roles',
        } ).then( ( roles: { slug: string; name: string }[] ) => {
            const formattedRoles = roles.map( ( role ) => ( {
                id: role.slug,
                slug: role.slug,
                name: role.name,
            } ) );

            if ( !search ) {
                return formattedRoles;
            }

            const searchLower = search.toLowerCase();
            return formattedRoles.filter( ( role ) => role.name.toLowerCase().includes( searchLower ) );
        } );
    },
    isDebounced: true,
    getOptionIdentifier( role ) {
        return role.id;
    },
    getOptionKeywords( role ) {
        return [ role.name ];
    },
    getOptionLabel( role, query ) {
        const match = computeSuggestionMatch( role.name, query );
        // Fragment not needed here since we're returning a single element with its own key
        return (
            <Fragment>
                <span
                    key="name"
                    className="woocommerce-search__result-name"
                    aria-label={role.name}
                >
                    {match?.suggestionBeforeMatch}
                    <strong className="components-form-token-field__suggestion-match">
                        {match?.suggestionMatch}
                    </strong>
                    {match?.suggestionAfterMatch}
                </span>
            </Fragment>
        );
    },
    getOptionCompletion( role ) {
        return {
            key: role.id,
            label: role.name,
        };
    },
};

export default completer;
