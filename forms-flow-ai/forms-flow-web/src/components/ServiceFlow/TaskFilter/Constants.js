export const crimalStatusOptions = [
  {
    id: 0,
    value: "",
    name: "",
  },
  {
    id: 1,
    value: "Yes",
    name: "Yes",
  },
  {
    id: 2,
    value: "No",
    name: "No",
  },
];

export const documentStatusOptions = [
  {
    id: 0,
    value: "",
    name: "",
  },
  {
    id: 1,
    value: "New",
    name: "New",
  },
  {
    id: 2,
    value: "In progress",
    name: "In Progress",
  },
  {
    id: 3,
    value: "Closed",
    name: "Closed",
  },
];

// Replacing current hardcoded array with the dynamic, runtime-driven version.
export const documentType = (window._env_?.DOCUMENT_TYPES || "")
  .split(",")
  .filter(Boolean)
  .map((entry, index) => {
    const [value, name] = entry.split(":");
    return {
      id: index + 1,
      value: value || "",
      name: name || value,
    };
  });

export const staffGroup = [
  {
    id: 0,
    value: "",
    name: "",
    isSelected: false,
  },
  {
    id: 1,
    value: "bcps",
    name: "BCPS",
    isSelected: true,
  },
  {
    id: 2,
    value: "lsb",
    name: "LSB",
    isSelected: false,
  },
  {
    id: 3,
    value: "joint",
    name: "JOINT",
    isSelected: false,
  },
  {
    id: 4,
    value: "UNASSIGNED",
    name: "UNASSIGNED",
    isSelected: false,
  },
];
