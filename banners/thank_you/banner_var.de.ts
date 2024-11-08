import { createVueApp } from '@src/createVueApp';

import './styles/styles.scss';

import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import { Locales } from '@src/domain/Locales';
import { WindowMediaWiki } from '@src/page/MediaWiki/WindowMediaWiki';
import PageWPORG from '@src/page/PageWPORG';
import { SkinFactory } from '@src/page/skin/SkinFactory';
import { LegacyTrackerWPORG } from '@src/tracking/LegacyTrackerWPORG';
import TranslationPlugin from '@src/TranslationPlugin';
import { Translator } from '@src/Translator';
import { IntegerDe } from '@src/utils/DynamicContent/formatters/IntegerDe';
import { LocalImpressionCount } from '@src/utils/LocalImpressionCount';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import { UrlRuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
import { WindowSizeIssueChecker } from '@src/utils/SizeIssueChecker/WindowSizeIssueChecker';
import { WindowTimer } from '@src/utils/Timer';
import Banner from './components/BannerVar.de.vue';
import { createTrackedURL, SUBSCRIBE_URL, USE_OF_FUNDS_URL } from './createTrackedURL';
import eventMappings from './event_map';
import { TrackingMembershipFormActions } from './MembershipFormActions';
import messages from './messages.de';
import { createThankYouSettings } from './settings';

const translator = new Translator( messages );
const mediaWiki = new WindowMediaWiki();
const page = new PageWPORG( mediaWiki, ( new SkinFactory( mediaWiki ) ).getSkin(), new WindowSizeIssueChecker( 0 ) );
const runtimeEnvironment = new UrlRuntimeEnvironment( window.location );
const impressionCount = new LocalImpressionCount( page.getTracking().keyword, runtimeEnvironment );
const tracker = new LegacyTrackerWPORG( mediaWiki, page.getTracking().keyword, eventMappings, runtimeEnvironment );

const app = createVueApp( BannerConductor, {
	page,
	bannerConfig: {
		delay: 0,
		transitionDuration: 0
	},
	bannerProps: {
		settings: createThankYouSettings( new IntegerDe(), page.getCampaignParameters().thankYouCampaign ),
		subscribeURL: createTrackedURL( SUBSCRIBE_URL, page.getTracking(), impressionCount, Locales.DE ),
		useOfFundsURL: createTrackedURL( USE_OF_FUNDS_URL, page.getTracking(), impressionCount, Locales.DE )
	},
	resizeHandler: new WindowResizeHandler(),
	banner: Banner,
	impressionCount
} );

app.use( TranslationPlugin, translator );
app.provide( 'tracker', tracker );
app.provide( 'formActions', new TrackingMembershipFormActions( page.getTracking(), impressionCount, Locales.DE ) );
app.provide( 'timer', new WindowTimer() );

app.mount( page.getBannerContainer() );
