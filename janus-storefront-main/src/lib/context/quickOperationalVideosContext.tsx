"use client";

import { createContext, useContext, useState } from "react";

const VideoRefreshContext = createContext<{
  refreshKey: number;
  triggerRefresh: () => void;
}>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const useVideoRefresh = () => useContext(VideoRefreshContext);

export const QuickOperationalVideoRefreshProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const triggerRefresh = () => {
    setRefreshKey(Date.now());
  };

  return (
    <VideoRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </VideoRefreshContext.Provider>
  );
};
