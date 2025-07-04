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

  const [payerIBAN, setPayerIBAN] = useLocalStorage<string | null>({
    key: "payer-iban",
    defaultValue: null,
    getInitialValueInEffect: false,
  });

  const [payerBIC, setPayerBIC] = useLocalStorage<string | null>({
    key: "payer-bic",
    defaultValue: null,
    getInitialValueInEffect: false,
  });

  const [payerName, setPayerName] = useLocalStorage<string | null>({
    key: "payer-name",
    defaultValue: null,
    getInitialValueInEffect: false,
  });

  return {
    apartment,
    setApartment,
    selectedPeriod,
    setSelectedPeriod,
    payerIBAN,
    setPayerIBAN,
    payerBIC,
    setPayerBIC,
    payerName,
    setPayerName,
  };
}
