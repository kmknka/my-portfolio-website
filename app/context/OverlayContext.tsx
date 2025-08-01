// app/context/OverlayContext.tsx
import { createContext, useContext, useState } from "react";

const OverlayContext = createContext<{
  isOpen: boolean;
  open: () => void;
  close: () => void;
}>({
  isOpen: false,
  open: () => {},
  close: () => {},
});
export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <OverlayContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext);
