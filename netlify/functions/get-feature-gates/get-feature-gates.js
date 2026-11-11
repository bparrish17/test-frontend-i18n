const axios = require('axios');

/**
 * Serverless function to fetch all feature gates from Statsig Console API
 *
 * This function fetches a complete list of feature gates from Statsig and
 * returns them to the client. It handles API key validation, error handling,
 * and proper response formatting.
 *
 * @param {Object} event - The Lambda event object containing HTTP request details
 * @param {string} event.httpMethod - The HTTP method used (must be GET)
 * @param {Object} event.queryStringParameters - Query parameters from the request
 * @returns {Object} HTTP response with feature gates data or error message
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { Allow: 'GET' }
    };
  }

  const queryParams = event.queryStringParameters || {};
  let apiKey = queryParams.apiKey;

  if (!apiKey) {
    apiKey = process.env.VITE_STATSIG_CONSOLE_KEY;

    if (!apiKey) {
      apiKey = process.env.STATSIG_CONSOLE_KEY;

      if (!apiKey) {
        apiKey = process.env.STATSIG_CONSOLE_API_KEY;
      }
    }
  }

  if (!apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error:
          'Missing Statsig API key. Provide it as a query parameter or set VITE_STATSIG_CONSOLE_KEY environment variable.'
      })
    };
  }

  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.statsig.com/console/v1/gates',
      headers: {
        'STATSIG-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'STATSIG-API-VERSION': '20240601'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    console.error('Error fetching feature gates from Statsig:', error);

    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Error fetching feature gates',
        message: error.message,
        details: error.response?.data
      })
    };
  }
};
