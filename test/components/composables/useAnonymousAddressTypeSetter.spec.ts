import { beforeEach, describe, expect, test } from 'vitest';
import { nextTick } from 'vue';
import { useAnonymousAddressTypeSetter } from '@src/components/composables/useAnonymousAddressTypeSetter';
import { useFormModel } from '@src/components/composables/useFormModel';
import { AddressTypes } from '@src/utils/FormItemsBuilder/fields/AddressTypes';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';
import { resetFormModel } from '@test/resetFormModel';

const formModel = useFormModel();
describe( 'useAnonymousAddressTypeSetter', () => {
	beforeEach( () => {
		resetFormModel( formModel );
	} );

	test.each( [
		[ PaymentMethods.PAYPAL.value, AddressTypes.ANONYMOUS.value ],
		[ PaymentMethods.SOFORT.value, AddressTypes.ANONYMOUS.value ],
		[ PaymentMethods.BANK_TRANSFER.value, AddressTypes.ANONYMOUS.value ],
		[ PaymentMethods.CREDIT_CARD.value, AddressTypes.ANONYMOUS.value ],
		[ PaymentMethods.DIRECT_DEBIT.value, '' ]
	] )( 'sets the correct address type', async ( paymentMethod: string, addressType: string ): Promise<void> => {
		useAnonymousAddressTypeSetter();

		formModel.paymentMethod.value = paymentMethod;
		await nextTick();

		expect( formModel.addressType.value ).toStrictEqual( addressType );
	} );
} );
