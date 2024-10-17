import React, { createContext, useState } from 'react';

// Tạo context
export const SearchContext = createContext();

// Tạo SearchProvider để bọc component xung quanh
export const SearchProvider = ({ children }) => {
  const [searchText, setSearchText] = useState('');

  return (
    <SearchContext.Provider value={{ searchText, setSearchText }}>
      {children}
    </SearchContext.Provider>
  );
};
