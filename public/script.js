// Prevent context menu
document.addEventListener('contextmenu', (e) => e.preventDefault());

// Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
document.addEventListener('keydown', (e) => {
  if (
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key === 'I') || 
      (e.ctrlKey && e.shiftKey && e.key === 'J') || 
      (e.ctrlKey && e.key === 'U')
  ) {
      e.preventDefault();
  }
});

// Prevent Ctrl+U
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'U') {
      e.preventDefault();
  }
});