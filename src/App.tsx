import React, { useState, useEffect } from 'react';
import { authService } from './services/authService.js';
import { User, Student } from './types';
import { mockStudents, mockTeachers, mockResources } from './services/mockData.ts';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('portal_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portal_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portal_theme', 'light');
    }
  }, [isDarkMode]);

  // Session expired listener
  useEffect(() => {
    const handleSessionExpired = () => {
      setCurrentUser(null);
      alert('Sesi Anda telah kedaluwarsa. Silakan login kembali.');
    };
    window.addEventListener('auth:session_expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session_expired', handleSessionExpired);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <MainLayout
      currentUser={currentUser}
      onLogout={handleLogout}
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      isDarkMode={isDarkMode}
      onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
    >
      {({ onOpenQRScanner, onOpenIDCard, onOpenGradeInput }) => {
        switch (activeTab) {
          case 'dashboard':
            return (
              <DashboardPage
                currentUser={currentUser}
                onOpenQRScanner={onOpenQRScanner}
                onOpenIDCard={onOpenIDCard}
                onOpenGradeInput={onOpenGradeInput}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            );
          case 'students':
            return (
              <StudentsPage
                students={mockStudents}
                onOpenIDCard={onOpenIDCard}
                onOpenQRScanner={onOpenQRScanner}
              />
            );
          case 'teachers':
            return <TeachersPage teachers={mockTeachers} />;
          case 'qrcards':
            return (
              <StudentsPage
                students={mockStudents}
                onOpenIDCard={onOpenIDCard}
                onOpenQRScanner={onOpenQRScanner}
              />
            );
          case 'attendance':
          case 'attendance-recap':
            return <ReportsPage />;
          case 'grades':
          case 'grades-recap':
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      Penilaian & Rekap Nilai Siswa
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Evaluasi formatif dan sumatif Kurikulum Merdeka
                    </p>
                  </div>
                  <button
                    onClick={onOpenGradeInput}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
                  >
                    + Input Nilai Baru
                  </button>
                </div>
                <ReportsPage />
              </div>
            );
          case 'resources':
            return <ResourcesPage resources={mockResources} />;
          case 'reports':
            return <ReportsPage />;
          case 'settings':
            return (
              <SettingsPage
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              />
            );
          default:
            return (
              <DashboardPage
                currentUser={currentUser}
                onOpenQRScanner={onOpenQRScanner}
                onOpenIDCard={onOpenIDCard}
                onOpenGradeInput={onOpenGradeInput}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            );
        }
      }}
    </MainLayout>
  );
};

export default App;
