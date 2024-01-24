import { IndexApi, Configuration, AuthenticationApi } from '../src/internal/client/index';

const apiURL = "https://template-backend.horus-graph.intranet.chuv/"
const apiConfig = new Configuration({ basePath: apiURL });
const apiClientAuth = new AuthenticationApi(apiConfig);

export default apiClientAuth;
