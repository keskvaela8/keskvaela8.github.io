import { ActionIcon } from "@mantine/core";
import { useAppState } from "../state/useAppState";
import { IconLogout } from "@tabler/icons-react";

export function ClearApartmentSelectionButton() {
  const { setApartment, apartment } = useAppState();

  return (
    <>
      Korter: {apartment}
      <ActionIcon
        variant="subtle"
        color="red"
        title="Vali teine korter"
        onClick={() => setApartment(null)}
      >
        <IconLogout></IconLogout>
      </ActionIcon>
    </>
  );
}
