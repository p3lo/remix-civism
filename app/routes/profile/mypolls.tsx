import { LoaderFunction, useLoaderData } from 'remix';
import PollItem from '~/components/PollItem';
import { prisma } from '~/db.server';
import { auth } from '~/utils/auth.server';
import { Poll } from '~/utils/types';
import { BsTrash } from 'react-icons/bs';
import { Button } from '@mantine/core';

export const loader: LoaderFunction = async ({ request }) => {
  const auth_profile = await auth.isAuthenticated(request);
  let polls;
  if (auth_profile) {
    const profile = await prisma.user.findUnique({
      where: {
        email: auth_profile._json.email,
      },
    });

    if (profile?.id) {
      polls = await prisma.poll.findMany({
        where: {
          authorId: profile.id,
        },
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
  }

  return polls;
};

function MyPolls() {
  const polls: Poll[] = useLoaderData();
  console.log(polls);
  return (
    <div className="flex flex-col ">
      {polls.map((item: Poll) => (
        <>
          <PollItem key={item.id} poll={item} />
          <Button variant="subtle" size="xs" compact type="button" className="mb-3" color="red">
            Delete poll
          </Button>
        </>
      ))}
    </div>
  );
}

export default MyPolls;
