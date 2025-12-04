import Select from "react-select";
import type { StylesConfig } from "react-select";

type ListItem = {
  id: string;
  name: string;
  color: string;
};

type OptionType = {
  value: string;
  label: string;
  color: string;
};

type MyDropdownProps = {
  list: ListItem[];
  value?: OptionType | null;
  onChange?: (value: OptionType) => void;
  disabled?: boolean;
};

const customStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    minHeight: "30px",
    height: "25px",
    padding: "0 9px",
    fontSize: "12px",
    backgroundColor: "#f5f5f5ff",
    outline: "none",
    boxShadow: "none",
    borderRadius: "7px",
    border: "1px solid #D1D5DB",
  }),
  option: (base, props) => ({
    ...base,
    backgroundColor: props.isFocused ? "#FEF08A" : "white",
    color: "#1F2937",
    fontSize: "12px",
    cursor: "pointer",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: 2,
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 8px",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

const MyDropdown: React.FC<MyDropdownProps> = ({ list, value, onChange }) => {
  const options = list.map((item) => ({
    value: item.id,
    label: item.name,
    color: item.color,
  }));

  return (
    <Select
      options={options}
      value={value || null}
      onChange={(option) => {
        if (onChange && option) {
          onChange(option as OptionType);
        }
      }}
      styles={customStyles}
      placeholder="Select"
      noOptionsMessage={() => "__"}
      isSearchable={false}
    />
  );
};

export default MyDropdown;
