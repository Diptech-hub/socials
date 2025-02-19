"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProfileData {
  id: string;
  name: string;
  username: string;
  description?: string;
  location?: string;
  url?: string;
  profile_image_url?: string;
  protected?: boolean;
  verified?: boolean;
  created_at?: string;
  pinned_tweet_id?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfileData() {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/twitter-profile?username=${params.username}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
        setLoading(false);
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    fetchProfileData();
  }, [params.username]);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profile) return <p className="text-center text-white">Profile not found.</p>;

  // Prepare data for Recharts
  const chartData = profile.public_metrics
    ? [
        { name: "Followers", value: profile.public_metrics.followers_count },
        { name: "Following", value: profile.public_metrics.following_count },
        { name: "Tweets", value: profile.public_metrics.tweet_count },
        { name: "Listed", value: profile.public_metrics.listed_count },
      ]
    : [];

  return (
    <div className="text-white p-6 max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg mb-8">
      <div className="flex items-center space-x-4">
        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={`${profile.name}'s profile`}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-lg">@{profile.username}</p>
          <p className="mt-2 text-sm text-gray-400">{profile.description || "No description available"}</p>
        </div>
      </div>

      <div className="flex justify-between px-6 pb-4 mt-4 text-sm text-gray-300">
        <p>Location: {profile.location || "N/A"}</p>
        {profile.url && (
          <p>
            URL:{" "}
            <a href={profile.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {profile.url}
            </a>
          </p>
        )}
        <p>
          Account Created: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Date not available"}
        </p>
      </div>

      <div className="mt-8 px-6 grid grid-cols-4 gap-4">
        {profile.public_metrics ? (
          <>
            <p className="bg-blue-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-blue-900 transition">
              <span className="text-2xl font-semibold">Followers</span>
              <br />
              <span className="text-lg font-bold">{profile.public_metrics.followers_count}</span>
            </p>
            <p className="bg-green-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-green-900 transition">
              <span className="text-2xl font-semibold">Following</span>
              <br />
              <span className="text-lg font-bold">{profile.public_metrics.following_count}</span>
            </p>
            <p className="bg-purple-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-purple-900 transition">
              <span className="text-2xl font-semibold">Tweets</span>
              <br />
              <span className="text-lg font-bold">{profile.public_metrics.tweet_count}</span>
            </p>
            <p className="bg-yellow-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-yellow-900 transition">
              <span className="text-2xl font-semibold">Listed</span>
              <br />
              <span className="text-lg font-bold">{profile.public_metrics.listed_count}</span>
            </p>
          </>
        ) : (
          <p className="col-span-4 text-center bg-red-600 text-white py-4 rounded-lg">
            Public metrics not available
          </p>
        )}
      </div>

      {/* Recharts Graph */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-4">Graphical Representation</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center bg-red-600 text-white py-4 rounded-lg">No data available for graphical representation</p>
        )}
      </div>
    </div>
  );
}
