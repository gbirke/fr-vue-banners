import { createVueApp } from '@src/createVueApp';

import './styles/styles.scss';

import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import { createFormActions } from '@src/createFormActions';
import { Locales } from '@src/domain/Locales';
import DynamicTextPlugin from '@src/DynamicTextPlugin';
import { WindowMediaWiki } from '@src/page/MediaWiki/WindowMediaWiki';
import PageWPORG from '@src/page/PageWPORG';
import { SkinFactory } from '@src/page/skin/SkinFactory';
import { LegacyTrackerWPORG } from '@src/tracking/LegacyTrackerWPORG';
import TranslationPlugin from '@src/TranslationPlugin';
import { Translator } from '@src/Translator';
import { LocaleFactoryEn } from '@src/utils/LocaleFactory/LocaleFactoryEn';
import { LocalImpressionCount } from '@src/utils/LocalImpressionCount';
import { WindowPageScroller } from '@src/utils/PageScroller/WindowPageScroller';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import { UrlRuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
import { WindowSizeIssueChecker } from '@src/utils/SizeIssueChecker/WindowSizeIssueChecker';
import { WindowTimer } from '@src/utils/Timer';
import Banner from './components/BannerVar.vue';
import eventMappings from './event_map';
import { createFormItems } from './form_items';
import messages from './messages';

const localeFactory = new LocaleFactoryEn();
const translator = new Translator( messages );
const mediaWiki = new WindowMediaWiki();
const page = new PageWPORG( mediaWiki, ( new SkinFactory( mediaWiki ) ).getSkin(), new WindowSizeIssueChecker() );
const runtimeEnvironment = new UrlRuntimeEnvironment( window.location );
const tracker = new LegacyTrackerWPORG( mediaWiki, page.getTracking().keyword, eventMappings, runtimeEnvironment );
const impressionCount = new LocalImpressionCount( page.getTracking().keyword, runtimeEnvironment );
const currencyFormatter = localeFactory.getCurrencyFormatter();

const app = createVueApp( BannerConductor, {
	page,
	bannerConfig: {
		delay: runtimeEnvironment.getBannerDelay( 7500 ),
		transitionDuration: 1000
	},
	bannerProps: {
		useOfFundsContent: localeFactory.getUseOfFundsLoader().getContent(),
		pageScroller: new WindowPageScroller(),
		remainingImpressions: impressionCount.getRemainingImpressions( page.getMaxBannerImpressions( 'mobile_english' ) )
	},
	resizeHandler: new WindowResizeHandler(),
	banner: Banner,
	impressionCount
} );

app.use( TranslationPlugin, translator );
app.use( DynamicTextPlugin, {
	campaignParameters: page.getCampaignParameters(),
	date: new Date(),
	formatters: localeFactory.getFormatters(),
	impressionCount,
	translator
} );

app.provide( 'currencyFormatter', currencyFormatter );
app.provide( 'formItems', createFormItems( translator, currencyFormatter.euroAmount.bind( currencyFormatter ) ) );
app.provide( 'formActions', createFormActions( page.getTracking(), impressionCount, { locale: Locales.EN } ) );
app.provide( 'tracker', tracker );
app.provide( 'timer', new WindowTimer() );

app.mount( page.getBannerContainer() );
