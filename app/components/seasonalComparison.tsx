import {
  Card,
  Group,
  Loader,
  Center,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { usePeriodData } from "../queries";
import { Consumable, ConsumableLabel } from "../models/models";
import { formatNumber } from "../util/numberUtil";
import { consumableConfig } from "./periodGeneralDetails";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconEqual,
  IconCalendarStats,
} from "@tabler/icons-react";

interface SeasonalComparisonProps {
  apartment: string;
  currentPeriod: string;
}

function getPreviousYearPeriod(period: string): string | null {
  const [yearStr, month] = period.split("_");
  const prevYear = Number(yearStr) - 1;
  if (prevYear < 2025) return null;
  return `${prevYear}_${month}`;
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("_");
  const months = [
    "jaan", "veebr", "märts", "apr", "mai", "juuni",
    "juuli", "aug", "sept", "okt", "nov", "dets",
  ];
  return `${months[Number(month) - 1]} ${year}`;
}

function ChangeIndicator({ current, previous }: { current: number; previous: number }) {
  if (previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  const absChange = Math.abs(change);

  if (absChange < 0.5) {
    return (
      <Group gap={2}>
        <IconEqual size={14} color="gray" />
        <Text size="xs" c="dimmed">0%</Text>
      </Group>
    );
  }

  const isUp = change > 0;
  return (
    <Group gap={2}>
      {isUp ? (
        <IconArrowUpRight size={14} color="var(--mantine-color-red-6)" />
      ) : (
        <IconArrowDownRight size={14} color="var(--mantine-color-teal-6)" />
      )}
      <Text size="xs" c={isUp ? "red" : "teal"} fw={500}>
        {isUp ? "+" : "−"}{formatNumber(absChange)}%
      </Text>
    </Group>
  );
}

const UNIT_PRICE_LABELS: Record<ConsumableLabel, string> = {
  [ConsumableLabel.Water]: "WATER_FEE",
  [ConsumableLabel.Electricity]: "ELECTRICITY_FEE",
  [ConsumableLabel.ElectricityNetwork]: "ELECTRICITY_NETWORK_FEE",
};

function getUnitPrice(consumable: Consumable): { value: number; unit: string } | null {
  const priceLabel = UNIT_PRICE_LABELS[consumable.label];
  const price = consumable.prices.find((p) => p.label === priceLabel);
  if (!price || price.value === 0) return null;
  return { value: price.value, unit: price.unit };
}

export default function SeasonalComparison({
  apartment,
  currentPeriod,
}: SeasonalComparisonProps) {
  const prevPeriod = getPreviousYearPeriod(currentPeriod);
  const { data: prevData, isFetching } = usePeriodData(prevPeriod);

  if (!prevPeriod) return null;
  if (isFetching) {
    return (
      <Paper withBorder radius="md" p="md">
        <Center py="xl">
          <Loader type="dots" size="sm" />
        </Center>
      </Paper>
    );
  }
  if (!prevData) return null;

  const prevApt = prevData.apartments.find((a) => a.number === apartment);
  if (!prevApt) return null;

  const currentLabel = formatPeriodLabel(currentPeriod);
  const prevLabel = formatPeriodLabel(prevPeriod);

  return (
    <Paper withBorder radius="md" p="md">
      <Group gap="xs" mb="md">
        <IconCalendarStats size={20} stroke={1.5} />
        <Title order={4}>Võrdlus: {currentLabel} vs {prevLabel}</Title>
      </Group>
      <SeasonalComparisonContent
        apartment={apartment}
        currentPeriod={currentPeriod}
        prevPeriod={prevPeriod}
        currentLabel={currentLabel}
        prevLabel={prevLabel}
      />
    </Paper>
  );
}

function SeasonalComparisonContent({
  apartment,
  currentPeriod,
  prevPeriod,
  currentLabel,
  prevLabel,
}: {
  apartment: string;
  currentPeriod: string;
  prevPeriod: string;
  currentLabel: string;
  prevLabel: string;
}) {
  const { data: currentData } = usePeriodData(currentPeriod);
  const { data: prevData } = usePeriodData(prevPeriod);

  const currentApt = currentData?.apartments.find((a) => a.number === apartment);
  const prevApt = prevData?.apartments.find((a) => a.number === apartment);

  if (!currentApt || !prevApt) return null;

  const currentTotal = currentApt.consumables.reduce(
    (sum, c) => sum + c.total.payable.value, 0
  );
  const prevTotal = prevApt.consumables.reduce(
    (sum, c) => sum + c.total.payable.value, 0
  );

  const chartData = Object.values(ConsumableLabel).map((label) => {
    const config = consumableConfig[label];
    const curr = currentApt.consumables.find((c) => c.label === label);
    const prev = prevApt.consumables.find((c) => c.label === label);
    return {
      name: config.label,
      [currentLabel]: curr ? Math.round(curr.total.payable.value * 100) / 100 : 0,
      [prevLabel]: prev ? Math.round(prev.total.payable.value * 100) / 100 : 0,
      color: config.chartColor,
    };
  });

  chartData.push({
    name: "Kokku",
    [currentLabel]: Math.round(currentTotal * 100) / 100,
    [prevLabel]: Math.round(prevTotal * 100) / 100,
    color: "#868e96",
  });

  return (
    <Stack gap="md">
      <Stack gap="xs">
        {Object.values(ConsumableLabel).map((label) => {
          const config = consumableConfig[label];
          const curr = currentApt.consumables.find((c) => c.label === label);
          const prev = prevApt.consumables.find((c) => c.label === label);
          if (!curr || !prev) return null;
          const Icon = config.icon;
          return (
            <Card withBorder radius="md" padding="sm" key={label}>
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon variant="light" color={config.color} size="md" radius="md">
                    <Icon size={16} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>{config.label}</Text>
                    <Text size="xs" c="dimmed">
                      {formatNumber(prev.total.payable.value)}€ → {formatNumber(curr.total.payable.value)}€
                    </Text>
                  </Stack>
                </Group>
                <ChangeIndicator
                  current={curr.total.payable.value}
                  previous={prev.total.payable.value}
                />
              </Group>
              {curr.total.consumed.unit === prev.total.consumed.unit && (
                <Group mt={4} ml={44} gap="xs">
                  <Text size="xs" c="dimmed">
                    Tarbimine: {formatNumber(prev.total.consumed.value)} → {formatNumber(curr.total.consumed.value)} {curr.total.consumed.unit}
                  </Text>
                  <ChangeIndicator
                    current={curr.total.consumed.value}
                    previous={prev.total.consumed.value}
                  />
                </Group>
              )}
              {(() => {
                const currPrice = getUnitPrice(curr);
                const prevPrice = getUnitPrice(prev);
                if (!currPrice || !prevPrice) return null;
                return (
                  <Group mt={2} ml={44} gap="xs">
                    <Text size="xs" c="dimmed">
                      Ühikuhind: {formatNumber(prevPrice.value)} → {formatNumber(currPrice.value)} {currPrice.unit}
                    </Text>
                    <ChangeIndicator current={currPrice.value} previous={prevPrice.value} />
                  </Group>
                );
              })()}
            </Card>
          );
        })}

        <Card withBorder radius="md" padding="sm" bg="var(--mantine-primary-color-light)">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={0}>
              <Text size="sm" fw={600}>Kokku</Text>
              <Text size="xs" c="dimmed">
                {formatNumber(prevTotal)}€ → {formatNumber(currentTotal)}€
              </Text>
            </Stack>
            <ChangeIndicator current={currentTotal} previous={prevTotal} />
          </Group>
        </Card>
      </Stack>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--mantine-color-text)" }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--mantine-color-text)" }} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${formatNumber(value)}€`,
              name,
            ]}
            contentStyle={{
              backgroundColor: "var(--mantine-color-body)",
              borderColor: "var(--mantine-color-default-border)",
              borderRadius: 8,
              color: "var(--mantine-color-text)",
            }}
            labelStyle={{ color: "var(--mantine-color-text)" }}
            itemStyle={{ color: "var(--mantine-color-text)" }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--mantine-color-text)", fontSize: 12 }}>{value}</span>
            )}
          />
          <Bar dataKey={prevLabel} fill="#868e96" opacity={0.5} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.4} />
            ))}
          </Bar>
          <Bar dataKey={currentLabel} radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Stack>
  );
}
