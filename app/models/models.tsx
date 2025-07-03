export interface PeriodData {
  period: Period;
  apartments: Apartment[];
}

export interface Apartment {
  number: string;
  consumables: Consumable[];
}

export interface Consumable {
  label: ConsumableLabel;
  dueDate: string;
  total: Total;
  consumptions: Consumption[];
  prices: Consumption[];
  paymentRequisites: PaymentRequisite[];
}

export interface Consumption {
  label: string;
  value: number;
  unit: string;
}

export enum ConsumableLabel {
  Electricity = "ELECTRICITY",
  ElectricityNetwork = "ELECTRICITY_NETWORK",
  Water = "WATER",
}

export interface PaymentRequisite {
  label: string;
  value: string;
}

export interface Total {
  consumed: Consumed;
  payable: Consumed;
}

export interface Consumed {
  value: number;
  unit: string;
}

export interface Period {
  start: Date;
  end: Date;
}
