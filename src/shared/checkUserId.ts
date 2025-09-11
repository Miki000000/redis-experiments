export const checkUserId = (user_id?: string | null): { user_id: string } => {
  if (!user_id) throw Error("Must provide a user id in the header");
  return { user_id };
};
