import { IndexApi, Configuration } from '../internal/client/index';

// The base URL for the API. This should be the root URL where your API is hosted.
let apiURL = 'http://localhost:3000';
if (typeof window !== "undefined") {
  apiURL = `${window.location.protocol}//${window.location.hostname}:3000`;
}
// Creating a Configuration object for the API client.
const apiConfig = new Configuration({ basePath: apiURL });

// Instantiating the IndexApi class from the generated client with the created configuration.
const apiClientIndex = new IndexApi(apiConfig);

// Exporting the instantiated IndexApi object for use in other parts of the application.
export default apiClientIndex;
