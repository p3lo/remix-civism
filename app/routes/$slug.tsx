import { Code, LoadingOverlay, Progress, Radio, RadioGroup } from '@mantine/core';
import { useClipboard, useLocalStorage } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { ActionFunction, Form, LoaderFunction, useActionData, useLoaderData, useSubmit, useTransition } from 'remix';
import { prisma } from '~/db.server';
import { getDate, getPercent, sumVotes } from '~/utils/functions';
import { Option, Poll } from '~/utils/types';
import { RiFileCopy2Line } from 'react-icons/ri';

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
  const oldOption = formData.get('oldOption');

  if (oldOption && +oldOption > 0) {
    await prisma.option.update({
      where: {
        id: +oldOption,
      },
      data: {
        votes: {
          decrement: 1,
        },
      },
    });
  }
  let dbData;
  if (option) {
    dbData = await prisma.option.update({
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
  return dbData;
};

function PollSlug() {
  const poll: Poll = useLoaderData();
  const getData: Option | undefined = useActionData();
  const submit = useSubmit();
  const transition = useTransition();
  const [optionId, setOptionId] = useLocalStorage({ key: poll.id.toString(), defaultValue: 0 });
  const [pageURL, setPageURL] = useState('');
  const clipboard = useClipboard({ timeout: 1000 });
  const totalVotes: number = useMemo(() => sumVotes(poll.options), [poll.options]);

  useEffect(() => {
    setPageURL(window.location.href);
  }, []);

  useEffect(() => {
    if (getData) {
      setOptionId(getData.id);
    }
  }, [getData]);

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    submit(event.currentTarget, { replace: true });
  }

  return (
    <>
      <div className="w-full mx-auto my-10 sm:w-[80%] md:w-[65%] xl:w-[50%]">
        <p className="text-2xl font-bold text-center">{poll.poll}</p>
        {poll.poll_description && <p className="text-sm font-bold text-center opacity-50">({poll.poll_description})</p>}
      </div>

      <Form
        method="post"
        onChange={handleChange}
        className="relative w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]"
      >
        {/* @ts-ignore */}
        <LoadingOverlay visible={transition.submission} />
        <RadioGroup
          name="option"
          className=""
          orientation="vertical"
          label="Select your preferable option"
          {...(optionId > 0 && { defaultValue: `${optionId.toString()}` })}
        >
          {poll.options.map((item) => (
            <Radio key={item.id} value={item.id.toString()} label={item.option} />
          ))}
        </RadioGroup>
        <input hidden name="oldOption" value={optionId} readOnly />
      </Form>
      <div className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]">
        <p className="mt-2 text-sm font-semibold text-center">Results</p>
        <p className="text-xs text-center opacity-50">(Total votes: {totalVotes})</p>
        {poll.options.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <p className="text-sm pl-7">{item.option}</p>
            <div className="flex items-center space-x-1">
              <p className="w-[25px] text-xs opacity-50">{`${getPercent(item.votes, totalVotes)}%`}</p>
              <Progress value={getPercent(item.votes, totalVotes)} size={25} radius="xs" className="grow" />
              <p className="text-xs opacity-50 w-[45px] text-center">({item.votes})</p>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%] text-sm opacity-50">
        <p>Author: {poll.author.name}</p>
        <p>Created: {getDate(poll.created_at)}</p>
        <div className="flex items-center space-x-1">
          <p className="truncate">
            Link to share: <Code color="red">{pageURL}</Code>
          </p>
          <div className="flex items-center space-x-1">
            <RiFileCopy2Line
              className="w-4 h-4 transition duration-150 ease-out transform cursor-pointer hover:scale-125"
              onClick={() => clipboard.copy(pageURL)}
            />
            {clipboard.copied && <p className="text-xs">(Url copied)</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default PollSlug;
