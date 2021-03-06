import { Pagination } from '@mantine/core';
import { useState } from 'react';
import { useFetcher } from 'remix';

function PaginationComp({ page, from, pagesNo }: { page?: number; from: string; pagesNo: number }) {
  const pageNo = useFetcher();
  const [activePage, setPage] = useState(page || 1);

  return (
    <pageNo.Form method="post" action="/">
      <button type="submit">
        <Pagination total={pagesNo} page={activePage} onChange={setPage} size="xs" />
        <input type="hidden" name="page" value={activePage} />
        <input type="hidden" name="from" value={from} />
      </button>
    </pageNo.Form>
  );
}

export default PaginationComp;
