import { ActionIcon, Group, Text } from "@mantine/core";
import { useAppState } from "../state/useAppState";
import { IconLogout } from "@tabler/icons-react";

export function ClearApartmentSelectionButton() {
  const { setApartment, apartment } = useAppState();

  return (
    <Group gap="xs">
      <Text visibleFrom="xxs">Korter: </Text>
      <Text visibleFrom="xxxs">{apartment}</Text>
      <ActionIcon
        variant="subtle"
        color="red"
        title="Vali teine korter"
        onClick={() => setApartment(null)}
      >
        <IconLogout />
      </ActionIcon>
    </Group>
  );
}
