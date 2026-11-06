// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  replaceChar: '§',
  // QA
  // urlBase: 'http://10.100.7.153:9999/api/v1',
  // urlRoot: 'http://10.100.7.153:9999/',

  // LOCAL
  urlBase: 'http://10.100.7.69/api/v1',
  urlRoot: 'http://10.100.7.69/',

  // DEMO
  // urlBase: 'https://185.142.153.241/api/v1',
  // urlRoot: 'https://185.142.153.241',

  clientTypeVersion: 'Debug'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
