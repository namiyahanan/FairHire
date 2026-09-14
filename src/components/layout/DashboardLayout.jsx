import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    return localStorage.getItem('fairhire_sidebar_pinned') === 'true';
  });

  const closeTimeoutRef = useRef(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleOpen = useCallback(() => {
    clearCloseTimeout();
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (isPinned) return;
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220);
  }, [isPinned]);

  const handleImmediateClose = useCallback(() => {
    if (isPinned) return;
    clearCloseTimeout();
    setIsOpen(false);
  }, [isPinned]);

  // Global mousemove handler for left corner / edge detection
  useEffect(() => {
    if (isPinned) return;

    const handleMouseMove = (e) => {
      // Trigger sidebar when cursor moves within 18px of the left screen edge
      if (e.clientX <= 18) {
        handleOpen();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPinned, handleOpen]);

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev;
      localStorage.setItem('fairhire_sidebar_pinned', String(next));
      if (next) setIsOpen(true);
      return next;
    });
  };

  const toggleOpen = () => {
    clearCloseTimeout();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-surface-bg relative overflow-x-hidden">
      {/* Invisible Left Edge Hover Detection Zone */}
      {!isPinned && (
        <div
          onMouseEnter={handleOpen}
          className="fixed left-0 top-0 bottom-0 w-4 z-40 cursor-pointer group"
          title="Hover to reveal menu"
          aria-hidden="true"
        >
          {/* Subtle glowing indicator line on hover */}
          <div className="h-full w-1 bg-teal-500/0 group-hover:bg-teal-400/80 transition-all duration-300 shadow-[0_0_12px_rgba(45,212,191,0.8)]" />
        </div>
      )}



      {/* Backdrop overlay when menu is open in unpinned mode */}
      {!isPinned && isOpen && (
        <div
          onClick={handleImmediateClose}
          className="fixed inset-0 bg-navy-950/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 animate-fade-in cursor-pointer"
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isOpen || isPinned}
        isPinned={isPinned}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onTogglePin={togglePin}
        onClose={handleImmediateClose}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isPinned ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <Topbar
          onToggleSidebar={toggleOpen}
          isSidebarOpen={isOpen || isPinned}
          isSidebarPinned={isPinned}
        />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

