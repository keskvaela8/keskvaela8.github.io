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
          <Group h="100%" px="xs" gap="xs" justify="space-between" wrap="nowrap">
            <Group gap="xs" wrap="nowrap">
              <IconHome size={20} stroke={1.5} style={{ flexShrink: 0 }} />
              <Text fw={600} size="sm" visibleFrom="xs" style={{ whiteSpace: "nowrap" }}>
                Kesk-Vaela 8
              </Text>
              {apartment && <ClearApartmentSelectionButton />}
            </Group>
            <Group gap="xs" wrap="nowrap">
              {apartment && (
                <Select
                  size="xs"
                  data={selectablePeriods()}
                  placeholder="Periood"
                  value={selectedPeriod || ""}
                  onChange={(value) => setSelectedPeriod(value)}
                  allowDeselect={false}
                  styles={{ input: { width: 110 } }}
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
