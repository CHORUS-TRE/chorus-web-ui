'use client';

import { Configuration, UsersApi } from '../internal/client/index';

// The base URL for the API. This should be the root URL where your API is hosted.
let apiURL = 'http://localhost:3000';
if (typeof window !== "undefined") {
  apiURL = `${window.location.protocol}//${window.location.hostname}:3000`;
}

// Creating a Configuration object for the API client.
const apiConfig = new Configuration({ basePath: apiURL });

// Instantiating the UsersApi class from the generated client with the created configuration.
const apiClientUser = new UsersApi(apiConfig);

// Exporting the instantiated UsersApi object for use in other parts of the application.
export default apiClientUser;
