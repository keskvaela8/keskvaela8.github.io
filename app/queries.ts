import { useQueries, useQuery } from "@tanstack/react-query";
import { PeriodData } from "./models/models";

export function usePeriodData(period: string | null) {
  return useQuery<PeriodData, Error>({
    enabled: !!period && period !== null && period.length > 0,
    queryKey: ["periodData", period],
    queryFn: async () => (await fetch(`/data/${period}.json`)).json(),
  });
}

export function useMultiplePeriodData(periods: string[]) {
  return useQueries({
    queries: periods.map((period) => ({
      queryKey: ["periodData", period],
      queryFn: async (): Promise<PeriodData> =>
        (await fetch(`/data/${period}.json`)).json(),
      retry: 0,
      refetchOnWindowFocus: false,
    })),
  });
}
