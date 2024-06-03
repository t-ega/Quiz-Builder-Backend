import React, { PropsWithChildren } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="card">{children}</div>;
};
