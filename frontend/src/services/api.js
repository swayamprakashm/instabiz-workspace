const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const generateStorefront = async (businessData) => {
  const response = await fetch(`${API_BASE_URL}/generate/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(businessData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate storefront.');
  }
  return data;
};
