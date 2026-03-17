const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

async function apiClient(endpoint, options = {}) {
  // В продакшне используем полный URL, в разработке - прокси
  const url = process.env.NODE_ENV === 'production' 
    ? `${BASE_URL}${endpoint}`
    : `/api${endpoint}`;
  
  const defaultHeaders = {
    'X-Auth-Token': API_TOKEN,
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