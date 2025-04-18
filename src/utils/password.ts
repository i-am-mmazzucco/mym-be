export const randomPassword = () => {
  return Math.random().toString(36).substring(2, 15);
};
