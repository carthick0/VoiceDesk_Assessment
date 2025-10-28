import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";
dotenv.config();

export async function generateLivekitToken(identity) {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );

  token.addGrant({
    roomJoin: true,
    room: process.env.LIVEKIT_ROOM || "default-room",
    canPublish: true,
    canSubscribe: true,
  });

  
  const jwt = await token.toJwt();
  return jwt;
}
