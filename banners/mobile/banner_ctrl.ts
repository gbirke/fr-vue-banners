import { createVueApp } from '@src/createVueApp';

import BannerConductor from '@src/components/BannerConductor/BannerConductor.vue';
import MainBanner from './components/MainBanner.vue';
import getBannerDelay from '@src/utils/getBannerDelay';
import { WindowResizeHandler } from '@src/utils/ResizeHandler';
import PageOrg from '@src/page/PageOrg';
import { WindowMediaWiki } from '@src/page/WindowMediaWiki';
import { SkinFactory } from '@src/page/skin/SkinFactory';

const mediaWiki = new WindowMediaWiki();
const page = new PageOrg( mediaWiki, ( new SkinFactory( mediaWiki ) ).getSkin() );

const app = createVueApp( BannerConductor, {
	page,
	bannerConfig: {
		delay: getBannerDelay( 7500 ),
		transitionDuration: 500
	},
	resizeHandler: new WindowResizeHandler(),
	banner: MainBanner,
	bannerProps: {
		greeting: 'Hello'
	}
} );

app.mount( page.getBannerContainer() );