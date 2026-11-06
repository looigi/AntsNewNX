// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.test_scenario`, but if you do
// `ng build --env=prod` then `environment.prod.test_scenario` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  replaceChar: '§',

  // QA
  // urlBase: 'http://10.100.7.153:9999/api/v1',
  // urlRoot: 'http://10.100.7.153:9999/',

  // LOCAL
  // urlBase: 'http://localhost:2727/api/v1',
  // urlRoot: 'http://localhost:2727/',

  // DEMO
  // urlBase: 'https://185.142.153.241/api/v1',
  // urlRoot: 'https://185.142.153.241',

  clientTypeVersion: 'Debug',
};
