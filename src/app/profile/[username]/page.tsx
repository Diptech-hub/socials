
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

interface TweetData {
  id: string;
  text: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
  };
  created_at: string;
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

// Function to fetch recent tweets by user ID
async function fetchRecentTweets(userId: string): Promise<TweetData[]> {
  const res = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?tweet.fields=public_metrics,created_at`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Error fetching tweets:", await res.json());
    return [];
  }

  const data = await res.json();
  return data.data || [];
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

  const tweets = await fetchRecentTweets(profile.id);

  // Check if tweets array is not empty before applying reduce
  const mostLikedTweet = tweets.length
    ? tweets.reduce((max, tweet) =>
        tweet.public_metrics.like_count > (max?.public_metrics.like_count || 0)
          ? tweet
          : max
      )
    : null;

  const mostCommentedTweet = tweets.length
    ? tweets.reduce((max, tweet) =>
        tweet.public_metrics.reply_count >
        (max?.public_metrics.reply_count || 0)
          ? tweet
          : max
      )
    : null;

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

      {/* <div className="mt-8 px-6 grid grid-cols-4 gap-4">
        {profile.public_metrics ? (
          <>
            <p>Followers Count {profile.public_metrics.followers_count}</p>
            <p>Following Count {profile.public_metrics.following_count}</p>
            <p>Tweets Count {profile.public_metrics.tweet_count}</p>
            <p>Listed Count {profile.public_metrics.listed_count}</p>
          </>
        ) : (
          <p>Public metrics not available</p>
        )}
      </div> */}

      <div className="mt-8 px-6 grid grid-cols-4 gap-4">
        {profile.public_metrics ? (
          <>
            <p className="bg-blue-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-blue-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Followers</span><br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.followers_count}
              </span>
            </p>

            <p className="bg-green-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-green-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Following</span><br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.following_count}
              </span>
            </p>

            <p className="bg-purple-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-purple-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Tweets</span><br />
              <span className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {profile.public_metrics.tweet_count}
              </span>
            </p>

            <p className="bg-yellow-800 text-white text-center py-4 rounded-lg shadow-lg hover:bg-yellow-900 hover:shadow-xl transition-all duration-300 group">
              <span className="text-2xl font-semibold">Listed</span><br />
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

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Tweets</h2>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Most Liked Tweet</h3>
          {mostLikedTweet ? (
            <div className="p-4 border rounded-md bg-gray-800 mt-2">
              <p>{mostLikedTweet.text}</p>
              <p className="text-xs text-gray-400 mt-2">
                Likes: {mostLikedTweet.public_metrics.like_count}
              </p>
              <a
                href={`https://twitter.com/${profile.username}/status/${mostLikedTweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on Twitter
              </a>
            </div>
          ) : (
            <p>No tweets available</p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Most Commented Tweet</h3>
          {mostCommentedTweet ? (
            <div className="p-4 border rounded-md bg-gray-800 mt-2">
              <p>{mostCommentedTweet.text}</p>
              <p className="text-xs text-gray-400 mt-2">
                Comments: {mostCommentedTweet.public_metrics.reply_count}
              </p>
              <a
                href={`https://twitter.com/${profile.username}/status/${mostCommentedTweet.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View on Twitter
              </a>
            </div>
          ) : (
            <p>No tweets available</p>
          )}
        </div>
      </div>
    </div>
  );
}