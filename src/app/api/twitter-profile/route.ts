import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 });
  }

  if (!process.env.TWITTER_BEARER_TOKEN) {
    return Response.json({ error: "Missing API token" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=id,name,username,profile_image_url,public_metrics,location,created_at`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      return Response.json({ error: "Twitter API Error", status: response.status }, { status: response.status });
    }

    const data = await response.json();

     // Add CORS headers
     return new Response(JSON.stringify(data.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });

    return Response.json(data.data, { status: 200 });

  } catch (error) {
    console.error("Error fetching Twitter profile:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
