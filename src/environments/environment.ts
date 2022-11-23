// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// const URL = 'https://f370c13eceed.ngrok.io';
const URL = 'https://backend.grisemetamoonverse.io';

export const environment = {
  production: false,
  uniswapUrl: "https://uniswap.org/",
  tokenDayDataAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  marketCapPairAddress: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
  initialTimeStamp: 1614556800,
  launchTimeStamp: 1619740800000,
  graphAPIBaseUrl:
    "https://api.dex.guru/v1/tokens/0xb359e4290573a3974616b7c26ea86939689b9ec4-bsc",
  blockFrostApiKey: 'testnetLYuDgDFyN0OD1s9hXnNMVzyRlPN7imcG',
  blockFrostApiKeyMainnet: 'mainnetlAVJlI0cwOhk8Iv8jVVLcRJGGGjg41J8',
  adminNamiWalletAddress: 'addr_test1qzs9twae6mr972hrvnglv8hhujygcelgjgwmyt7zxpwghyg6x6z4ph0smdthszxfw2sctq4f0u6dltl65wqy2dpjxwaq0mnttc',
  ADMIN_ROYALITY: 1.77,
  ASSET_TRANSFER_PRICE: 1.5,
  TRIPPY_OWL_COLLECTION_PRICE: 3,
  SERVER_URL: URL,
  baseUrlAPI: `${URL}/api/v0/nft` // 'https://6db24df63462.ngrok.io/api/v0/nft' // 'https://backend.grisemetamoonverse.io/api/v0/nft'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
