/**
 * External dependencies
 */

import React from 'react';
import { translate as __ } from 'i18n-calypso';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */

import { Dropdown, DropdownMenu, ExternalLink } from 'wp-plugin-components';
import ReplaceForm from 'component/replace-form';
import { replaceRow } from 'state/search/action';
import { deleteRow } from 'state/search/action';
import { STATUS_IN_PROGRESS } from 'state/settings/type';

/**
 *
 * @param {object} props - Component props
 * @param {boolean} props.isLoading
 * @param {string} props.description
 * @param {string} props.replacement
 * @param {string} props.sourceType
 */
function Actions( {
	setReplacement,
	replacement,
	actions,
	isLoading,
	onSave,
	result,
	onDelete,
	onEditor,
	description,
	sourceType,
	actionDropdown,
} ) {
	const reset = ( toggle ) => {
		toggle();
		setReplacement( '' );
	};
	const save = ( value, toggle ) => {
		toggle();
		setReplacement( '' );
		onSave( value, sourceType, result.row_id );
	};
	const clicked = ( ev, toggle ) => {
		ev.preventDefault();
		if ( ! isLoading ) {
			toggle();
		}
	};
	const deleteTheRow = ( ev ) => {
		ev.preventDefault();
		onDelete( result.source_type, result.row_id );
	};
	const editor = ( ev ) => {
		ev.preventDefault();
		onEditor();
	};

	const actionList = [];
	const actionMap = {
		edit: __( 'Edit Page' ),
	};

	const actionKeys = Object.keys( actions );
	for ( let index = 0; index < actionKeys.length; index++ ) {
		if ( actionMap[ actionKeys[ index ] ] ) {
			actionList.push(
				<ExternalLink url={ actions[ actionKeys[ index ] ] } key={ actionKeys[ index ] }>
					{ actionMap[ actionKeys[ index ] ] }
				</ExternalLink>
			);
		}
	}

	actionList.push(
		<a key="inline-edit" href="#" onClick={ editor }>
			{ __( 'Inline Editor' ) }
		</a>
	);
	actionList.push(
		<a key="delete" href="#" onClick={ deleteTheRow }>
			{ __( 'Delete Row' ) }
		</a>
	);

	if ( actionDropdown ) {
		return (
			<Dropdown
				key="replace"
				renderToggle={ ( isOpen, toggle ) => (
					<DropdownMenu
						menu={ [
							<a href="#" onClick={ ( ev ) => clicked( ev, toggle ) }>
								{ __( 'Replace Row' ) }
							</a>,
						].concat( actionList ) }
					/>
				) }
				onHide={ () => setReplacement( '' ) }
				hasArrow
				disabled={ isLoading }
				align="right"
				renderContent={ ( toggle ) => (
					<ReplaceForm
						className="searchregex-replace__modal"
						canReplace
						onSave={ ( value ) => save( value, toggle ) }
						onCancel={ () => reset( toggle ) }
						placeholder={ __( 'Replacement for all matches in this row' ) }
						description={ description }
						setReplace={ ( replace ) => setReplacement( replace ) }
						replace={ replacement }
					/>
				) }
			/>
		);
	}

	return actionList.reduce( ( prev, curr ) => [ prev, ' | ', curr ] );
}

function mapStateToProps( state ) {
	const { status } = state.search;

	return {
		isLoading: status === STATUS_IN_PROGRESS,
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		onDelete: ( sourceName, rowId ) => {
			dispatch( deleteRow( sourceName, rowId ) );
		},
		onSave: ( replacement, source, rowId ) => {
			dispatch( replaceRow( replacement, source, rowId ) );
		},
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Actions );
