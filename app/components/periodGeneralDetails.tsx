import { Paper, Title, Center, Text } from "@mantine/core";
import { Apartment, Consumable, Period } from "../models/models";
import { formatNumber } from "../util/numberUtil";
import { PieChart, PieChartCell } from "@mantine/charts";
import { formatDate } from "../util/dateUtil";

interface PeriodGeneralViewProps {
  apartment: Apartment;
  period: Period;
}

export default function PeriodGeneralView({
  apartment,
  period,
}: PeriodGeneralViewProps) {
  return (
    <Paper withBorder radius="md" p="md" mb="md">
      <Title order={2}>Perioodi ülevaade</Title>
      <Text>
        <strong>Valitud korter:</strong> {apartment.number}
      </Text>
      <Text>
        <strong>Periood:</strong> {getFormattedPeriod(period)}
      </Text>
      <Text>
        <strong>Kogukulu:</strong> {getConsumablesTotal(apartment.consumables)}
      </Text>
      <Center>
        <PieChart
          withTooltip
          withLabels
          size={250}
          data={getPieChartData(apartment.consumables)}
          labelsPosition="inside"
          valueFormatter={(value: number) => `${formatNumber(value)}€`}
          labelsType="value"
          tooltipDataSource="all"
          pieProps={{
            isAnimationActive: true,
          }}
        />
      </Center>
    </Paper>
  );
}

const getFormattedPeriod = (period: Period): string => {
  return `${formatDate(new Date(period.start))} - ${formatDate(
    new Date(period.end)
  )}`;
};

const getConsumablesTotal = (apartmentConsumables: Consumable[]): string => {
  const total = apartmentConsumables.reduce((total, consumable) => {
    return total + consumable.total.payable.value;
  }, 0);
  return `${formatNumber(total)}€`;
};

const getPieChartData = (
  apartmentConsumables: Consumable[]
): PieChartCell[] => {
  const water = apartmentConsumables.find((c) => c.label === "WATER");
  const electricity = apartmentConsumables.find(
    (c) => c.label === "ELECTRICITY"
  );
  const electricityNetwork = apartmentConsumables.find(
    (c) => c.label === "ELECTRICITY_NETWORK"
  );
  return [
    {
      value: water ? water.total.payable.value : 0,
      name: "Vesi",
      color: "rgba(182, 215, 168, 1)",
    },
    {
      value: electricity ? electricity.total.payable.value : 0,
      name: "Elekter",
      color: "rgba(207, 226, 243, 1)",
    },
    {
      value: electricityNetwork ? electricityNetwork.total.payable.value : 0,
      name: "Võrgutasu",
      color: "rgba(255, 242, 204, 1)",
    },
  ];
};
