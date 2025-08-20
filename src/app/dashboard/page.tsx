"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import TransactionTable from "@/components/transaction-table";

interface JwtPayload {
    exp: number;
    iat?: number;
    sub?: string;
    iss?: string;
    aud?: string;
}

interface Transaction {
    date: string;
    referenceId: string;
    to: string;
    transactionType: string;
    amount: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingData, setLoadingData] = useState(true);



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }
    
        const decoded = jwt.decode(token) as JwtPayload | null;
    
        if (!decoded || decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }
    
        setLoading(false);
      }, [router]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const res = await fetch("/api/transaction-history");
            const data = await res.json();
            setTransactions(data);
            setLoadingData(false);
        };
        fetchTransactions();
    }, []);

    const onLogout = () => {
        localStorage.removeItem('token');
        router.replace("/login");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="px-6 py-6 max-w-5xl mx-auto">
            <div className="flex flex-row justify-between">
                <div className="text-xl text-gray-300">Dashboard</div>
                <button className="cursor-pointer bg-blue-500 h-12 text-white px-4 py-4 w-[125px] rounded-2xl" onClick={() => onLogout()}>Logout</button>
            </div>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
                {loadingData ? <p>Loading...</p> : <TransactionTable data={transactions} />}
            </div>
        </div>
    )
}
