import axios from 'axios';

const API_KEY = '33901204-9e2cee760dcc4c2bf1fca35a0';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const defaultParams = {
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: 12,
  key: API_KEY,
};

export async function getImgs(page, searchQuery) {
  const params = {
    ...defaultParams,
    q: searchQuery,
    page: page,
  };

  const response = await axios.get('', { params });

  return response.data;
}
