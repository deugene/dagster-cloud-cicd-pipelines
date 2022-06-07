const fs = require('fs');
const YAML = require('yaml');

async function getLocations(locationFile) {
  return YAML.parse(fs.readFileSync(locationFile, 'utf8')).locations;
}

function getProcess(parallel) {
  return parallel ? inParallel : inSeries;
}

async function inParallel(locations, processingFunction) {
  await Promise.all(Object.entries(locations).map(processingFunction));
}

async function inSeries(locations, processingFunction) {
  for (const [locationName, location] of Object.entries(locations)) {
    await processingFunction([locationName, location]);
  }
}

async function updateLocations(process, client, locations, imageTag) {
  await process(locations, async ([locationName, location]) => {
    const pythonFile = location.python_file;
    const packageName = location.package_name;
    const moduleName = location.module_name;
    const workingDirectory = location.working_directory;
    const executablePath = location.executable_path;
    const {attribute} = location;
    const containerContext = location.container_context;

    if ([pythonFile, packageName, moduleName].filter(Boolean).length != 1) {
      throw new Error(
        `Must provide exactly one of python_file, package_name, or module_name on location ${locationName}.`
      );
    }

    const locationData = {
      location_name: locationName,
      code_source: {
        python_file: pythonFile,
        package_name: packageName,
        module_name: moduleName
      },
      image: `${location.registry}:${imageTag}`,
      working_directory: workingDirectory,
      executable_path: executablePath,
      attribute,
      container_context: containerContext
    };
    const result = await client.updateLocation(locationData);

    console.info(`Updated location ${result}.`);
  });
}

module.exports = {
  getProcess,
  getLocations,
  updateLocations
};
