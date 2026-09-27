import type { H3Event } from "h3";

export const ensureTwitchExtension = async (event: H3Event) => {
  const payload = await verifyTwitchExtension(event);
  const channelId = getHeader(event, "Channel-Id");

  if (!payload
    || !channelId
    || payload.channel_id !== channelId
    || Date.now() >= payload.exp * 1000
  ) {
    throw createError({
      status: 401,
      message: "Invalid authorization"
    });
  }
};
