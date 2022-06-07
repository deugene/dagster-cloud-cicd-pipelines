const argv = require('yargs-parser')(process.argv.slice(2));
const {DagsterCloudClient} = require('./dagsterCloud');
const {getProcess, getLocations, updateLocations} = require('./utils');
const {
  _,
  locationFile,
  dagitUrl,
  apiToken,
  parallel = false,
  imageTag = 'latest'
} = argv;

(async () => {
  const locations = await getLocations(locationFile);
  const process = getProcess(parallel);
  const endpoint = `${dagitUrl}/graphql`;
  const client = new DagsterCloudClient(endpoint, apiToken);

  await updateLocations(process, client, locations, imageTag);
})();
