import { json, LoaderFunction, useLoaderData } from 'remix';
import { prisma } from '~/db.server';

export const loader: LoaderFunction = async () => {
  const polls = await prisma.poll.findMany({
    where: {
      private: false,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      options: true,
    },
  });
  return json({ polls });
};

export default function Index() {
  const polls = useLoaderData();
  return (
    <>
      {polls && (
        <>
          <pre>
            <code>{JSON.stringify(polls, null, 2)}</code>
          </pre>
        </>
      )}
    </>
  );
}
