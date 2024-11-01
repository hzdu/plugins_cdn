declare function updateSetting(key: string, value: string): ReturnType<typeof fetch>;
declare function getSetting(key: string): ReturnType<typeof fetch>;
export { updateSetting, getSetting };
