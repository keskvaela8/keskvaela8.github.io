import { useLocalStorage } from "@mantine/hooks";

export function useAppState() {
  // Persisted apartment selection
  const [apartment, setApartment] = useLocalStorage<string | null>({
    key: "apartment-number",
    defaultValue: null,
  });

  const [selectedPeriod, setSelectedPeriod] = useLocalStorage<string | null>({
    key: "selected-period",
    defaultValue: null,
  });

  // const [userIBAN, setUserIBAN] = useLocalStorage<string | null>({
  //   key: "user-iban",
  //   defaultValue: null,
  // });

  return {
    apartment,
    setApartment,
    selectedPeriod,
    setSelectedPeriod,
  };
}
