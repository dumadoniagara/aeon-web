import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      date: "24 Aug 2023",
      referenceId: "#84343434343432",
      to: "Bloom Enterprise Sdn Bhd",
      transactionType: "DuitNow payment",
      amount: "RM 1,200.00",
    },
    {
      date: "14 Jul 2023",
      referenceId: "#84343434343432",
      to: "Muhammad Andy Asrawi",
      transactionType: "DuitNow payment",
      amount: "RM 54,810.16",
    },
    {
      date: "12 Jul 2023",
      referenceId: "#84343434343432",
      to: "Utilities Company Sdn Bhd",
      transactionType: "DuitNow payment",
      amount: "RM 100.00",
    },
  ];

  return NextResponse.json(data);
}
