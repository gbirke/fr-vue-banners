import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FundsDistributionAccordion from '@src/components/UseOfFunds/FundsDistributionAccordion.vue';
import { ApplicationOfFundsItem } from '@src/domain/UseOfFunds/ApplicationOfFundsItem';

const applicationOfFundsData: ApplicationOfFundsItem[] = [
	{ percentage: 10, colour: 'red', text: 'text 01', title: 'title 01' },
	{ percentage: 98, colour: 'blue', text: 'text 02', title: 'title 02' },
	{ percentage: 43, colour: 'green', text: 'text 03', title: 'title 03' },
	{ percentage: 12, colour: 'orange', text: 'text 04', title: 'title 04' }
];

describe( 'FundsDistributionAccordion.vue', () => {
	it( 'toggles the accordion items when the titles are clicked', async () => {
		const wrapper = shallowMount( FundsDistributionAccordion, {
			props: {
				applicationOfFundsData
			}
		} );

		const item01 = wrapper.find( '.funds-distribution-accordion-item:nth-child(1)' );
		const item02 = wrapper.find( '.funds-distribution-accordion-item:nth-child(2)' );
		const item03 = wrapper.find( '.funds-distribution-accordion-item:nth-child(3)' );
		const item04 = wrapper.find( '.funds-distribution-accordion-item:nth-child(4)' );

		await item01.find( 'button' ).trigger( 'click' );
		await item01.find( 'button' ).trigger( 'click' );
		await item02.find( 'button' ).trigger( 'click' );
		await item04.find( 'button' ).trigger( 'click' );

		expect( item01.classes() ).not.toContain( 'active' );
		expect( item02.classes() ).toContain( 'active' );
		expect( item03.classes() ).not.toContain( 'active' );
		expect( item04.classes() ).toContain( 'active' );
	} );
} );
