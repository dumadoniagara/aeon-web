"use client";

import React from "react";

interface Transaction {
  date: string;
  referenceId: string;
  to: string;
  transactionType: string;
  amount: string;
}

interface Props {
  data: Transaction[];
}

const TransactionTable: React.FC<Props> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-gray-800 border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-3 font-medium rounded-tl-lg">Date</th>
            <th className="px-4 py-3 font-medium">Reference ID</th>
            <th className="px-4 py-3 font-medium">To</th>
            <th className="px-4 py-3 font-medium">Transaction Type</th>
            <th className="px-4 py-3 font-medium rounded-tr-lg">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((tx) => (
            <tr key={tx.referenceId + tx.date} className="hover:bg-gray-50">
              <td className="px-4 py-3">{tx.date}</td>
              <td className="px-4 py-3">{tx.referenceId}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{tx.to}</div>
                <div className="text-xs text-gray-500">
                  Recipient references will go here
                </div>
              </td>
              <td className="px-4 py-3">{tx.transactionType}</td>
              <td className="px-4 py-3">{tx.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
