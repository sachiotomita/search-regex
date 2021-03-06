/**
 * External dependencies
 */

import React, { useState } from 'react';
import classnames from 'classnames';
import { translate as __ } from 'i18n-calypso';

/**
 * Internal dependencies
 */

import { Dropdown } from 'wp-plugin-components';
import ReplaceForm from 'component/replace-form';
import ReplacementPhrase from './replacement-phrase';
import { regexReplace, getMatchReplacement, getTypeOfReplacement } from './highlight-tools';

/**
 * @callback SaveCallback
 * @param {string} phrase
 */

/**
 * @callback UpdateCallback
 * @param {string} phrase
 */

/**
 * A highlighted replacement phrase with dropdown toggle
 *
 * @param {object} props - Component props
 * @param {string} props.typeOfReplacement - Replacement type
 * @param {boolean} props.isReplacing - Are we replacing?
 * @param {object} props.children - Child
 * @param {SaveCallback} props.onSave - Save callback
 * @param {string} props.match - Match string
 * @param {string} props.replacement - Replacement string
 * @param {string[]} props.captures - Captured data
 */
function Replacement( props ) {
	const { isReplacing, onSave, match, replacement, captures } = props;
	const [ specific, setSpecific ] = useState( '' );
	const matchedPhrase = getMatchReplacement( [ specific, ...replacement ], match );
	const typeOfReplacement = getTypeOfReplacement( matchedPhrase, match );

	const save = ( replacedPhrase, toggle ) => {
		onSave( replacedPhrase );
		toggle();
	};
	const reset = ( toggle ) => {
		setSpecific( '' );
		toggle && toggle();
	};

	return (
		<Dropdown
			className={ classnames( {
				'searchregex-result__replaced': typeOfReplacement === 'replace',
				'searchregex-result__highlight': typeOfReplacement === 'match',
				'searchregex-result__deleted': typeOfReplacement === 'delete',
			} ) }
			renderToggle={ ( isOpen, toggle ) => (
				<span onClick={ () => ! isReplacing && toggle() } title={ match }>
					<ReplacementPhrase match={ regexReplace( matchedPhrase, captures ) } originalMatch={ match } />
				</span>
			) }
			onHide={ reset }
			hasArrow
			align="centre"
			renderContent={ ( toggle ) => (
				<ReplaceForm
					className="searchregex-replace__modal"
					canReplace
					setReplace={ setSpecific }
					replace={ specific }
					onSave={ ( value ) => save( value, toggle ) }
					onCancel={ () => reset( toggle ) }
					placeholder={ __( 'Replacement for this match' ) }
					description={ __( 'Replace single phrase.' ) }
				/>
			) }
		/>
	);
}

export default Replacement;
