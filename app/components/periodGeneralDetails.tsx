import {
  Card,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { Apartment, Consumable, ConsumableLabel, Period } from "../models/models";
import { formatNumber } from "../util/numberUtil";
import { PieChart, PieChartCell } from "@mantine/charts";
import { formatDate } from "../util/dateUtil";
import {
  IconDroplet,
  IconBolt,
  IconPlug,
  IconCalendar,
} from "@tabler/icons-react";

interface PeriodGeneralViewProps {
  apartment: Apartment;
  period: Period;
}

export const consumableConfig: Record<
  ConsumableLabel,
  { label: string; color: string; icon: typeof IconDroplet; chartColor: string }
> = {
  [ConsumableLabel.Water]: {
    label: "Vesi",
    color: "teal",
    icon: IconDroplet,
    chartColor: "rgba(182, 215, 168, 1)",
  },
  [ConsumableLabel.Electricity]: {
    label: "Elekter",
    color: "blue",
    icon: IconBolt,
    chartColor: "rgba(207, 226, 243, 1)",
  },
  [ConsumableLabel.ElectricityNetwork]: {
    label: "Võrgutasu",
    color: "yellow",
    icon: IconPlug,
    chartColor: "rgba(255, 242, 204, 1)",
  },
};

export default function PeriodGeneralView({
  apartment,
  period,
}: PeriodGeneralViewProps) {
  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Group gap="xs" mb="md">
          <IconCalendar size={20} stroke={1.5} />
          <Title order={3}>{getFormattedPeriod(period)}</Title>
        </Group>
        <Card withBorder radius="md" bg="var(--mantine-primary-color-light)">
          <Text size="sm" c="dimmed" tt="uppercase" fw={600}>
            Kogukulu
          </Text>
          <Text size="xl" fw={700}>
            {getConsumablesTotal(apartment.consumables)}
          </Text>
        </Card>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Title order={4} mb="sm">
          Kulud
        </Title>
        <Stack gap="xs">
          {apartment.consumables.map((c) => {
            const config = consumableConfig[c.label];
            if (!config) return null;
            const Icon = config.icon;
            return (
              <Card withBorder radius="md" padding="sm" key={c.label}>
                <Group justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon
                      variant="light"
                      color={config.color}
                      size="md"
                      radius="md"
                    >
                      <Icon size={16} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>
                      {config.label}
                    </Text>
                  </Group>
                  <Text fw={600}>{formatNumber(c.total.payable.value)}€</Text>
                </Group>
              </Card>
            );
          })}
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Title order={4} mb="sm">
          Jaotus
        </Title>
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
    </Stack>
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
  return apartmentConsumables
    .map((c) => {
      const config = consumableConfig[c.label];
      if (!config) return null;
      return {
        value: c.total.payable.value,
        name: config.label,
        color: config.chartColor,
      };
    })
    .filter((x): x is PieChartCell => x !== null);
};
