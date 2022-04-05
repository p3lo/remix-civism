import { json, Link, LoaderFunction, Outlet, useLoaderData } from 'remix';
import PollItem from '~/components/PollItem';
import { prisma } from '~/db.server';
import { auth } from '~/utils/auth.server';
import { Poll } from '~/utils/types';
import { Button } from '@mantine/core';
import invariant from 'tiny-invariant';
import PaginationComp from '~/components/PaginationComp';

export const loader: LoaderFunction = async ({ request }) => {
  const auth_profile = await auth.isAuthenticated(request);
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 1;
  let polls, pollsNoPag;
  invariant(auth_profile, 'auth_profile is required');

  const profile = await prisma.user.findUnique({
    where: {
      email: auth_profile._json.email,
    },
  });
  invariant(profile, 'profile is required');
  if (profile?.id) {
    const pollsNo = await prisma.poll.count({
      where: {
        authorId: profile.id,
      },
    });
    pollsNoPag = Math.ceil(pollsNo / 10);
    polls = await prisma.poll.findMany({
      where: {
        authorId: profile.id,
      },
      skip: (+page - 1) * 10,
      take: 10,
      include: {
        options: {
          orderBy: {
            id: 'asc',
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        //@ts-ignore
        created_at: 'desc',
      },
    });
  }

  return json({ polls, pollsNoPag });
};

function MyPolls() {
  const { polls, pollsNoPag }: { polls: Poll[]; pollsNoPag: number } = useLoaderData();

  return (
    <>
      <Outlet />
      <div className="flex flex-col ">
        {polls.map((item: Poll) => (
          <div key={item.id} className="flex flex-col w-full grow">
            <PollItem poll={item} />
            <Link to={`delete?poll=${item.id}`}>
              <Button
                variant="subtle"
                size="xs"
                compact
                type="button"
                className="flex w-[200px] justify-center mx-auto mb-3"
                color="red"
              >
                Delete poll
              </Button>
            </Link>
          </div>
        ))}
        <div className="flex justify-center my-5">
          <PaginationComp from="mypolls" pagesNo={pollsNoPag} />
        </div>
      </div>
    </>
  );
}

export default MyPolls;
