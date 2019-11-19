import { IMAGE_URL, httpPostFormData } from '../services/http-requests';

export function uploadImage (uri, token) {
  if (!uri) {
    return Promise.resolve({ link: '' });
  }
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: 'image-name.png',
    type: 'image/png',
  });
  return httpPostFormData(IMAGE_URL, formData, token)
}
