import { shallowMount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import MainDonationFormPaymentMethodLabeledButton
	from '@src/components/DonationForm/Forms/MainDonationFormPaymentMethodLabeledButton.vue';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

const translate = ( key: string ): string => key;

describe( 'MainDonationFormPaymentMethodLabeledButton', () => {

	test.each( [
		[ PaymentMethods.PAYPAL.value, 'submit-label-paypal' ],
		[ PaymentMethods.BANK_TRANSFER.value, 'submit-label-bank-transfer' ],
		[ PaymentMethods.CREDIT_CARD.value, 'submit-label-credit-card' ],
		[ PaymentMethods.SOFORT.value, 'submit-label-sofort' ],
		[ PaymentMethods.DIRECT_DEBIT.value, 'submit-label' ]
	] )( 'shows the correct label for payment method %s', ( paymentMethod: string, label: string ) => {
		const formModel = useFormModel();
		formModel.paymentMethod.value = paymentMethod;
		formModel.customAmount.value = '10';

		const wrapper = shallowMount( MainDonationFormPaymentMethodLabeledButton, {
			global: {
				provide: {
					translator: { translate }
				}
			}
		} );

		expect( wrapper.text() ).toStrictEqual( label );
	} );

} );
