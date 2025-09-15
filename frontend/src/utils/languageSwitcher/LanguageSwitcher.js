import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLanguage, setSystemLanguage } from "../../services/CookiesUtils.js";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = getLanguage();
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      const defaultLanguage = "en";
      i18n.changeLanguage(defaultLanguage);
      setSystemLanguage(defaultLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    setSystemLanguage(newLanguage);
  };

  return (
    <FormControl
      variant="standard"
      className="language_switcher w-100"
      style={{ marginRight: "1vh" }}
    >
      <InputLabel id="language-select-label">
        {t("change_preferred_language")}
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        className="InputLabel"
        value={i18n.language}
        onChange={handleLanguageChange}
        label={t("select_preferred_language")}
      >
        <MenuItem value="de">German</MenuItem>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
        <MenuItem value="ar">Arabic</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
