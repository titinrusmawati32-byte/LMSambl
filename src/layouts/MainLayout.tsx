import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { BackendStatusBanner } from '../components/BackendStatusBanner';
import { QRScannerModal } from '../components/QRScannerModal';
import { StudentCardModal } from '../components/StudentCardModal';
import { GradeInputModal } from '../components/GradeInputModal';
import { User, Student } from '../types';
import { mockStudents } from '../services/mockData.ts';

interface MainLayoutProps {
  currentUser: User | null;
  onLogout: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  children: (props: {
    onOpenQRScanner: () => void;
    onOpenIDCard: (student?: Student) => void;
    onOpenGradeInput: () => void;
  }) => React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentUser,
  onLogout,
  activeTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isIDCardOpen, setIsIDCardOpen] = useState(false);
  const [isGradeInputOpen, setIsGradeInputOpen] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Student | null>(null);

  const handleOpenIDCard = (student?: Student) => {
    setSelectedStudentForCard(student || mockStudents[0]);
    setIsIDCardOpen(true);
  };

  return (
    <div className={`min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans`}>
      {/* Sidebar for Desktop / Laptop matching Image 1 */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Navbar Matching Image 1 */}
        <Navbar
          currentUser={currentUser}
          onLogout={onLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Backend Status Banner (Checking GAS Connection) */}
        <BackendStatusBanner />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children({
            onOpenQRScanner: () => setIsQRScannerOpen(true),
            onOpenIDCard: handleOpenIDCard,
            onOpenGradeInput: () => setIsGradeInputOpen(true),
          })}
        </main>
      </div>

      {/* Bottom Navigation for Mobile matching Image 2 */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      {/* Modal 1: Presensi Siswa > QR Scanner */}
      <QRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        students={mockStudents}
        onAttendanceUpdated={() => {}}
      />

      {/* Modal 2: Kartu QR Siswa > Detail Kartu */}
      <StudentCardModal
        isOpen={isIDCardOpen}
        onClose={() => setIsIDCardOpen(false)}
        students={mockStudents}
        selectedStudent={selectedStudentForCard}
        onSelectStudent={(s) => setSelectedStudentForCard(s)}
      />

      {/* Modal 3: Penilaian > Input Nilai */}
      <GradeInputModal
        isOpen={isGradeInputOpen}
        onClose={() => setIsGradeInputOpen(false)}
        students={mockStudents}
      />
    </div>
  );
};
