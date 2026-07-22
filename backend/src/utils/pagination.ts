export type PaginationInput = {
  page?: number;
  limit?: number;
};

export function toPagination(input: PaginationInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 20;
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

export function pageMeta(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
