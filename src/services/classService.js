import { apiRequest, isBackendConfigured } from './api.js';
import { mockClasses } from './mockData.ts';

export const classService = {
  async getAllClasses(schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      return { success: true, data: mockClasses, isSimulated: true };
    }
    try {
      return await apiRequest('getClasses', { schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
