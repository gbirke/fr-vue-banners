import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FundsContent from '@src/components/UseOfFunds/FundsContent.vue';
import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';

describe( 'FundsContent.vue', () => {
	const getContent = (): UseOfFundsContent => {
		return {
			applicationOfFundsData: [],
			benefitsList: { benefits: [], headline: '' },
			callToAction: '',
			comparison: { citationLabel: '', companies: [], headline: '', paragraphs: [], subhead: '' },
			detailedReports: {
				germany: { intro: '', linkName: '', linkUrl: '' },
				international: { intro: '', linkName: '', linkUrl: '' },
				mixed: { text: '' }
			},
			intro: { dynamicHeadline: { published: 'Published headline?', provisional: 'Provisional headline?*' }, text: '' },
			orgchart: {
				headline: '',
				imageUrl: '',
				paragraphs: [ 'This is some text where I want you to<wmde> replace me </wmde>with text wrapped in a span' ]
			},
			provisional: ''
		};
	};

	it( 'shows the provisional addendum when one is set', async () => {
		const wrapper = shallowMount( FundsContent, {
			props: {
				content: getContent()
			}
		} );

		expect( wrapper.find( '.use-of-funds-section-intro h2' ).text() ).toBe( 'Published headline?' );
		expect( wrapper.find( '.use-of-funds-provisional' ).exists() ).toBe( false );

		const content = getContent();
		content.provisional = 'This is provisional';
		await wrapper.setProps( { content: content } );
		const provisional = wrapper.find( '.use-of-funds-provisional' );

		expect( wrapper.find( '.use-of-funds-section-intro h2' ).text() ).toBe( 'Provisional headline?*' );
		expect( provisional.exists() ).toBe( true );
		expect( provisional.text() ).toBe( 'This is provisional' );
	} );

	it( 'highlights organisation in the orgchart text', async () => {
		const wrapper = shallowMount( FundsContent, {
			props: {
				content: getContent()
			}
		} );

		expect( wrapper.find( '.use-of-funds-orgchart-text > div p:first-child' ).html() )
			.toContain( '<span class="use-of-funds-org-wmde"> replace me </span>' );
	} );

	it( 'emits event when call to action is clicked', async () => {
		const wrapper = shallowMount( FundsContent, {
			props: {
				content: getContent()
			}
		} );

		await wrapper.find( '.use-of-funds-button' ).trigger( 'click' );

		expect( wrapper.emitted( 'hideFundsModal' ).length ).toBe( 1 );
	} );
} );
