import { apiRequest, isBackendConfigured } from './api.js';
import { mockStudents } from './mockData.ts';

export const studentService = {
  async getStudentsByClass(className = 'VI A', schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      const filtered = className ? mockStudents.filter(s => s.className === className) : mockStudents;
      return { success: true, data: filtered, isSimulated: true };
    }
    try {
      return await apiRequest('getStudents', { className, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async getAllStudents(schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      return { success: true, data: mockStudents, isSimulated: true };
    }
    try {
      return await apiRequest('getStudents', { schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async addStudent(studentData) {
    if (!isBackendConfigured()) {
      const newStudent = {
        ...studentData,
        id: `std-${Date.now()}`,
        qrToken: `TKN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
      };
      mockStudents.push(newStudent);
      return { success: true, data: newStudent, isSimulated: true };
    }
    try {
      return await apiRequest('addStudent', studentData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
