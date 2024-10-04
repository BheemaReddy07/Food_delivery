// src/Context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();  //create a theme context

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');  //setting the theme light by default

  useEffect(() => {
    localStorage.setItem('theme', theme);  //setting the theme in the local storage
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {   //toggle function to change the theme
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>    {/**sending the theme ,toggletheme as a props */}
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
