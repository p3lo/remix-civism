import { json, LoaderFunction, useLoaderData } from 'remix';
import PaginationComp from '~/components/PaginationComp';
import PollItem from '~/components/PollItem';
import { prisma } from '~/db.server';
import { Poll } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 1;

  const pollsNo = await prisma.poll.count({
    where: {
      private: false,
    },
  });
  const pollsNoPag = Math.ceil(pollsNo / 10);
  const polls = await prisma.poll.findMany({
    where: {
      private: false,
    },
    skip: (+page - 1) * 10,
    take: 10,
    include: {
      author: {
        select: {
          name: true,
        },
      },
      options: {
        orderBy: {
          id: 'asc',
        },
      },
    },
    orderBy: {
      //@ts-ignore
      created_at: 'desc',
    },
  });

  return json({ polls, pollsNoPag });
};

export default function Index() {
  const { polls, pollsNoPag }: { polls: Poll[]; pollsNoPag: number } = useLoaderData();

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-5 space-y-1 text-center">
        <h1 className="text-xl font-semibold">A platform to build your own poll</h1>
        <h2 className="text-sm ">
          Do you want to create a poll of any kind and share it with the world? Civism lets you quickly and easily set
          up your own custom poll.
        </h2>
      </div>
      <div className="my-10 sm:mx-[10vh] md:mx-[30vh] xl:mx-[50vh]">
        <div className="flex flex-col space-y-5">
          {polls.map((item: Poll) => (
            <PollItem poll={item} key={item.id} />
          ))}
        </div>
        <div className="flex justify-center my-5">
          <PaginationComp from="index" pagesNo={pollsNoPag} />
        </div>
      </div>
    </>
  );
}
