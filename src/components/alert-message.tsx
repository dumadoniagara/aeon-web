"use client";
import { useEffect, useState } from "react";

interface AlertMessageProps {
  message: string;
  duration?: number;
}

export default function AlertMessage({ message, duration = 3000 }: AlertMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-lg bg-green-500 text-white px-4 py-2 shadow-md">
        {message}
      </div>
    </div>
  );
}
