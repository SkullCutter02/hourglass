import React from "react";
import Select from "react-select";
import { OptionTypeBase, ActionMeta } from "react-select";

interface Props {
  selectedOption: OptionTypeBase | OptionTypeBase[] | null;
  setSelectedOption: (value: any, action: ActionMeta<any>) => void;
  options?: any[];
}

const Filter: React.FC<Props> = ({
  selectedOption,
  setSelectedOption,
  options = [
    { value: "filter", label: "Filter" },
    { value: "A-Z", label: "A-Z" },
    { value: "Z-A", label: "Z-A" },
    { value: "nearest due date", label: "nearest due date" },
    { value: "furthest due date", label: "furthest due date" },
  ],
}) => {
  return (
    <Select
      defaultValue={selectedOption}
      onChange={setSelectedOption}
      options={options}
      placeholder={"Filter"}
      isSearchable={false}
      className="filter-select"
    />
  );
};

export default Filter;
