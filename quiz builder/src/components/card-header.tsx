import React, { PropsWithChildren } from "react";

const CardHeader: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="card-header">
      {children}
      <hr />
    </div>
  );
};

export default CardHeader;
