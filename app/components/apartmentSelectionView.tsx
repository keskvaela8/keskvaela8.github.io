import {
  Card,
  Center,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { useAppState } from "../state/useAppState";
import { IconHome } from "@tabler/icons-react";

const apartments = ["1", "2", "3", "4"];

export function ApartmentSelectionView() {
  const { setApartment } = useAppState();

  return (
    <Center mih="60vh">
      <Stack align="center" gap="xl">
        <Stack align="center" gap="xs">
          <Title order={2}>Kesk-Vaela 8</Title>
          <Text c="dimmed">Vali oma korter</Text>
        </Stack>
        <SimpleGrid cols={{ base: 2, xs: 4 }} spacing="md">
          {apartments.map((num) => (
            <UnstyledButton key={num} onClick={() => setApartment(num)}>
              <Card
                withBorder
                radius="md"
                padding="lg"
                style={{ textAlign: "center", cursor: "pointer" }}
                className="apartment-card"
              >
                <Stack align="center" gap="xs">
                  <IconHome size={32} stroke={1.5} />
                  <Text fw={600} size="lg">
                    Korter {num}
                  </Text>
                </Stack>
              </Card>
            </UnstyledButton>
          ))}
        </SimpleGrid>
      </Stack>
    </Center>
  );
}
