import { shallowMount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MembershipButton from '@banners/thank_you/components/MembershipButton.vue';
import { MembershipFormActions } from '@banners/thank_you/MembershipFormActions';

const formActions: MembershipFormActions = {
	create: ( extraUrlParameters: Record<string, string> ) => `URL ${ extraUrlParameters.nananana }`
};

describe( 'MembershipButton.vue', () => {
	it( 'emits submit event', () => {
		const wrapper = shallowMount( MembershipButton, {
			props: {
				label: 'SAME BAT TIME',
				extraUrlParameters: { nananana: 'batman' }
			},
			global: {
				provide: { formActions }
			}
		} );

		wrapper.trigger( 'click' );

		expect( wrapper.emitted( 'submit' ).length ).toStrictEqual( 1 );
		expect( wrapper.emitted( 'submit' )[ 0 ][ 0 ] ).toStrictEqual( 'URL batman' );
	} );
} );
