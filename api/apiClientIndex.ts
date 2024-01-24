import { IndexApi, Configuration } from '../src/internal/client/index';

const apiURL = "https://template-backend.horus-graph.intranet.chuv/"
const apiConfig = new Configuration({ basePath: apiURL });
const apiClientIndex = new IndexApi(apiConfig);

export default apiClientIndex;
