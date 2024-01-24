import { IndexApi, Configuration, UsersApi } from '../src/internal/client/index';

const apiURL = "https://template-backend.horus-graph.intranet.chuv/"
const apiConfig = new Configuration({ basePath: apiURL });
const apiClientUser = new UsersApi(apiConfig);

export default apiClientUser;
