import { describe, expect, test } from 'vitest';
import { useFormAction } from '@src/components/composables/useAmountBasedFormAction';
import { useFormModel } from '@src/components/composables/useFormModel';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

const anonymousAction: string = 'Anonymously';
const withAddressAction: string = 'WithAddress';

describe( 'useFormAction', () => {

	test.each( [
		[ '', PaymentMethods.PAYPAL.value, withAddressAction ],
		[ AddressTypes.FULL.value, PaymentMethods.PAYPAL.value, withAddressAction ],
		[ AddressTypes.EMAIL.value, PaymentMethods.PAYPAL.value, withAddressAction ],
		[ AddressTypes.ANONYMOUS.value, PaymentMethods.PAYPAL.value, anonymousAction ],
		[ AddressTypes.ANONYMOUS.value, PaymentMethods.DIRECT_DEBIT.value, withAddressAction ]
	] )( 'returns the correct action with address type', ( addressType: string, paymentMethod: string, expectedAction: string ) => {
		const formModel = useFormModel();
		formModel.addressType.value = addressType;
		formModel.paymentMethod.value = paymentMethod;

		const { formAction } = useFormAction( {
			donateAnonymouslyAction: anonymousAction,
			donateWithAddressAction: withAddressAction
		}, 1000, { smallAmount: 'ap=0', largeAmount: 'ap=1' } );

		expect( formAction.value ).toBe( expectedAction + '&ap=0' );
	} );

	test.each( [
		[ '0', '&ap=0' ],
		[ '999', '&ap=0' ],
		[ '1000', '&ap=0' ],
		[ '1001', '&ap=1' ],
		[ '1002', '&ap=1' ],
		[ '9999999', '&ap=1' ]
	] )( 'should append the small URL parameter for small amount', ( amount: string, urlParameter: string ) => {
		const formModel = useFormModel();
		formModel.customAmount.value = amount;
		formModel.addressType.value = AddressTypes.FULL.value;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		const { formAction } = useFormAction( {
			donateAnonymouslyAction: anonymousAction,
			donateWithAddressAction: withAddressAction
		}, 1000, { smallAmount: 'ap=0', largeAmount: 'ap=1' } );

		expect( formAction.value ).toBe( 'WithAddress' + urlParameter );

	} );
} );