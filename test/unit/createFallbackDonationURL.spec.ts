import { describe, expect, it } from 'vitest';
import { createFallbackDonationURL } from '@src/createFallbackDonationURL';
import { ImpressionCountStub } from '@test/fixtures/ImpressionCountStub';

describe( 'createFallbackDonationURL', () => {
	it( 'should create donation URL with tracking information', () => {
		const extraParameters = { locale: 'de_DE', ast: '1' };
		const ctrlLink = createFallbackDonationURL( { campaign: 'C1', keyword: 'banner-ctrl' }, new ImpressionCountStub(), extraParameters );
		const varLink = createFallbackDonationURL( { campaign: 'C1', keyword: 'banner-var' }, new ImpressionCountStub(), extraParameters );
		const expected = 'https://spenden.wikimedia.de?piwik_kwd=banner-mini&piwik_campaign=C1&impCount=1&bImpCount=1&locale=de_DE&ast=1';

		expect( ctrlLink ).toStrictEqual( expected );
		expect( varLink ).toStrictEqual( expected );
	} );

	it( 'leave the original tracking information intact', () => {
		const extraParameters = { locale: 'de_DE', ast: '1' };
		const tracking = { campaign: 'C1', keyword: 'banner-ctrl' };
		createFallbackDonationURL( tracking, new ImpressionCountStub(), extraParameters );

		expect( tracking.keyword ).toStrictEqual( 'banner-ctrl' );
	} );
} );
