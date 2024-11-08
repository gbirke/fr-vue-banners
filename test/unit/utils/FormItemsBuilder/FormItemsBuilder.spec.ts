import { describe, expect, it } from 'vitest';
import { Translator } from '@src/Translator';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import FormItemsBuilder from '@src/utils/FormItemsBuilder/FormItemsBuilder';

const formatter = ( amount: number ): string => 'formatted-' + amount.toString();
const messages = {
	'interval-once': 'Bucky',
	'payment-paypal': 'O',
	'address-type-option-email': 'Hare',
	'address-type-notice-email': 'buckyohare@realemail.com'
};

describe( 'CampaignProjection', () => {
	it( 'translates the field labels and notices', () => {
		const items = new FormItemsBuilder( new Translator( messages ), formatter )
			.setPaymentMethods( PaymentMethods.PAYPAL )
			.setIntervals( Intervals.ONCE )
			.setAddressTypes( AddressTypes.EMAIL )
			.getItems();

		expect( items.intervals[ 0 ].label ).toBe( 'Bucky' );
		expect( items.paymentMethods[ 0 ].label ).toBe( 'O' );
		expect( items.addressType[ 0 ].label ).toBe( 'Hare' );
		expect( items.addressType[ 0 ].notice ).toBe( 'buckyohare@realemail.com' );
	} );

	it( 'formats the amounts', () => {
		const items = new FormItemsBuilder( new Translator( messages ), formatter )
			.setAmounts( 1, 2 )
			.getItems();

		expect( items.amounts[ 0 ].label ).toBe( 'formatted-1' );
		expect( items.amounts[ 1 ].label ).toBe( 'formatted-2' );
	} );
} );
