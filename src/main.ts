import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Communication/WebLarekApi';
import { API_URL } from './utils/constants';



const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);
