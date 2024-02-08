import { Configuration, AuthenticationApi } from '../internal/client/index';

// URL for the API
let apiURL = 'http://localhost:3000';
if (typeof window !== "undefined") {
  apiURL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
}
// Creating a new Configuration object for the API client
const apiConfig = new Configuration({ basePath: apiURL });

// Instantiating the AuthenticationApi class from the generated client
const apiClientAuth = new AuthenticationApi(apiConfig);

// Exporting the instantiated AuthenticationApi object for use in other parts of the application
export default apiClientAuth;
