import { useState } from "react";
import Dropdown from "./Dropdown";
import Input from "./Input";
import Table from "./Table";
import { findInObject, nvl } from "@/utilities";

export default function RelationPicker({
  label = "",
  hideLabel = false,
  value = null,
  onSelect = () => {},
  data = [],
  options = {},
  loading = false,
  pagination = {},
  displayField = "", // campo visible
  onSearch = () => {},
}) {
  const [search, setSearch] = useState(value || "");
  const [open, setOpen] = useState(false);

  const handleSelect = (id) => {
    const item = findInObject(data, id, options?.idTable);
    onSelect(id);
    setSearch(item[displayField]);
    setOpen(false);
  };

  const onSearchPress = (key) => {
    if (key === "Enter") {
      onSearch(search);
      setOpen(false);
    }
  };

  const handleOnChange = (e)=>{
    if(nvl(e.target.value) === 0) onSelect('');
    setSearch(e.target.value)
  }

  return (
    <div className="relative">
      {!hideLabel && (
        <label className="block mb-1 text-sm font-medium">{label}</label>
      )}
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Input
            type="text"
            value={search}
            placeholder={`Buscar ${label}`}
            onChange={handleOnChange}
            onFocus={() => setOpen(true)}
            onKeyPress={(e) => onSearchPress(e.key)}
          />
        }
      >
        <div className="max-h-60 overflow-y-auto border rounded-md bg-white shadow-md p-2">
          <Table
            data={data}
            options={options}
            loading={loading}
            selectedFunction={handleSelect}
            pagination={pagination}
          />
        </div>
      </Dropdown>
    </div>
  );
}
