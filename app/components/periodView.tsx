import { Center, Grid, Loader } from "@mantine/core";
import { useAppState } from "../state/useAppState";
import { usePeriodData } from "../queries";
import { ApartmentSelectionView } from "./apartmentSelectionView";
import { Text } from "@mantine/core";
import { Apartment } from "../models/models";
import PeriodGeneralView from "./periodGeneralDetails";
import PaymentSection from "./payment/paymentSection";

export default function PeriodView() {
  const { apartment, selectedPeriod } = useAppState();
  const { data: periodData, isFetching: isPeriodDataLoading } =
    usePeriodData(selectedPeriod);
  if (!apartment || apartment.length === 0) {
    return <ApartmentSelectionView />;
  }
  if (isPeriodDataLoading) {
    return (
      <Center>
        <Loader type="dots" />
      </Center>
    );
  }
  if (!periodData) {
    return <Text>Andmed perioodi kohta puuduvad.</Text>;
  }
  const apartmentData: Apartment | undefined = periodData?.apartments.find(
    (a) => a.number === apartment
  );
  if (!apartmentData) {
    return <Text>Valitud korteri andmed puuduvad.</Text>;
  }

  return (
    <Grid p="md" grow>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <PeriodGeneralView
          apartment={apartmentData}
          period={periodData.period}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <PaymentSection apartment={apartmentData} />
      </Grid.Col>
    </Grid>
  );
}
