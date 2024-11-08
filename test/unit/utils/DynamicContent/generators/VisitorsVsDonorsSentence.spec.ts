import { describe, expect, it } from 'vitest';
import { TranslationMessages, Translator } from '@src/Translator';
import { IntegerEn } from '@src/utils/DynamicContent/formatters/IntegerEn';
import { VisitorsVsDonorsSentence } from '@src/utils/DynamicContent/generators/VisitorsVsDonorsSentence';

describe( 'VisitorsVsDonorsSentence', function () {
	it( 'returns the correct sentence when there is impressions', function () {
		const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence( new Translator( {} ), 10, 42, new IntegerEn() );

		expect( visitorsVsDonorsSentence.getText() ).toEqual( 'visitors-vs-donors-sentence' );
	} );

	it( 'returns the correct sentence when there are no impressions', function () {
		const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence( new Translator( {} ), 0, 42, new IntegerEn() );

		expect( visitorsVsDonorsSentence.getText() ).toEqual( 'visitors-vs-donors-sentence-no-impressions' );
	} );

	it( 'returns the correct sentence when there are no projected donors (e.g. outside of campaign)', function () {
		const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence( new Translator( {} ), 10, 0, new IntegerEn() );

		expect( visitorsVsDonorsSentence.getText() ).toEqual( 'visitors-vs-donors-sentence-no-impressions' );
	} );

	it( 'inserts the variables into the sentence', function () {
		const messages: TranslationMessages = { 'visitors-vs-donors-sentence': '{{millionImpressionsPerDay}}-{{totalNumberOfDonors}}' };
		const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence( new Translator( messages ), 10, 42, new IntegerEn() );

		expect( visitorsVsDonorsSentence.getText() ).toEqual( '10-42' );
	} );

	it( 'formats the projected donors', function () {
		const messages: TranslationMessages = { 'visitors-vs-donors-sentence': '{{millionImpressionsPerDay}}-{{totalNumberOfDonors}}' };
		const visitorsVsDonorsSentence = new VisitorsVsDonorsSentence( new Translator( messages ), 10, 42.309458309, new IntegerEn() );

		expect( visitorsVsDonorsSentence.getText() ).toEqual( '10-42' );
	} );
} );
