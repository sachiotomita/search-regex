/**
 * External dependencies
 */

import React from 'react';
import { translate as __, numberFormat } from 'lib/locale';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */

import Nav from './nav-button';
import { SEARCH_FORWARD, SEARCH_BACKWARD } from 'state/search/type';
import { search } from 'state/search/action';

const forwardPercent = ( total, current ) => current === false ? 100 : ( current / total ) * 100;
const backPercent = ( total, current ) => current === 0 ? current : ( current / total ) * 100;

function AdvancedPagination( props ) {
	const { total, progress, onChangePage, isLoading, searchDirection, search, noTotal = false } = props;
	const { previous, next } = progress;

	return (
		<div className="tablenav-pages">
			{ noTotal && <div>&nbsp;</div> }
			{ ! noTotal && <div className="displaying-num">
				{ __( '%s database row in total', '%s database rows in total', {
						count: total,
						args: numberFormat( total ),
					} ) }
			</div> }
			<div className="pagination-links">
				<Nav title={ __( 'First page' ) } button="«" className="first-page" enabled={ previous !== false && ! isLoading } onClick={ () => onChangePage( search, 0, SEARCH_FORWARD ) } />
				<Nav title={ __( 'Prev page' ) } button="‹" className="prev-page" enabled={ previous !== false && ! isLoading } onClick={ () => onChangePage( search, previous, SEARCH_BACKWARD ) } />

				<span className="tablenav-paging-text">
					{ __( 'Progress %(current)s%%', {
						args: {
							current: numberFormat( searchDirection === SEARCH_FORWARD ? forwardPercent( total, next ) : backPercent( total, next == false ? previous : next ) ),
						},
					} ) }
				</span>

				<Nav title={ __( 'Next page' ) } button="›" className="next-page" enabled={ next !== false && ! isLoading } onClick={ () => onChangePage( search, next, SEARCH_FORWARD ) } />
			</div>
		</div>
	);
}


function mapStateToProps( state ) {
	const { search } = state.search;

	return {
		search,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onChangePage: ( searchValue, page, searchDirection ) => {
			dispatch( search( searchValue, page, searchDirection ) );
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( AdvancedPagination );