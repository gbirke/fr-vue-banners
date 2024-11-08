import { describe, expect, it } from 'vitest';
import { Translator } from '@src/Translator';
import { DonorsNeededSentence } from '@src/utils/DynamicContent/generators/DonorsNeededSentence';

describe( 'DonorsNeededSentence', () => {
	it( 'returns empty string if donors needed is zero', function () {
		const donorsNeeded = new DonorsNeededSentence( 0, new Translator( {} ) );

		expect( donorsNeeded.getText() ).toEqual( '' );
	} );

	it( 'returns donors needed sentence if number is less than 100', function () {
		const donorsNeeded = new DonorsNeededSentence( 99, new Translator( { 'remaining-donors-needed-sentence': '{{donorsNeeded}}' } ) );

		expect( donorsNeeded.getText() ).toEqual( '99' );
	} );

	it( 'returns rounded donors needed sentence if number is over 100', function () {
		const donorsNeeded = new DonorsNeededSentence( 101, new Translator( { 'remaining-donors-needed-sentence': '{{donorsNeeded}}' } ) );

		expect( donorsNeeded.getText() ).toEqual( '100' );
	} );
} );
