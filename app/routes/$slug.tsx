import { LoaderFunction, useLoaderData } from 'remix';
import { prisma } from '~/db.server';
import { Poll } from '~/utils/types';

export const loader: LoaderFunction = async ({ params }) => {
  let slug = params.slug;
  const poll = await prisma.poll.findFirst({
    where: {
      slug,
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
  if (!poll) {
    throw new Error('Poll not found');
  } else {
    return poll;
  }
};

function PollSlug() {
  const poll: Poll = useLoaderData();
  console.log(poll);
  return (
    <div className="w-full mx-auto my-10 sm:w-[80%] md:w-[65%] xl:w-[50%]">
      <p className="text-2xl font-bold text-center">{poll.poll}</p>
    </div>
  );
}

export default PollSlug;
