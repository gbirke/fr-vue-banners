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
	...AlreadyDonatedModal,
	'soft-close-button-already-donated': 'Habe schon gespendet',
	'upgrade-to-yearly-copy': '<p>Jedes Jahr sind wir auf die Unterstützung von Menschen wie Ihnen angewiesen. ' +
		'Jährliche Spenden helfen uns nachhaltig und ermöglichen langfristige Weiterentwicklungen.</p>' +
		'<p>Sie gehen kein Risiko ein: Jederzeit formlos zu sofort kündbar.</p>'
};

export default messages;
