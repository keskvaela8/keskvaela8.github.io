import { useQuery } from "@tanstack/react-query";
import { PeriodData } from "./models/models";

export function usePeriodData(period: string | null) {
  return useQuery<PeriodData, Error>({
    enabled: !!period && period !== null && period.length > 0,
    queryKey: ["periodData", period],
    queryFn: async () => (await fetch(`/data/${period}.json`)).json(),
  });
}
