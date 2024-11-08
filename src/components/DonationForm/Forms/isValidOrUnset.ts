import { AmountValidity } from '@src/utils/FormModel/AmountValidity';
import { Validity } from '@src/utils/FormModel/Validity';

export function isValidOrUnset( validity: Validity|AmountValidity ): boolean {
	return validity === Validity.Valid ||
		validity === Validity.Unset ||
		validity === AmountValidity.Valid ||
		validity === AmountValidity.Unset;
}
