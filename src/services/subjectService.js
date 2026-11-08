import { apiRequest, isBackendConfigured } from './api.js';

const mockSubjects = [
  { id: "sbj-1", name: "Matematika", code: "MTK" },
  { id: "sbj-2", name: "Bahasa Indonesia", code: "BIN" },
  { id: "sbj-3", name: "Ilmu Pengetahuan Alam (IPA)", code: "IPA" },
  { id: "sbj-4", name: "Ilmu Pengetahuan Sosial (IPS)", code: "IPS" },
  { id: "sbj-5", name: "Pendidikan Pancasila", code: "PPN" },
  { id: "sbj-6", name: "Pendidikan Jasmani", code: "PJK" }
];

export const subjectService = {
  async getAllSubjects(schoolId = 'sdn-sumberejo-04') {
    if (!isBackendConfigured()) {
      return { success: true, data: mockSubjects, isSimulated: true };
    }
    try {
      return await apiRequest('getSubjects', { schoolId });
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
