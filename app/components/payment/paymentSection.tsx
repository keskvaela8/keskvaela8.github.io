import {
  Accordion,
  ActionIcon,
  CopyButton,
  Divider,
  Input,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { Apartment, Consumable } from "../../models/models";
import { formatNumber } from "../../util/numberUtil";
import useTranslation from "../useTranslation";
import { IconCheck, IconCopy } from "@tabler/icons-react";

interface PaymentSectionProps {
  apartment: Apartment;
}

export default function PaymentSection({ apartment }: PaymentSectionProps) {
  const { t } = useTranslation();
  const accordionItems = apartment.consumables.map((consumable: Consumable) => (
    <Accordion.Item value={t(consumable.label)} key={consumable.label}>
      <Accordion.Control>
        <Text fw={700}>{t(consumable.label)}</Text>{" "}
        <Text c="red">Tähtaeg {consumable.dueDate}</Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Divider />
        {copyableField({
          key: "sum",
          value: {
            label: "Summa",
            value: formatNumber(consumable.total.payable.value),
          },
          t,
        })}
        {consumable.paymentRequisites &&
          Object.entries(consumable.paymentRequisites).map(([key, value]) =>
            copyableField({ key, value, t })
          )}
      </Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <Paper withBorder radius="md" p="md" mb="md">
      <Title order={2}>Maksmine</Title>
      <Accordion>{accordionItems}</Accordion>
      <Text mt="md" fw={700}>
        Impordi maksed (xml failina) TBD
      </Text>
    </Paper>
  );
}

const copyableField = ({
  key,
  value,
  t,
}: {
  key: string;
  value: { label: string; value: string };
  t: (key: string) => string;
}) => {
  return (
    <Input.Wrapper label={t(value.label)} key={key} mt="xs">
      <Input
        key={key}
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
        mb="xs"
      />
    </Input.Wrapper>
  );
};
