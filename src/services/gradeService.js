import { apiRequest, isBackendConfigured } from './api.js';
import { mockGrades } from './mockData.ts';

export const gradeService = {
  async getGrades(className = 'VI A', subject = 'Matematika', assessmentType = 'Ulangan Harian', schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      const filtered = mockGrades.filter(g =>
        (!className || g.className === className) &&
        (!subject || g.subject === subject)
      );
      return { success: true, data: filtered, isSimulated: true };
    }
    try {
      return await apiRequest('getGrades', { className, subject, assessmentType, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async saveBatchGrades(gradesList, schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      gradesList.forEach(item => {
        const existingIdx = mockGrades.findIndex(g =>
          g.studentId === item.studentId &&
          g.subject === item.subject &&
          g.assessmentType === item.assessmentType
        );
        if (existingIdx >= 0) {
          mockGrades[existingIdx] = { ...mockGrades[existingIdx], score: item.score, notes: item.notes };
        } else {
          mockGrades.push({
            id: `grd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            schoolId,
            ...item
          });
        }
      });
      return { success: true, count: gradesList.length, isSimulated: true, message: 'Nilai tersimpan di memori simulasi.' };
    }
    try {
      return await apiRequest('saveBatchGrades', { grades: gradesList, schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
