import { apiRequest, isBackendConfigured } from './api.js';
import { mockResources } from './mockData.ts';

export const resourceService = {
  async getAllResources(category = '', search = '', schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      let result = [...mockResources];
      if (category && category !== 'Semua') {
        result = result.filter(r => r.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(r => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q));
      }
      return { success: true, data: result, isSimulated: true };
    }
    try {
      return await apiRequest('getResources', { category, search, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async addResource(resourceData, schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      const newRes = {
        ...resourceData,
        id: `res-${Date.now()}`,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      mockResources.unshift(newRes);
      return { success: true, data: newRes, isSimulated: true };
    }
    try {
      return await apiRequest('addResource', { ...resourceData, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
