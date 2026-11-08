import { apiRequest, isBackendConfigured } from './api.js';
import { mockSchool } from './mockData.ts';

export const schoolService = {
  async getSchoolProfile(schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      return { success: true, data: mockSchool, isSimulated: true };
    }
    try {
      return await apiRequest('getSchoolProfile', { schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async updateSchoolProfile(schoolData) {
    if (!isBackendConfigured()) {
      return { success: true, data: schoolData, isSimulated: true, message: 'Disimpan di memori simulasi' };
    }
    try {
      return await apiRequest('updateSchoolProfile', schoolData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
