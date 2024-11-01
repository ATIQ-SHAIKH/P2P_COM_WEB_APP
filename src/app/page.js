"use client"

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
    const timerId = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <nav className="bg-gray-800 p-4 flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Memo Meet Logo"
            width={40}
            height={40}
          />
          <span className="ml-2 text-white text-lg font-bold">Memo Meet v1.0</span>
        </div>

        {/* Clock and Date on the far right */}
        <div className="text-white text-sm text-right">
          <div>{time}</div>
          <div>{date}</div>
        </div>
      </nav>

      <main className="flex flex-col sm:flex-row gap-8 row-start-2 items-center sm:items-center px-4 mt-6">
        <Image
          src="/landing_page_image.svg"
          alt="An image of two people in a meeting"
          width={600}
          height={600}
        />
        <div className="flex flex-col max-w-md text-center sm:text-left sm:ml-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Memo Meet</h1>
          <p className="mt-4 text-gray-600">
            Connect and collaborate with your team effortlessly. Create meetings, share ideas, and stay productive with Memo Meet's powerful features designed for seamless communication.
          </p>
          <button className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500">
            Create a meeting!
          </button>
        </div>
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
