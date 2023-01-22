import React from "react";

type DetailsRowProps = {
  className?: string;
  label?: string;
  value?: string;
};

const DetailsRow = ({ className, label, value }: DetailsRowProps) => {
  return (
    <div className={`flex flex-row p-1 ${className}`}>
      <span className="flex-grow font-semibold">{label}:</span>
      <span>{value}</span>
    </div>
  );
};

export default DetailsRow;
