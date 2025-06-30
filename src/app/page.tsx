"use client";

import { ImCheckmark } from "react-icons/im";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (username) {
      setLoading(true);
      router.push(`/${username}`);
    }
  };


  return (
    <div className="flex flex-col items-center px-6 md:px-12 lg:px-20 text-center">
      <p className="text-white bg-[#2C2C2C] py-2 px-4 max-w-[300px] rounded-2xl text-sm mt-6 md:ml-0">
        Welcome to your world of Online presence
      </p>
      <p className="text-white text-3xl md:text-4xl pt-5">
        Track Your Social Pulse...
      </p>
      <p className="text-white pt-6 text-sm max-w-[600px]">
        Monitoring your online presence is crucial in today&apos;s digital landscape.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center mt-6">
        <input
          type="text"
          placeholder="Enter your handle"
          className="my-2 py-2 px-4 rounded-2xl text-sm w-full md:w-[280px] bg-[#2C2C2C] text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-white text-black px-4 py-2 rounded-2xl text-sm mt-2 md:mt-0 md:ml-4"
          type="submit"
        >
         {loading ? "Loading..." : "twitter"}
        </button>
      </form>
      <div className="grid grid-cols-2 md:flex md:flex-row text-white text-sm gap-4 mt-6">
        <div className="flex items-center">
          <ImCheckmark className="mr-2 text-[#09846E]" />
          <p>Online Influence</p>
        </div>
        <div className="flex items-center">
          <ImCheckmark className="mr-2 text-[#09846E]" />
          <p>Social Insights</p>
        </div>
        <div className="flex items-center">
          <ImCheckmark className="mr-2 text-[#09846E]" />
          <p>Social Metrics</p>
        </div>
        <div className="flex items-center">
          <ImCheckmark className="mr-2 text-[#09846E]" />
          <p>Digital Engagement</p>
        </div>
      </div>
    </div>
  );
}
