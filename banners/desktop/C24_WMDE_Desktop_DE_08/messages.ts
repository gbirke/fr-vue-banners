import AlreadyDonatedModal from '@src/components/AlreadyDonatedModal/translations/AlreadyDonatedModal.de';
import AddressFormDe from '@src/components/DonationForm/Forms/messages/AddressForm.de';
import CustomAmountFormDe from '@src/components/DonationForm/Forms/messages/CustomAmountForm.de';
import MainDonationFormDe from '@src/components/DonationForm/Forms/messages/MainDonationForm.de';
import UpgradeToYearlyDe from '@src/components/DonationForm/Forms/messages/UpgradeToYearly.de';
import FallbackBanner from '@src/components/FallbackBanner/messages/FallbackBanner.de';
import FooterDe from '@src/components/Footer/messages/Footer.de';
import { TranslationMessages } from '@src/Translator';
import DynamicCampaignTextDe from '@src/utils/DynamicContent/messages/DynamicCampaignText.de';

const messages: TranslationMessages = {
	...CustomAmountFormDe,
	...DynamicCampaignTextDe,
	...UpgradeToYearlyDe,
	...AddressFormDe,
	...FooterDe,
	...MainDonationFormDe,
	...AlreadyDonatedModal,
	...FallbackBanner,
	'already-donated-go-away-button': 'Im Moment nicht',
	'soft-close-prompt': 'Dürfen wir später nochmal fragen?',
	'upgrade-to-yearly-copy': `<p>Jedes Jahr sind wir auf Menschen wie Sie angewiesen. Jährliche Spenden helfen uns besonders und ermöglichen langfristige Weiterentwicklungen.</p>
		<p>Sie gehen kein Risiko ein: Jederzeit formlos zu sofort kündbar.</p>`,
	'upgrade-to-yearly-no': 'Nein, ich spende einmalig {{amount}}',
	'upgrade-to-yearly-yes': 'Ja, ich spende {{amount}} jährlich',
	'campaign-day-only-n-days': 'Heute sind es nur noch {{days}} Tage bis zum Ende unserer Spendenkampagne.',
	'double-progress-close': 'Das wird knapp.',
	'missing-amount': 'Uns fehlen noch'
};

export default messages;
