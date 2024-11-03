"use client";

import { ImCheckmark } from "react-icons/im";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (username) {
      router.push(`/profile/${username}`);
    }
  };

  return (
    <>
      <p className="text-white ml-20 bg-[#2C2C2C] py-2 px-4 max-w-[300px] rounded-2xl text-sm">
        Welcome to your world of Online presence
      </p>
      <p className="text-white text-4xl px-20 pt-5">
        Track Your Social Pulse...
      </p>
      <p className="text-white ml-20 pt-2 text-sm">
        Monitoring your online presence is crucial in todays digital landscape.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your handle"
          className="ml-20 my-10 py-2 px-4 rounded-2xl text-sm w-[280px] bg-[#2C2C2C] text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
        className="bg-white text-black mx-4 px-4 py-2 rounded-2xl text-sm"
        type="submit"
      >
        twitter
      </button>
      </form>
      
      <div className="flex flex-row text-white text-sm ml-20">
        <ImCheckmark className="mr-2 text-[#09846E]" />
        <p className="mr-6">Online Influence</p>
        <ImCheckmark className="mr-2 text-[#09846E]" />
        <p className="mr-6">Social Insigths</p>
        <ImCheckmark className="mr-2 text-[#09846E]" />
        <p className="mr-6">Social Metrics</p>
        <ImCheckmark className="mr-2 text-[#09846E]" />
        <p>Digital Engagement</p>
      </div>
    </>
  );
}
