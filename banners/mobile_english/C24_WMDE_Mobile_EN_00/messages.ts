import CustomAmountForm from '@src/components/DonationForm/Forms/messages/CustomAmountForm.en';
import MainDonationForm from '@src/components/DonationForm/Forms/messages/MainDonationForm.en';
import Footer from '@src/components/Footer/messages/Footer.en';
import SoftClose from '@src/components/SoftClose/messages/SoftClose.en';
import { TranslationMessages } from '@src/Translator';
import DynamicCampaignText from '@src/utils/DynamicContent/messages/DynamicCampaignText.en';

const messages: TranslationMessages = {
	...CustomAmountForm,
	...DynamicCampaignText,
	...SoftClose,
	...Footer,
	...MainDonationForm
};

export default messages;
