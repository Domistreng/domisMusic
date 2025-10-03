// userContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface UserContextType {
  uniqueId: string | null;
  setUniqueId: (id: string) => void;
}

export const UserContext = createContext<UserContextType>({
  uniqueId: null,
  setUniqueId: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uniqueId, setUniqueId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ uniqueId, setUniqueId }}>
      {children}
    </UserContext.Provider>
  );
};
