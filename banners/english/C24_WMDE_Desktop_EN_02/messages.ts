import AlreadyDonatedModalEn from '@src/components/AlreadyDonatedModal/translations/AlreadyDonatedModal.en';
import AddressFormEn from '@src/components/DonationForm/Forms/messages/AddressForm.en';
import CustomAmountFormEn from '@src/components/DonationForm/Forms/messages/CustomAmountForm.en';
import MainDonationFormEn from '@src/components/DonationForm/Forms/messages/MainDonationForm.en';
import UpgradeToYearlyEn from '@src/components/DonationForm/Forms/messages/UpgradeToYearly.en';
import FallbackBanner from '@src/components/FallbackBanner/messages/FallbackBanner.en';
import FooterEn from '@src/components/Footer/messages/Footer.en';
import SoftCloseEn from '@src/components/SoftClose/messages/SoftClose.en';
import { TranslationMessages } from '@src/Translator';
import DynamicCampaignTextEn from '@src/utils/DynamicContent/messages/DynamicCampaignText.en';

const messages: TranslationMessages = {
	...CustomAmountFormEn,
	...DynamicCampaignTextEn,
	...UpgradeToYearlyEn,
	...SoftCloseEn,
	...AddressFormEn,
	...FooterEn,
	...MainDonationFormEn,
	...AlreadyDonatedModalEn,
	...FallbackBanner
};

export default messages;
