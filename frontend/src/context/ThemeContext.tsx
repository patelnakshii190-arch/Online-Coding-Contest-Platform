import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  editorTheme: 'light' | 'vs-dark';
  fontSize: number;
  setEditorTheme: (theme: 'light' | 'vs-dark') => void;
  setFontSize: (size: number) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [editorTheme, setEditorTheme] = useState<'light' | 'vs-dark'>('light');
  const [fontSize, setFontSize] = useState<number>(14);

  return (
    <ThemeContext.Provider value={{ editorTheme, fontSize, setEditorTheme, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
