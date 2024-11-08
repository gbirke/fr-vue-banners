import AlreadyDonatedModal from '@src/components/AlreadyDonatedModal/translations/AlreadyDonatedModal.de';
import AddressFormDe from '@src/components/DonationForm/Forms/messages/AddressForm.de';
import MainDonationForm from '@src/components/DonationForm/Forms/messages/MainDonationForm.de';
import UpgradeToYearly from '@src/components/DonationForm/Forms/messages/UpgradeToYearly.de';
import Footer from '@src/components/Footer/messages/Footer.de';
import SoftClose from '@src/components/SoftClose/messages/SoftClose.de';
import { TranslationMessages } from '@src/Translator';
import DynamicCampaignText from '@src/utils/DynamicContent/messages/DynamicCampaignText.de';

const messages: TranslationMessages = {
	...DynamicCampaignText,
	...UpgradeToYearly,
	...SoftClose,
	...Footer,
	...MainDonationForm,
	...AddressFormDe,
	...AlreadyDonatedModal
};

export default messages;
