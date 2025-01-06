import { createVueApp } from '@src/createVueApp';

import './styles/styles_var.scss';

import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import Banner from './components/BannerVar.vue';
import { UrlRuntimeEnvironment } from '@src/utils/RuntimeEnvironment';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import PageWPORG from '@src/page/PageWPORG';
import { WindowMediaWiki } from '@src/page/MediaWiki/WindowMediaWiki';
import { SkinFactory } from '@src/page/skin/SkinFactory';
import { WindowSizeIssueChecker } from '@src/utils/SizeIssueChecker/WindowSizeIssueChecker';
import TranslationPlugin from '@src/TranslationPlugin';
import { LegacyTrackerWPORG } from '@src/tracking/LegacyTrackerWPORG';
import eventMappings from './event_map';
import { Translator } from '@src/Translator';
import DynamicTextPlugin from '@src/DynamicTextPlugin';
import { LocalImpressionCount } from '@src/utils/LocalImpressionCount';
import { WindowPageScroller } from '@src/utils/PageScroller/WindowPageScroller';
import { Locales } from '@src/domain/Locales';
import { createFormItems } from './form_items';
import { createFormActions } from '@src/createFormActions';
import messages from './messages';
import { LocaleFactoryEn } from '@src/utils/LocaleFactory/LocaleFactoryEn';
import { WindowTimer } from '@src/utils/Timer';

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
		delay: runtimeEnvironment.getBannerDelay( 0 ),
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
