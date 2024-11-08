import { describe, expect, it } from 'vitest';
import { createDonationURL } from '@src/createDonationURL';
import { ImpressionCountStub } from '@test/fixtures/ImpressionCountStub';

describe( 'createDonationURL', () => {
	it( 'should create donation URL with tracking information', () => {
		const extraParameters = { locale: 'de_DE', ast: '1' };
		const ctrlLink = createDonationURL( { campaign: 'C1', keyword: 'banner-ctrl' }, new ImpressionCountStub(), extraParameters );
		const varLink = createDonationURL( { campaign: 'C1', keyword: 'banner-var' }, new ImpressionCountStub(), extraParameters );

		expect( ctrlLink ).toStrictEqual( 'https://spenden.wikimedia.de?piwik_kwd=banner-ctrl&piwik_campaign=C1&impCount=1&bImpCount=1&locale=de_DE&ast=1' );
		expect( varLink ).toStrictEqual( 'https://spenden.wikimedia.de?piwik_kwd=banner-var&piwik_campaign=C1&impCount=1&bImpCount=1&locale=de_DE&ast=1' );
	} );
} );
