export default defineEventHandler(async (event) => {
  await ensureTwitchExtension(event);
  const { login } = getRouterParams(event);
  const data = await $fetch<GameData>(`/api/game/${login}`);
  return data;
});
