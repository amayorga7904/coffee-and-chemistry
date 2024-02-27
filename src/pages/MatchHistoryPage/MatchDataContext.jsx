// MatchDataContext.js
import React, { createContext, useContext, useState } from 'react';

const MatchDataContext = createContext();

export const useMatchData = () => useContext(MatchDataContext);

export const MatchDataProvider = ({ children }) => {
  const [matchData, setMatchData] = useState(null);

  return (
    <MatchDataContext.Provider value={{ matchData, setMatchData }}>
      {children}
    </MatchDataContext.Provider>
  );
};
