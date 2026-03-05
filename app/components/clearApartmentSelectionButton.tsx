import { Badge, CloseButton, Group } from "@mantine/core";
import { useAppState } from "../state/useAppState";

export function ClearApartmentSelectionButton() {
  const { setApartment, apartment } = useAppState();

  return (
    <Group gap={4}>
      <Badge variant="light" size="lg" radius="sm">
        Korter {apartment}
      </Badge>
      <CloseButton
        size="sm"
        variant="subtle"
        title="Vali teine korter"
        onClick={() => setApartment(null)}
      />
    </Group>
  );
}
