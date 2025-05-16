import axios from "axios";

const baseUrl = '/api';

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getInsideConfig() {
    const config = {
        baseUrl: this.baseUrl,
        headers: {}
    }
    return config;
  }

  interception(instance) {
    instance.interceptors.request.use((config) => {
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        return Promise.reject(error);
    });
  }

  request(options) {
    options = { ...this.getInsideConfig(), ...options };
    const instance = axios.create();
    this.interception(instance);
    return instance(options);
  }
}

const http = new HttpRequest(baseUrl); // ✅ 实例化

export default http;