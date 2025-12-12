import axios from 'axios';

const API_BASE_URL = 'http://localhost:5171/api/v1'; 

const UpApiContextRequest = axios.create({
  baseURL: API_BASE_URL,
});

UpApiContextRequest.defaults.headers.common['Accept'] = 'application/json';
UpApiContextRequest.defaults.headers.post['Content-Type'] = 'application/json';
UpApiContextRequest.defaults.headers.put['Content-Type'] = 'application/json';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T | null;
}

export { UpApiContextRequest };