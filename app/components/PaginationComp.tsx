import { Pagination } from '@mantine/core';
import { useState } from 'react';
import { Link, useFetcher } from 'remix';

function PaginationComp({ page }: { page?: number }) {
  const pageNo = useFetcher();
  const [activePage, setPage] = useState(page || 1);

  return (
    <pageNo.Form method="get" action="/">
      <button type="submit">
        <Pagination total={10} page={activePage} onChange={setPage} size="xs" />
        <input type="hidden" name="page" value={activePage} />
      </button>
    </pageNo.Form>
  );
}

export default PaginationComp;
