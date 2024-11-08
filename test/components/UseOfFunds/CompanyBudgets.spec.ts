import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CompanyBudgets from '@src/components/UseOfFunds/CompanyBudgets.vue';
import { Company } from '@src/domain/UseOfFunds/Company';

const companies: Company[] = [
	{
		budget: 40,
		budgetCitation: '',
		budgetString: '',
		name: ''
	},
	{
		budget: 80,
		budgetCitation: '',
		budgetString: '',
		name: ''
	},
	{
		budget: 10,
		budgetCitation: '',
		budgetString: '',
		name: ''
	}
];

describe( 'CompanyBudgets.vue', () => {
	it( 'compares company budgets against the highest one', () => {
		const wrapper = shallowMount( CompanyBudgets, {
			props: {
				companies,
				citationLabel: ''
			}
		} );

		const budgets = wrapper.findAll<HTMLElement>( '.company-budgets-budget-line' );

		expect( budgets[ 0 ].attributes( 'style' ) ).toBe( 'width: 50%;' );
		expect( budgets[ 1 ].attributes( 'style' ) ).toBe( 'width: 100%;' );
		expect( budgets[ 2 ].attributes( 'style' ) ).toBe( 'width: 12.5%;' );
	} );
} );
