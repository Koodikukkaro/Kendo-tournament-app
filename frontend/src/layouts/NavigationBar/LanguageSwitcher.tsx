import React from "react";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: {
    target: { value: string | undefined };
  }): void => {
    void i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={changeLanguage}
      label="Language"
      variant="standard"
      sx={{ color: "#fff" }}
    >
      <MenuItem value="fi">FI</MenuItem>
      <MenuItem value="en">EN</MenuItem>
      {/* Add more languages as needed */}
    </Select>
  );
};

export default LanguageSwitcher;
