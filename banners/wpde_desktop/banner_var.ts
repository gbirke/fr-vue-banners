import { createVueApp } from '@src/createVueApp';

import './styles/styles.scss';

import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import Banner from './components/BannerVar.vue';
import getBannerDelay from '@src/utils/getBannerDelay';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import PageWPDE from '@src/page/PageWPDE';
import TranslationPlugin from '@src/TranslationPlugin';
import { TrackerWPDE } from '@src/tracking/TrackerWPDE';
import eventMap from './event_map';
import { Translator } from '@src/Translator';
import DynamicTextPlugin from '@src/DynamicTextPlugin';
import { LocalImpressionCount } from '@src/utils/LocalImpressionCount';

// Channel specific form setup
import { createFormItems } from './form_items';
import { createFormActions } from '@src/createFormActions';

// Content
import messages from './messages';
import { LocaleFactoryWpDe } from '@src/utils/LocaleFactory/LocaleFactoryWpDe';

const localeFactory = new LocaleFactoryWpDe();
const translator = new Translator( messages );

// Tracking placeholders will be replaced by webpack string-replace-loader
// using the campaign configuration ( campaign_info.toml ) for the correct values
const tracking = {
	campaign: '!insert-campaign-here!',
	keyword: '!insert-keyword-here!'
};

// This is channel specific and must be changed for wp.org banners
const page = new PageWPDE( tracking );
const impressionCount = new LocalImpressionCount( page.getTracking().keyword );
const tracker = new TrackerWPDE( 'FundraisingTracker', page.getTracking().keyword, eventMap );
const remainingImpressions = Math.max( page.getMaxBannerImpressions() - impressionCount.overallCountIncremented, 0 );

const app = createVueApp( BannerConductor, {
	page,
	bannerConfig: {
		delay: getBannerDelay( 0 ),
		transitionDuration: 1000
	},
	bannerProps: {
		useOfFundsContent: localeFactory.getUseOfFundsLoader().getContent(),
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

const currencyFormatter = localeFactory.getCurrencyFormatter();
app.provide( 'currencyFormatter', currencyFormatter );
app.provide( 'formItems', createFormItems( translator, currencyFormatter.euroAmount.bind( currencyFormatter ) ) );
app.provide( 'formActions', createFormActions( page.getTracking(), impressionCount ) );
app.provide( 'tracker', tracker );

app.mount( page.getBannerContainer() );
