import { ListItem, Progress, Radio, RadioGroup } from '@mantine/core';
import { ActionFunction, Form, LoaderFunction, useLoaderData, useSubmit, useTransition } from 'remix';
import { prisma } from '~/db.server';
import { getDate, getPercent, sumVotes } from '~/utils/functions';
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
      options: {
        orderBy: {
          id: 'asc',
        },
      },
    },
  });
  if (!poll) {
    throw new Error('Poll not found');
  } else {
    return poll;
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const option = formData.get('option');
  if (option) {
    await prisma.option.update({
      where: {
        id: +option,
      },
      data: {
        votes: {
          increment: 1,
        },
      },
    });
  }

  return null;
};

function PollSlug() {
  const poll: Poll = useLoaderData();
  const submit = useSubmit();
  const transition = useTransition();
  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
  }

  return (
    <>
      <div className="w-full mx-auto my-10 sm:w-[80%] md:w-[65%] xl:w-[50%]">
        <p className="text-2xl font-bold text-center">{poll.poll}</p>
        <p className="text-sm font-bold text-center opacity-50">({poll.poll_description})</p>
      </div>
      <Form method="post" onChange={handleChange}>
        <RadioGroup
          name="option"
          className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]"
          orientation="vertical"
          label="Select your preferable option"
        >
          {poll.options.map((item) => (
            // @ts-ignore
            <Radio key={item.id} value={item.id.toString()} label={item.option} disabled={transition.submission} />
          ))}
        </RadioGroup>
      </Form>
      <div className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]">
        <p className="text-center mt-2 font-semibold text-sm">Results</p>
        {poll.options.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <p className="text-sm pl-7">{item.option}</p>
            <div className="flex items-center space-x-1">
              <p className="w-[25px] text-xs opacity-50">{`${getPercent(item.votes, sumVotes(poll.options))}%`}</p>
              <Progress value={getPercent(item.votes, sumVotes(poll.options))} size={25} radius="xs" className="grow" />
              <p className="text-xs opacity-50 w-[45px] text-center">({item.votes})</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]">
        <p className="text-sm opacity-50">Author: {poll.author.name}</p>
        <p className="text-sm opacity-50">Created: {getDate(poll.created_at)}</p>
      </div>
    </>
  );
}

export default PollSlug;
