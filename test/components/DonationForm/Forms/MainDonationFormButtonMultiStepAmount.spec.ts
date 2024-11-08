import { shallowMount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { useFormModel } from '@src/components/composables/useFormModel';
import MainDonationFormButtonMultiStepAmount
	from '@src/components/DonationForm/Forms/MainDonationFormButtonMultiStepAmount.vue';
import { Intervals } from '@src/utils/FormItemsBuilder/fields/Intervals';
import { PaymentMethods } from '@src/utils/FormItemsBuilder/fields/PaymentMethods';

const translate = ( key: string ): string => key;

describe( 'MainDonationFormButtonMultiStepAmount', () => {

	test.each( [
		[ Intervals.ONCE.value, 'submit-label-short' ],
		[ Intervals.MONTHLY.value, 'submit-label' ],
		[ Intervals.BIANNUAL.value, 'submit-label' ],
		[ Intervals.YEARLY.value, 'submit-label' ],
		[ Intervals.QUARTERLY.value, 'submit-label' ]
	] )( 'shows the correct label for interval %i', ( interval: string, label: string ) => {
		const formModel = useFormModel();
		formModel.interval.value = interval;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		formModel.customAmount.value = '10';

		const wrapper = shallowMount( MainDonationFormButtonMultiStepAmount, {
			props: {
				maxAmount: 100
			},
			global: {
				provide: {
					translator: { translate }
				}
			}
		} );

		expect( wrapper.text() ).toStrictEqual( label );
	} );

	test.each( [
		[ PaymentMethods.PAYPAL.value, 'submit-label-short' ],
		[ PaymentMethods.BANK_TRANSFER.value, 'submit-label-short' ],
		[ PaymentMethods.CREDIT_CARD.value, 'submit-label-short' ],
		[ PaymentMethods.SOFORT.value, 'submit-label' ],
		[ PaymentMethods.DIRECT_DEBIT.value, 'submit-label-short' ]
	] )( 'shows the correct label for payment method %s', ( paymentMethod: string, label: string ) => {
		const formModel = useFormModel();
		formModel.interval.value = Intervals.ONCE.value;
		formModel.paymentMethod.value = paymentMethod;
		formModel.customAmount.value = '10';

		const wrapper = shallowMount( MainDonationFormButtonMultiStepAmount, {
			props: {
				maxAmount: 100
			},
			global: {
				provide: {
					translator: { translate }
				}
			}
		} );

		expect( wrapper.text() ).toStrictEqual( label );
	} );

	test.each( [
		[ '10', 'submit-label-short' ],
		[ '99', 'submit-label-short' ],
		[ '100', 'submit-label' ],
		[ '110', 'submit-label' ]
	] )( 'shows the correct label for amount %s', ( amount: string, label: string ) => {
		const formModel = useFormModel();
		formModel.interval.value = Intervals.ONCE.value;
		formModel.paymentMethod.value = PaymentMethods.PAYPAL.value;
		formModel.customAmount.value = amount;

		const wrapper = shallowMount( MainDonationFormButtonMultiStepAmount, {
			props: {
				maxAmount: 100
			},
			global: {
				provide: {
					translator: { translate }
				}
			}
		} );

		expect( wrapper.text() ).toStrictEqual( label );
	} );

} );
