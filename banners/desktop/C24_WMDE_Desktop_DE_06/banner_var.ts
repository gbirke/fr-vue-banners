import { createVueApp } from '@src/createVueApp';

import './styles/styles_var.scss';

import BannerConductor from '@src/components/BannerConductor/FallbackBannerConductor.vue';
import { createFallbackDonationURL } from '@src/createFallbackDonationURL';
import { createFAQPageURL } from '@src/createFAQPageURL';
import { createFormActions } from '@src/createFormActions';
import DynamicTextPlugin from '@src/DynamicTextPlugin';
import { WindowMediaWiki } from '@src/page/MediaWiki/WindowMediaWiki';
import PageWPORG from '@src/page/PageWPORG';
import { SkinFactory } from '@src/page/skin/SkinFactory';
import { LegacyTrackerWPORG } from '@src/tracking/LegacyTrackerWPORG';
import TranslationPlugin from '@src/TranslationPlugin';
import { Translator } from '@src/Translator';
import { LocaleFactoryDe } from '@src/utils/LocaleFactory/LocaleFactoryDe';
import { LocalImpressionCount } from '@src/utils/LocalImpressionCount';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import { UrlRuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
import { WindowSizeIssueChecker } from '@src/utils/SizeIssueChecker/WindowSizeIssueChecker';
import { WindowTimer } from '@src/utils/Timer';
import Banner from './components/BannerVar.vue';
import FallbackBanner from './components/FallbackBanner.vue';
import eventMappings from './event_map';
import { createFormItems } from './form_items';
import messages from './messages';

const date = new Date();
const localeFactory = new LocaleFactoryDe();
const translator = new Translator( messages );
const mediaWiki = new WindowMediaWiki();
const page = new PageWPORG( mediaWiki, ( new SkinFactory( mediaWiki ) ).getSkin(), new WindowSizeIssueChecker( 400 ) );
const runtimeEnvironment = new UrlRuntimeEnvironment( window.location );
const impressionCount = new LocalImpressionCount( page.getTracking().keyword, runtimeEnvironment );
const tracker = new LegacyTrackerWPORG( mediaWiki, page.getTracking().keyword, eventMappings, runtimeEnvironment );

const app = createVueApp( BannerConductor, {
	page,
	bannerConfig: {
		delay: runtimeEnvironment.getBannerDelay( 7500 ),
		transitionDuration: 1000
	},
	bannerProps: {
		useOfFundsContent: localeFactory.getUseOfFundsLoader().getContent(),
		remainingImpressions: impressionCount.getRemainingImpressions( page.getMaxBannerImpressions( 'desktop' ) ),
		donationLink: createFallbackDonationURL( page.getTracking(), impressionCount ),
		faqPageLink: createFAQPageURL( page.getTracking() )
	},
	resizeHandler: new WindowResizeHandler(),
	banner: Banner,
	fallbackBanner: FallbackBanner,
	minWidthForMainBanner: 800,
	impressionCount
} );

app.use( TranslationPlugin, translator );
app.use( DynamicTextPlugin, {
	campaignParameters: page.getCampaignParameters(),
	date,
	formatters: localeFactory.getFormatters(),
	impressionCount,
	translator,
	urgencyMessageDaysLeft: 45
} );

const currencyFormatter = localeFactory.getCurrencyFormatter();

app.provide( 'currencyFormatter', currencyFormatter );
app.provide( 'formItems', createFormItems( translator, currencyFormatter.euroAmount.bind( currencyFormatter ) ) );
app.provide( 'formActions', createFormActions( page.getTracking(), impressionCount, { afo: '1', ap: '0' } ) );
app.provide( 'tracker', tracker );
app.provide( 'timer', new WindowTimer() );

app.mount( page.getBannerContainer() );
