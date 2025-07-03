import { Center, Select } from "@mantine/core";
import { useAppState } from "../state/useAppState";

export function ApartmentSelectionView() {
  const { apartment, setApartment } = useAppState();
  const apartments = [
    { value: "1", label: "Korter 1" },
    { value: "2", label: "Korter 2" },
    { value: "3", label: "Korter 3" },
    { value: "4", label: "Korter 4" },
  ];

  return (
    <Center>
      <Select
        value={apartment || ""}
        onChange={(value) => setApartment(value)}
        data={apartments}
        placeholder="Vali korter"
        label="Korteri valik"
      />
    </Center>
  );
}
