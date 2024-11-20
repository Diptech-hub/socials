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
      // cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Error fetching profile data:", await res.json());
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
    <div className="text-white p-6 max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg mb-8">
      <div className="flex items-center space-x-4">
        {profile.profile_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profile_image_url}
            alt={`${profile.name}'s profile`}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-lg">@{profile.username}</p>
          <p className="mt-2 text-sm text-gray-400">
            {profile.description || "No description available"}
          </p>
        </div>
      </div>

      <div className="flex justify-between px-6 pb-4 mt-4 text-sm text-gray-300">
        <p>Location: {profile.location || "N/A"}</p>
        {profile.url && (
          <p>
            URL:{" "}
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {profile.url}
            </a>
          </p>
        )}
        <p>
          Account Created:{" "}
          {profile.created_at
            ? new Date(profile.created_at).toLocaleDateString()
            : "Date not available"}
        </p>
      </div>

      <div className="mt-8 px-6 grid grid-cols-4 gap-4">
        {profile.public_metrics ? (
          <>
            <p className="bg-blue-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-blue-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Followers</span>
              <br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.followers_count}
              </span>
            </p>

            <p className="bg-green-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-green-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Following</span>
              <br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.following_count}
              </span>
            </p>

            <p className="bg-purple-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-purple-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Tweets</span>
              <br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.tweet_count}
              </span>
            </p>

            <p className="bg-yellow-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-yellow-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Listed</span>
              <br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.listed_count}
              </span>
            </p>
          </>
        ) : (
          <p className="col-span-4 text-center bg-red-600 text-white py-4 rounded-lg">
            Public metrics not available
          </p>
        )}
      </div>
    </div>
  );
}
