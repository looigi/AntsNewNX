var replace = require('replace-in-file');
var ProvaAngular = process.env.TEMP;
// console.log(ProvaAngular);
const options = {
  files: '../environments/environment.ts',
  from: /{PROVA}/g,
  to: ProvaAngular,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  // console.log('Build version set: ' + ProvaAngular);
}
catch (error) {
  console.error('Error occurred:', error);
}
