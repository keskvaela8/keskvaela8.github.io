import { useCallback } from "react";
import rawTranslations from "../../public/translations.json";

const buildEtMap = (array: { key: string; en: string; et: string }[]) => {
  const map: { [key: string]: string } = {};
  array.forEach(({ key, et }) => {
    map[key] = et;
  });
  return map;
};

const translations = buildEtMap(rawTranslations);

const useTranslation = () => {
  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, []);

  return { t };
};

export default useTranslation;
