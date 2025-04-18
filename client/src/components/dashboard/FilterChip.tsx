import React from "react";

type FilterType = "keyword" | "location" | "time";

interface FilterChipProps {
  label: string;
  type: FilterType;
  onRemove: () => void;
}

export default function FilterChip({ label, type, onRemove }: FilterChipProps) {
  const getChipStyles = (type: FilterType) => {
    switch(type) {
      case "keyword":
        return "bg-primary bg-opacity-10 text-primary";
      case "location":
      case "time":
      default:
        return "bg-neutral-200 text-neutral-800";
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${getChipStyles(type)}`}>
      {label}
      <button 
        className={`ml-1 ${type === "keyword" ? "text-primary" : "text-neutral-600"} focus:outline-none`}
        onClick={onRemove}
      >
        <span className="material-icons text-sm">close</span>
      </button>
    </span>
  );
}
