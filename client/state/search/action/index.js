/**
 * Internal dependencies
 */
import { SEARCH_FAIL, SEARCH_CANCEL, SEARCH_VALUES } from '../type';

export * from './replace';
export * from './search';
export * from './row';

/** @typedef {import('state/search/type.js').SearchValues} SearchValues */

/**
 * Update search values
 *
 * @param {SearchValues} searchValue - Search values
 */
export const setSearch = ( searchValue ) => ( { type: SEARCH_VALUES, searchValue } );
export const setError = ( error ) => ( { type: SEARCH_FAIL, error: { message: error } } );
export const cancel = () => ( { type: SEARCH_CANCEL, clearAll: false } );
export const clear = () => ( { type: SEARCH_CANCEL, clearAll: true } );
