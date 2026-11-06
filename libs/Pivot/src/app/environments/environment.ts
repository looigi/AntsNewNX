// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.test_scenario`, but if you do
// `ng build --env=prod` then `environment.prod.test_scenario` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  replaceChar: '_',
  urlBaseGS: 'Geo_ANTS',
  urlBase: 'api/v1',
  clientTypeVersion: 'Debug',
  nomeLogin: 'Luigi.Pecce',
  // pwdLogin: 'cerioni',
  // nomeLogin: 'Luigi.Pecce.29',
  // pwdLogin: 'Lati_01',
  layerPerGraficoNumerico: 'Geo_ANTS:l_geo_measr_num_sample',
  layerPerGraficoStringa: 'Geo_ANTS:l_geo_measr_str_sample',
  layerNumerico: 'Geo_ANTS:l_geo_measr_num_line',
  layerStringa: 'Geo_ANTS:l_geo_measr_str_line',
  // nomeLogin: 'Luigi.Pecce',
  // pwdLogin: 'latitude',
  // spostamentoMillisecondi: 3600000,
  // spostamentoMillisecondi: 0,
  stringaLatestSelection: '<Latest Selected>',
  stringaAll: '<All>',
  stringaGlobalSettingSLA: '<Global SLA>',
  stringaGlobalSettingMapStyle: '<Global Map Style>',
  stringaClusterGlobale: '<Global Cluster>',
  quantiFrames: 9,
  quantiSottoFrames: 30,
  quantePagine: 30
};
