// app/profile/[username]/page.tsx
import React from "react";

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

// Function to fetch Twitter profile data
async function fetchProfileData(username: string): Promise<ProfileData | null> {
  const res = await fetch(
    `https://api.twitter.com/2/users/by/username/${username}?user.fields=id,name,username,description,location,url,profile_image_url,protected,verified,created_at,public_metrics,pinned_tweet_id`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.data || null;
}

// Profile page component with server-side data fetching
export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await fetchProfileData(params.username);

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="text-white">
      <h1>{profile.name}</h1>
      <p>ID: {profile.id}</p>
      <p>Username: @{profile.username}</p>
      <p>Description: {profile.description || "No description available"}</p>
      <p>Location: {profile.location || "No location available"}</p>
      <p>
        URL:{" "}
        {profile.url ? (
          <a href={profile.url} target="_blank" rel="noopener noreferrer">
            {profile.url}
          </a>
        ) : (
          "No URL available"
        )}
      </p>
      <p>
        Profile Image:
        {profile.profile_image_url ? (
          <img
            src={profile.profile_image_url}
            alt={`${profile.name}'s profile`}
            width="100"
            height="100"
          />
        ) : (
          "No profile image available"
        )}
      </p>
      <p>Protected: {profile.protected ? "Yes" : "No"}</p>
      <p>Verified: {profile.verified ? "Yes" : "No"}</p>
      <p>
        Account Created:{" "}
        {profile.created_at
          ? new Date(profile.created_at).toLocaleDateString()
          : "Date not available"}
      </p>
      <p>Pinned Tweet ID: {profile.pinned_tweet_id || "No pinned tweet"}</p>

      {profile.public_metrics ? (
        <>
          <p>Followers Count: {profile.public_metrics.followers_count}</p>
          <p>Following Count: {profile.public_metrics.following_count}</p>
          <p>Tweet Count: {profile.public_metrics.tweet_count}</p>
          <p>Listed Count: {profile.public_metrics.listed_count}</p>
        </>
      ) : (
        <p>Public metrics not available</p>
      )}
    </div>
  );
}
