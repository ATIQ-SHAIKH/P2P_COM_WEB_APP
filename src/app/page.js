"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { checkSession } from "@/utils/auth";

export default function Home() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setTime(formattedTime);

      const options = { weekday: "short", day: "2-digit", month: "short" };
      const formattedDate = now.toLocaleDateString([], options);
      setDate(formattedDate);
    };

    updateTime();
    const timerId = setInterval(updateTime, 10000);
    // Check if the user is logged in
    const checkUserSession = async () => {
      const session = await checkSession();
      setLoggedIn(session); // Set the loggedIn state based on the result of checkSession
    };

    checkUserSession();
    return () => clearInterval(timerId);
  }, []);

  const router = useRouter();

  const handleStartMeetingClick = () => {
    router.push('/meet')
  }

  const handleSignInClick = () => {
    router.push('/signin');
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)] min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 flex flex-col">
      <nav className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Memo Meet Logo" width={40} height={40} />
          <span className="ml-2 text-white text-lg font-bold">Memo Meet</span>
        </div>

        <div className="text-white text-sm text-right">
          <div>{time}</div>
          <div>{date}</div>
        </div>
      </nav>

      <main className="flex flex-col sm:flex-row items-center justify-center flex-grow">
        {/* Image Section */}
        <div className="w-full sm:w-1/3 flex justify-center">
          <Image
            src="/landing_page_image.svg"
            alt="An image of two people in a meeting"
            width={500}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Text and Buttons Section */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-2/3 max-w-4xl text-center sm:text-left sm:ml-8 space-y-4">
          <h1 className="text-4xl font-bold text-white">Welcome to Memo Meet!</h1>
          <p className="mt-4 text-white block">
            Connect and collaborate with your team effortlessly. Create meetings, share ideas, and stay productive with Memo Meet's powerful features designed for seamless communication.
          </p>
          {loggedIn ? (
            <div className="w-full flex flex-col sm:flex-row items-center text-center sm:items-start gap-4">
              <button
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500"
                onClick={handleStartMeetingClick}
              >
                Create a new meeting!
              </button>
              {/* Separator */}
              <div className="hidden sm:block h-12 w-px bg-gray-300"></div>
              <div className="flex w-full sm:w-auto gap-2">
                <input type="text"
                  className="w-full sm:w-72 h-12 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Enter meeting code..."
                ></input>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-500">
                  Join!
                </button>
              </div>
            </div>

          ) : (
            <button
              className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500"
              onClick={handleSignInClick}
            >
              Get Started!
            </button>
          )}
        </div>
      </main>

    </div>


  );
}
