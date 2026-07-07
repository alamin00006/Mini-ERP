export const getUserInitials = (name: string, maxLength = 2): string => {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, maxLength)
    .toUpperCase();
};
