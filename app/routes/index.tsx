import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';
import PaginationComp from '~/components/PaginationComp';
import PollItem from '~/components/PollItem';
import { prisma } from '~/db.server';
import { Poll } from '~/utils/types';

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

  return polls;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData);
  return null;
};

export default function Index() {
  const polls: Poll[] = useLoaderData();
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
        <div className="my-5 flex justify-center">
          <PaginationComp />
        </div>
      </div>
    </>
  );
}
