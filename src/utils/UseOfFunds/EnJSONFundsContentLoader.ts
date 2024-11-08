import * as useOfFundsContent from 'fundraising-frontend-content/i18n/en_GB/data/use_of_funds_content.json';
import { UseOfFundsContent } from '@src/domain/UseOfFunds/UseOfFundsContent';
import { FundsContentLoader } from '@src/utils/UseOfFunds/FundsContentLoader';

export class EnJSONFundsContentLoader implements FundsContentLoader {

	public getContent(): UseOfFundsContent {
		return useOfFundsContent as UseOfFundsContent;
	}
}
