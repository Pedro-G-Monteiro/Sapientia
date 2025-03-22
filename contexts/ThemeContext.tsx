'use client';

import { cssVariables, getTheme } from '@/lib/theme';
import { ConfigProvider, theme as antTheme } from 'antd';
import { useTheme as useNextTheme } from 'next-themes';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark') => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Estado para rastrear se o componente foi montado (para SSR)
  const [mounted, setMounted] = useState(false);
  
  // Obtém o tema do next-themes
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  
  // Calcula o modo atual com base no tema next-themes
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const mode = (currentTheme as 'light' | 'dark') || 'light';

  // Função para alternar entre temas
  const toggleTheme = () => {
    setTheme(mode === 'light' ? 'dark' : 'light');
  };

  // Função para definir o modo diretamente
  const setMode = (newMode: 'light' | 'dark') => {
    setTheme(newMode);
  };

  // Aplica as variáveis CSS baseadas no modo atual
  useEffect(() => {
    if (!mounted) return;
    
    const variables = mode === 'light' ? cssVariables.light : cssVariables.dark;
    
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [mode, mounted]);

  // Efeito para marcar quando o componente foi montado (evita problemas de hidratação)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Aplicamos o algoritmo de tema correto baseado no modo
  const algorithm = mode === 'light' ? antTheme.defaultAlgorithm : antTheme.darkAlgorithm;

  // Evita problemas de hidratação no primeiro render
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
      <ConfigProvider theme={{ ...getTheme(mode), algorithm }}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};