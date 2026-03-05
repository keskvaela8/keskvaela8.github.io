"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppState } from "./state/useAppState";
import { AppShell, Group, Select, Text } from "@mantine/core";
import { ClearApartmentSelectionButton } from "./components/clearApartmentSelectionButton";
import { ColorSchemeToggle } from "./components/colorSchemeToggle";
import PeriodView from "./components/periodView";
import { selectablePeriods } from "./util/selectablePeriods";
import { IconHome } from "@tabler/icons-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 0,
    },
  },
});

export default function Home() {
  const [isClient, setIsClient] = React.useState(false);
  const { apartment, selectedPeriod, setSelectedPeriod } = useAppState();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell header={{ height: 56 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md" gap="sm" justify="space-between">
            <Group gap="sm">
              <IconHome size={20} stroke={1.5} />
              <Text fw={600} size="sm" visibleFrom="xs">
                Kesk-Vaela 8
              </Text>
              {apartment && <ClearApartmentSelectionButton />}
            </Group>
            <Group gap="sm">
              {apartment && (
                <Select
                  size="sm"
                  data={selectablePeriods()}
                  placeholder="Vali periood"
                  value={selectedPeriod || ""}
                  onChange={(value) => setSelectedPeriod(value)}
                  allowDeselect={false}
                  styles={{ input: { minWidth: 130 } }}
                />
              )}
              <ColorSchemeToggle />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <PeriodView />
        </AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  );
}
