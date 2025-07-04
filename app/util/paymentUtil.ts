import rawBankIdentificationCodes from "../../public/bank_identification_codes.json";
import { Consumable } from "../models/models";
import { create } from "xmlbuilder2";
import { formatEuropeanDateToISO } from "./dateUtil";

const bankIdentificationCodesMap = (
  array: { identifier: string; name: string; bic: string }[]
) => {
  const map: { [key: string]: { name: string; bic: string } } = {};
  array.forEach(({ identifier, name, bic }) => {
    map[identifier] = { name, bic };
  });
  return map;
};

const getBankInfoFromIban = (
  iban: string
): { name: string; bic: string } | undefined => {
  const ibanIdentifier = iban.slice(4, 6);
  const bankInfo = bankIdentificationCodesMap(rawBankIdentificationCodes)[
    ibanIdentifier
  ];
  if (bankInfo) {
    return bankInfo;
  }
  return undefined;
};

export const getBicFromIban = (iban: string): string | undefined => {
  const bankInfo = getBankInfoFromIban(iban);
  if (bankInfo) {
    return bankInfo.bic;
  }
  return undefined;
};

export const generatePain001 = (
  consumables: Consumable[],
  iban: string,
  bic: string,
  payerName: string
): string => {
  const time = new Date().toISOString().replace("Z", "");
  const ctrlSum = consumables
    .reduce((sum, c) => sum + c.total.payable.value, 0)
    .toFixed(2);
  const msgId = `MSG-${time
    .replace("T", "")
    .replace(/:/g, "")
    .replace(/-/g, "")
    .replace(".", "")}`; // Unique message ID per payer
  let doc = create({ version: "1.0", encoding: "UTF-8" })
    .ele("Document", {
      xmlns: "urn:iso:std:iso:20022:tech:xsd:pain.001.001.09",
    })
    .ele("CstmrCdtTrfInitn")
    .ele("GrpHdr")
    .ele("MsgId")
    .txt(msgId) // Unique message ID per payer
    .up() //MsgId
    .ele("CreDtTm")
    .txt(time) // Creation time
    .up() // CreDtTm
    .ele("NbOfTxs")
    .txt(consumables.length.toString()) // Number of transactions
    .up() // NbOfTxs
    .ele("CtrlSum")
    .txt(ctrlSum) // Total amount of all transactions
    .up() // CtrlSum
    .ele("InitgPty")
    .up() // InitgPty
    .up(); // GrpHdr

  consumables.forEach((consumable, i) => {
    const receiverIbans = consumable.paymentRequisites
      .filter((r) => /^EE\d{6,}/.test(r.value))
      .map((r) => r.value);
    // find iban that matches the bank info of payer
    const receiverIban =
      receiverIbans.find((iban) => getBankInfoFromIban(iban)?.bic === bic) ||
      receiverIbans[0]; // Fallback to first IBAN if no match found
    if (!receiverIban) {
      console.warn(`No IBAN found for consumable ${consumable.label}`);
      return;
    }
    const bankInfo = getBankInfoFromIban(receiverIban);
    if (!bankInfo) {
      console.warn(`No bank info found for IBAN ${receiverIban}`);
      return;
    }
    const receiverName =
      consumable.paymentRequisites.find((r) => r.label === "RECEIVER")?.value ||
      "Unknown Receiver";
    const paymentId = i + 1;
    const amount = consumable.total.payable.value.toFixed(2);
    doc = doc
      .ele("PmtInf")
      .ele("PmtInfId")
      .txt(`PMTID${paymentId.toString().padStart(3, "0")}`) // PMTID001
      .up() // PmtInfId
      .ele("PmtMtd")
      .txt("TRF") // Transfer method
      .up() // PmtMtd
      .ele("NbOfTxs")
      .txt("1") // Number of transactions in this payment info
      .up() // NbOfTxs
      .ele("CtrlSum")
      .txt(amount) // Total amount for
      .up() // CtrlSum
      .ele("PmtTpInf")
      .ele("SvcLvl")
      .ele("Cd")
      .txt("SEPA") // Service level code
      .up() // Cd
      .up() // SvcLvl
      .up() // PmtTpInf
      .ele("ReqdExctnDt")
      .ele("Dt")
      .txt(formatEuropeanDateToISO(consumable.dueDate)) // Required execution date
      .up() // Dt
      .up() // ReqdExctnDt
      .ele("Dbtr")
      .ele("Nm")
      .txt(payerName) // Debtor name
      .up() // Nm
      .up() // Dbtr
      .ele("DbtrAcct")
      .ele("Id")
      .ele("IBAN")
      .txt(iban) // Your IBAN
      .up() // IBAN
      .up() // Id
      .ele("Ccy")
      .txt("EUR") // Currency
      .up() // Ccy
      .up() // DbtrAcct
      .ele("DbtrAgt")
      .ele("FinInstnId")
      .ele("BICFI")
      .txt(bic) // Your BIC
      .up() // BICFI
      .up() // FinInstnId
      .up() // DbtrAgt
      .ele("CdtTrfTxInf")
      .ele("PmtId")
      .ele("InstrId")
      .txt(paymentId.toString()) // Payment ID
      .up() // InstrId
      .ele("EndToEndId")
      .txt(paymentId.toString()) // End-to-end ID
      .up() // EndToEndId
      .up() // PmtId
      .ele("Amt")
      .ele("InstdAmt", { Ccy: "EUR" }) // Amount to be paid
      .txt(amount) // Amount to be paid
      .up() // InstdAmt
      .up() // Amt
      .ele("Cdtr")
      .ele("Nm")
      .txt(receiverName) // Creditor name
      .up() // Nm
      .up() // Cdtr
      .ele("CdtrAcct")
      .ele("Id")
      .ele("IBAN")
      .txt(receiverIban) // Creditor IBAN
      .up() // IBAN
      .up() // Id
      .up() // CdtrAcct
      .ele("RmtInf")
      .ele("Ustrd")
      .txt(
        consumable.paymentRequisites.find((r) => r.label === "BILL_NUMBER")
          ?.value || ""
      ) // Payment note
      .up() // Ustrd
      .ele("Strd")
      .ele("CdtrRefInf")
      .ele("Ref")
      .txt(
        consumable.paymentRequisites.find((r) => r.label === "REFERENCE_NUMBER")
          ?.value || ""
      ) // Reference number
      .up() // Ref
      .up() // CdtrRefInf
      .up() // Strd
      .up() // RmtInf
      .up() // CdtTrfTxInf
      .up(); // PmtInf
  });

  return doc
    .up() // CstmrCdtTrfInitn
    .up() // Document
    .end({ prettyPrint: true });
};
