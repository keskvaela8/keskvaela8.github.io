"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppState } from "./state/useAppState";
import { AppShell, Group, Select } from "@mantine/core";
import { ClearApartmentSelectionButton } from "./components/clearApartmentSelectionButton";
import { ColorSchemeToggle } from "./components/colorSchemeToggle";
import PeriodView from "./components/periodView";
import { selectablePeriods } from "./util/selectablePeriods";

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
      <AppShell header={{ height: 50 }} padding="md">
        <AppShell.Header>
          <Group h="100%" gap="xs" justify="space-between">
            {apartment && <ClearApartmentSelectionButton />}
            {apartment && (
              <Select
                data={selectablePeriods()}
                placeholder="Vali periood"
                value={selectedPeriod || ""}
                onChange={(value) => setSelectedPeriod(value)}
                allowDeselect={false}
              ></Select>
            )}
            <ColorSchemeToggle />
          </Group>
        </AppShell.Header>
        <AppShell.Main>
          <PeriodView />
        </AppShell.Main>
      </AppShell>
    </QueryClientProvider>
  );
}
