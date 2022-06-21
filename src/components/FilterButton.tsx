import React from "react";

export default function FilterButton({
  filterOption,
  text,
  setFilter,
  selected,
}: {
  filterOption: string;
  text: string;
  setFilter: Function;
  selected?: boolean;
}) {
  const handleClick = () => setFilter(filterOption);

  return (
    <button
      className={"filter-button " + (selected ? "filter-selected" : "")}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
