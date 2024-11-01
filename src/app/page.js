"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time as "HH:MM"
      const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setTime(formattedTime);

      // Format date as "Day, DD Mon"
      const options = { weekday: "short", day: "2-digit", month: "short" };
      const formattedDate = now.toLocaleDateString([], options);
      setDate(formattedDate);
    };

    updateTime();
    const timerId = setInterval(updateTime, 10000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] h-screen"> {/* Set full height */}
      <nav className="p-4 flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Memo Meet Logo"
            width={40}
            height={40}
          />
          <span className="ml-2 text-white text-lg font-bold">Memo Meet</span>
        </div>

        {/* Clock and Date on the far right */}
        <div className="text-white text-sm text-right">
          <div>{time}</div>
          <div>{date}</div>
        </div>
      </nav>

      <main className="flex flex-col sm:flex-row items-center justify-center h-fit"> {/* Adjust flexbox properties */}
        {/* Image: 50% width */}
        <div className="w-full sm:w-1/2 flex "> {/* Center image */}
          <Image
            src="/landing_page_image.svg"
            alt="An image of two people in a meeting"
            width={700}
            height={500}
            className="object-contain"
          />
        </div>

        {/* Text content: 50% width */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-1/2 max-w-md text-center sm:text-left sm:ml-8">
          <h1 className="text-6xl font-bold text-gray-800">Welcome to Memo Meet :)</h1>
          <p className="mt-4 text-gray-600">
            Connect and collaborate with your team effortlessly. Create meetings, share ideas, and stay productive with Memo Meet's powerful features designed for seamless communication.
          </p>
              <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
                Create a meeting!
              </button>
        </div>
      </main>
    </div>
  );
}
