'use strict';

const fetch = require('./fetch-wierror-handling');
const logger = require('./gateway-logger');
const querystring = require('querystring');
const filterIncomingHeadersForBackendCall = require('./filter-incoming-headers-for-backend-call');
//const HttpProxyAgent = require('http-proxy-agent');

// API
const backend = {
  get: (incomingRequest, url, queryObj) => {
    url = appendQueryString(url, queryObj);
    const headers = filterIncomingHeadersForBackendCall(incomingRequest.headers);

    return fetch(url, {
      method: 'get',
      headers: headers,
    });
  },

  post: (incomingRequest, url, body, queryObj) => {
    body = body || {};
    let bodyAsString = JSON.stringify(body);
    const headers = filterIncomingHeadersForBackendCall(incomingRequest.headers);

    correctContentLengthAndType(headers, bodyAsString);
    url = appendQueryString(url, queryObj);

    return fetch(url, {
      method: 'post',
      headers: headers,
      body: bodyAsString,
      //agent: new HttpProxyAgent('http://127.0.0.1:8888'), //debugging in Fiddler
    });
  },


  delete: (incomingRequest, url, queryObj) => {
    url = appendQueryString(url, queryObj);
    const headers = filterIncomingHeadersForBackendCall(incomingRequest.headers);
    return fetch(url, {
      method: 'delete',
      headers: headers,
    });
  },

  fetch: fetch,
};

// Function
function appendQueryString(url, queryObj) {
  if (!queryObj || !Object.keys(queryObj).length) return url;
  url += ~url.indexOf('?') ? '&' : '?';
  url += querystring.stringify(queryObj);
  return url;
}

// another function
function correctContentLengthAndType(headers, bodyAsString) {
  if (!(headers['Content-Type'] || headers['content-type'])) {
    headers['Content-Type'] = 'application/json; charset=utf-8';
  }
  if (headers['content-length']) {
    headers['content-length'] = Buffer(bodyAsString).byteLength;
  } else {
    headers['Content-Length'] = Buffer(bodyAsString).byteLength;
  }
}

// Export
module.exports = backend;
