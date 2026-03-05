import {
  Accordion,
  ActionIcon,
  Badge,
  CopyButton,
  Group,
  Input,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Apartment, Consumable, Period } from "../../models/models";
import { formatNumber } from "../../util/numberUtil";
import useTranslation from "../useTranslation";
import { IconCheck, IconCopy, IconCreditCard } from "@tabler/icons-react";
import PaymentExportForm from "./paymentExportForm";

interface PaymentSectionProps {
  apartment: Apartment;
  period: Period;
}

export default function PaymentSection({
  apartment,
  period,
}: PaymentSectionProps) {
  const { t } = useTranslation();
  const accordionItems = apartment.consumables.map((consumable: Consumable) => (
    <Accordion.Item value={t(consumable.label)} key={consumable.label}>
      <Accordion.Control>
        <Group justify="space-between" wrap="nowrap" pr="xs">
          <Text fw={600} size="sm">
            {t(consumable.label)}
          </Text>
          <Group gap="xs" wrap="nowrap">
            <Text fw={700} size="sm">
              {formatNumber(consumable.total.payable.value)}€
            </Text>
            <Badge
              variant="light"
              color={getDueDateColor(consumable.dueDate)}
              size="sm"
            >
              {consumable.dueDate}
            </Badge>
          </Group>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="xs">
          <CopyableField
            fieldKey="sum"
            value={{
              label: "Summa",
              value: formatNumber(consumable.total.payable.value),
            }}
            t={t}
          />
          {consumable.paymentRequisites &&
            Object.entries(consumable.paymentRequisites).map(([key, value]) => (
              <CopyableField fieldKey={key} key={key} value={value} t={t} />
            ))}
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Group gap="xs" mb="sm">
          <IconCreditCard size={20} stroke={1.5} />
          <Title order={3}>Maksmine</Title>
        </Group>
        <Accordion variant="separated" radius="md">
          {accordionItems}
        </Accordion>
      </Paper>
      <Paper withBorder radius="md" p="md">
        <PaymentExportForm apartment={apartment} period={period} />
      </Paper>
    </Stack>
  );
}

function getDueDateColor(dueDate: string): string {
  const [day, month, year] = dueDate.split(".");
  const due = new Date(Number(year), Number(month) - 1, Number(day));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "red";
  if (diffDays <= 3) return "orange";
  return "gray";
}

function CopyableField({
  fieldKey,
  value,
  t,
}: {
  fieldKey: string;
  value: { label: string; value: string };
  t: (key: string) => string;
}) {
  return (
    <Input.Wrapper label={t(value.label)} key={fieldKey}>
      <Input
        value={value.value}
        readOnly
        rightSectionPointerEvents="all"
        rightSection={
          <CopyButton value={value.value}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Kopeeritud" : "Kopeeri"}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? "teal" : "gray"}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        }
      />
    </Input.Wrapper>
  );
}
