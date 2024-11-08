import { ComputedRef, Ref } from 'vue';
import { AmountValidity } from '@src/utils/FormModel/AmountValidity';
import { Validity } from '@src/utils/FormModel/Validity';

export interface FormModel {
	interval: Ref<string>;
	intervalValidity: Ref<Validity>;
	disabledIntervals: ComputedRef<string[]>;

	/**
	 * Amount string in Euros, integer value, provided by radio buttons or other non-user-editable means
	 */
	selectedAmount: Ref<string>;

	/**
	 * Custom amount in Euros and Cents, formatted any way the user wants (German or English)
	 */
	customAmount: Ref<string>;

	/**
	 * Parsed amount from either selected amount or custom amount, as a floating point number representing Euros and cents.
	 * Our watchers make sure that only one of them is set.
	 * German-formatted amounts will be converted,
	 * non-numeric chars will be filtered for maximum resilience (@see parseFloatFromFormattedString)
	 */
	numericAmount: ComputedRef<number>;
	amountValidity: Ref<AmountValidity>;
	paymentMethod: Ref<string>;
	paymentMethodValidity: Ref<Validity>;
	disabledPaymentMethods: ComputedRef<string[]>;
	addressType: Ref<string>;
	addressTypeValidity: Ref<Validity>;
	disabledAddressTypes: Ref<string[]>;
	/**
	 * Flag to indicate that a payment-provider-specific transaction fee should be added to the total amount
	 */
	hasTransactionFee: Ref<boolean>;

	/**
	 * Computed transaction fee for the selected payment method and amount. Only non-zero if hasTransactionFee is true.
	 */
	transactionFee: ComputedRef<number>;

	/**
	 * Computed total amount plus transaction fee, if hasTransactionFee is true.
	 */
	totalNumericAmount: ComputedRef<number>;
}
