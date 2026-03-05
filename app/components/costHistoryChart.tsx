import { useState } from "react";
import { Paper, SegmentedControl, Title, Group, Loader, Center, Text } from "@mantine/core";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMultiplePeriodData } from "../queries";
import { ConsumableLabel } from "../models/models";
import { selectablePeriods } from "../util/selectablePeriods";
import { formatNumber } from "../util/numberUtil";
import { consumableConfig } from "./periodGeneralDetails";
import { IconChartBar } from "@tabler/icons-react";

interface CostHistoryChartProps {
  apartment: string;
  currentPeriod: string;
}

const TOTAL_LABEL = "Kokku";

const RANGE_OPTIONS = [
  { label: "3k", value: "3" },
  { label: "6k", value: "6" },
  { label: "13k", value: "13" },
];

export default function CostHistoryChart({
  apartment,
  currentPeriod,
}: CostHistoryChartProps) {
  const [range, setRange] = useState("6");
  const allPeriods = selectablePeriods();
  const currentIndex = allPeriods.indexOf(currentPeriod);
  const available =
    currentIndex >= 0 ? allPeriods.slice(currentIndex) : allPeriods.slice();
  const periodsToShow = available.slice(0, Number(range)).reverse();

  const results = useMultiplePeriodData(periodsToShow);

  const isLoading = results.some((r) => r.isLoading);
  const hasData = results.some((r) => r.data);

  if (isLoading) {
    return (
      <Paper withBorder radius="md" p="md">
        <Center py="xl">
          <Loader type="dots" size="sm" />
        </Center>
      </Paper>
    );
  }

  if (!hasData) return null;

  const series = Object.values(ConsumableLabel).map((label) => {
    const config = consumableConfig[label];
    return { name: config.label, color: config.chartColor };
  });

  const chartData = periodsToShow.map((period, i) => {
    const periodData = results[i]?.data;
    const apt = periodData?.apartments.find((a) => a.number === apartment);
    const entry: Record<string, string | number> = {
      month: formatPeriodLabel(period),
    };
    let total = 0;
    for (const label of Object.values(ConsumableLabel)) {
      const config = consumableConfig[label];
      const consumable = apt?.consumables.find((c) => c.label === label);
      const value = consumable
        ? Math.round(consumable.total.payable.value * 100) / 100
        : 0;
      entry[config.label] = value;
      total += value;
    }
    entry[TOTAL_LABEL] = Math.round(total * 100) / 100;
    return entry;
  });

  const allZero = chartData.every(
    (d) => (d[TOTAL_LABEL] as number) === 0
  );

  return (
    <Paper withBorder radius="md" p="md">
      <Group gap="xs" mb="md" justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <IconChartBar size={20} stroke={1.5} />
          <Title order={4}>Kulude ajalugu</Title>
        </Group>
        <SegmentedControl
          size="xs"
          data={RANGE_OPTIONS}
          value={range}
          onChange={setRange}
        />
      </Group>
      {allZero ? (
        <Text c="dimmed" size="sm" ta="center" py="md">
          Varasemad andmed puuduvad
        </Text>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--mantine-color-text)" }} />
            <YAxis tick={{ fontSize: 12, fill: "var(--mantine-color-text)" }} />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${formatNumber(value)}\u20AC`,
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
            <Legend content={renderLegend} />
            {series.map((s) => (
              <Bar
                key={s.name}
                dataKey={s.name}
                fill={s.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
            <Line
              type="monotone"
              dataKey={TOTAL_LABEL}
              stroke="#868e96"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

function renderLegend({ payload }: { payload?: { value: string; color?: string; type?: string }[] }) {
  if (!payload) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        flexWrap: "wrap",
        fontSize: 12,
      }}
    >
      {payload.map((entry) => (
        <span
          key={entry.value}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "var(--mantine-color-text)",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: entry.type === "line" ? "50%" : 2,
              backgroundColor: entry.color,
              display: "inline-block",
            }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("_");
  const months = [
    "jaan",
    "veebr",
    "märts",
    "apr",
    "mai",
    "juuni",
    "juuli",
    "aug",
    "sept",
    "okt",
    "nov",
    "dets",
  ];
  return `${months[Number(month) - 1]} ${year.slice(2)}`;
}
