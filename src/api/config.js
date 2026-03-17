
async function apiClient(endpoint, options = {}) {
  const url = `/api${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Превышен лимит запросов к API. Попробуйте позже.');
      }
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

export default apiClient;