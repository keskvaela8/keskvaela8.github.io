import { Apartment, Period } from "@/app/models/models";
import { useAppState } from "@/app/state/useAppState";
import { generatePain001, getBicFromIban } from "@/app/util/paymentUtil";
import { Button, Text, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";

interface PaymentExportFormProps {
  apartment: Apartment;
  period: Period;
}

export default function PaymentExportForm({
  apartment,
  period,
}: PaymentExportFormProps) {
  const {
    payerName,
    payerIBAN,
    payerBIC,
    setPayerName,
    setPayerIBAN,
    setPayerBIC,
  } = useAppState();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: payerName || "",
      iban: payerIBAN || "",
      bic: payerBIC || "",
    },
    validate: {
      name: isNotEmpty("Maksja nimi on nõutud"),
      iban: isNotEmpty("Maksja IBAN on nõutud"),
      bic: isNotEmpty("Maksja BIC on nõutud"),
    },
  });
  const [bicAdded, setBicAdded] = useState(false);
  form.watch("iban", ({ value }) => {
    if (value.length > 5 && value.startsWith("EE")) {
      const bic = getBicFromIban(value);
      if (bic) {
        form.setFieldValue("bic", bic);
        setBicAdded(true);
      }
      if (!bic && bicAdded) {
        form.resetField("bic");
        setBicAdded(false);
      }
    } else if (bicAdded) {
      form.resetField("bic");
      setBicAdded(false);
    }
  });

  const handleSubmit = (values: typeof form.values) => {
    if (!values.iban || !values.bic || !values.name) {
      alert("Maksete importimiseks tuleb täita kõik väljad!");
      return;
    }
    setPayerName(values.name);
    setPayerIBAN(values.iban);
    setPayerBIC(values.bic);
    const xml = generatePain001(
      apartment.consumables,
      values.iban,
      values.bic,
      values.name
    );
    const blob = new Blob([xml], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Kesk-Vaela_8-${apartment.number}_${period.start
      .toString()
      .substring(0, 7)}.xml`;
    link.click();
  };

  return (
    <>
      <Text mt="md" fw={700}>
        Impordi maksed (xml failina)
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="md"
          label="Maksja nimi"
          placeholder="Maksja nimi"
          {...form.getInputProps("name")}
        />
        <TextInput
          mt="md"
          label="Maksja IBAN"
          placeholder="Maksja IBAN"
          {...form.getInputProps("iban")}
        />
        <TextInput
          mt="md"
          label="Maksja BIC"
          placeholder="Maksja BIC"
          {...form.getInputProps("bic")}
        />
        <Button type="submit" mt="md">
          Lae maksete XML alla
        </Button>
      </form>
    </>
  );
}
