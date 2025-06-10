export const validatePagination = (offset, limit) => {
  const parsedOffset = parseInt(offset, 10);
  const parsedLimit = parseInt(limit, 10);

  if (isNaN(parsedOffset) || isNaN(parsedLimit)) {
    throw createError(400, 'Invalid offset or limit');
  }

  return { parsedOffset, parsedLimit };
};