import { LoaderFunction, useLoaderData, useMatches } from 'remix';
import { prisma } from '~/db.server';
import { auth } from '~/utils/auth.server';
import { Poll } from '~/utils/types';

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
          options: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      });
    }
  }

  return polls;
};

function MyPolls() {
  const polls: Poll[] = useLoaderData();
  console.log(polls);
  return <div>MyPolls</div>;
}

export default MyPolls;
