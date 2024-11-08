import { describe, expect, it } from 'vitest';
import { Translator } from '@src/Translator';
import { CurrencyEn } from '@src/utils/DynamicContent/formatters/CurrencyEn';
import { ProgressBarContent } from '@src/utils/DynamicContent/generators/ProgressBarContent';

describe( 'ProgressBarContent', function () {
	const progressBarContent = new ProgressBarContent(
		9_000_000,
		33.3333,
		3_000_000,
		6_000_000,
		new Translator( {} ),
		new CurrencyEn(),
		false
	);

	it( 'should return percentage towards target', function () {
		expect( progressBarContent.percentageTowardsTarget ).toBe( 33.3333 );
	} );

	it( 'should return donation target sentence', function () {
		expect( progressBarContent.donationTarget ).toBe( 'amount-total €9.0M' );
	} );

	it( 'should return donation target amount', function () {
		expect( progressBarContent.donationTargetAmount ).toBe( '€9.0M' );
	} );

	it( 'should return formatted amount donated', function () {
		expect( progressBarContent.amountDonated ).toBe( '€3.0M' );
	} );

	it( 'should return amount needed sentence', function () {
		expect( progressBarContent.amountNeeded ).toBe( 'amount-missing' );
	} );
} );
