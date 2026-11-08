import { apiRequest, isBackendConfigured } from './api.js';
import { mockTeachers } from './mockData.ts';

export const teacherService = {
  async getAllTeachers(schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      return { success: true, data: mockTeachers, isSimulated: true };
    }
    try {
      return await apiRequest('getTeachers', { schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async addTeacher(teacherData) {
    if (!isBackendConfigured()) {
      const newTeacher = { ...teacherData, id: `tch-${Date.now()}` };
      mockTeachers.push(newTeacher);
      return { success: true, data: newTeacher, isSimulated: true };
    }
    try {
      return await apiRequest('addTeacher', teacherData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
