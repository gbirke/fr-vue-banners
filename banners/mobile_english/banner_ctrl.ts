import { createVueApp } from '@src/createVueApp';

import './styles/styles.scss';

import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import Banner from './components/BannerCtrl.vue';
import getBannerDelay from '@src/utils/getBannerDelay';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import PageWPORG from '@src/page/PageWPORG';
import { WindowMediaWiki } from '@src/page/MediaWiki/WindowMediaWiki';
import { SkinFactory } from '@src/page/skin/SkinFactory';
import { WindowSizeIssueChecker } from '@src/utils/SizeIssueChecker/WindowSizeIssueChecker';
import TranslationPlugin from '@src/TranslationPlugin';
import { LegacyTrackerWPORG } from '@src/tracking/LegacyTrackerWPORG';
import { WindowPageScroller } from '@src/utils/PageScroller/WindowPageScroller';
import eventMappings from './event_map';
import { Translator } from '@src/Translator';
import DynamicTextPlugin from '@src/DynamicTextPlugin';
import { LocalImpressionCount } from '@src/utils/LocalImpressionCount';
import { Locales } from '@src/domain/Locales';

// Channel specific form setup
import { createFormItems } from './form_items';
import { createFormActions } from '@src/createFormActions';

// Content for EN banners
import messages from './messages';
import { LocaleFactoryEn } from '@src/utils/LocaleFactory/LocaleFactoryEn';

const localeFactory = new LocaleFactoryEn();
const translator = new Translator( messages );
const mediaWiki = new WindowMediaWiki();
const page = new PageWPORG( mediaWiki, ( new SkinFactory( mediaWiki ) ).getSkin(), new WindowSizeIssueChecker() );
const tracker = new LegacyTrackerWPORG( mediaWiki, page.getTracking().keyword, eventMappings );
const currencyFormatter = localeFactory.getCurrencyFormatter();
const impressionCount = new LocalImpressionCount( page.getTracking().keyword );
const remainingImpressions = Math.max( page.getMaxBannerImpressions() - impressionCount.overallCountIncremented, 0 );

const app = createVueApp( BannerConductor, {
	page,
	bannerConfig: {
		delay: getBannerDelay( 7500 ),
		transitionDuration: 1000
	},
	bannerProps: {
		useOfFundsContent: localeFactory.getUseOfFundsLoader().getContent(),
		pageScroller: new WindowPageScroller(),
		remainingImpressions
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

app.mount( page.getBannerContainer() );
