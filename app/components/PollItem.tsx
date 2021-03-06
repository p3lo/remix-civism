import { Popover, Progress } from '@mantine/core';
import { useMemo, useState } from 'react';
import { Link } from 'remix';
import { getDate, getPercent, sumVotes } from '~/utils/functions';
import { Poll } from '~/utils/types';
import { AiOutlineEye } from 'react-icons/ai';

function PollItem({ poll }: { poll: Poll }) {
  const [opened, setOpened] = useState(false);
  const totalVotes: number = useMemo(() => sumVotes(poll.options), [poll.options]);
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      position="bottom"
      placement="center"
      withArrow
      trapFocus={false}
      closeOnEscape={false}
      transition="pop-top-left"
      width="100%"
      spacing={5}
      styles={{ body: { pointerEvents: 'none' } }}
      target={
        <>
          <div className="flex items-start ">
            <Link to={`/${poll.slug}`} className="flex flex-col p-2 rounded-lg cursor-pointer grow group">
              <p className="font-bold transition duration-150 ease-out transform group-hover:font-extrabold">
                {poll.poll}
              </p>
              {poll.poll_description && <p className="pb-2 text-xs opacity-60">({poll.poll_description})</p>}
              <div className="flex space-x-1 text-xs opacity-50">
                <p>{poll.author.name}</p>
                <div className="border-l" />
                <p>{getDate(poll.created_at)}</p>
              </div>
            </Link>
            <AiOutlineEye
              className="flex-none w-5 h-5 m-2 transition duration-150 ease-out transform cursor-help hover:scale-125"
              onMouseEnter={() => setOpened(true)}
              onMouseLeave={() => setOpened(false)}
            />
          </div>
          <div className="w-full border-b border-dotted opacity-20" />
        </>
      }
    >
      <div className="flex flex-col space-y-2 w-[400px] sm:w-[450px] mb-3">
        <p className="mx-auto mt-2 font-bold">Poll votes</p>
        {poll.options.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <p className="w-3/4 text-sm truncate">{item.option}</p>
            <div className="flex items-center space-x-1">
              <p className="text-xs opacity-50 w-[35px]">{`${getPercent(item.votes, totalVotes)}%`}</p>
              <Progress value={getPercent(item.votes, totalVotes)} size={18} radius="xs" className="grow" />
              <p className="text-xs opacity-50 w-[45px] text-center">({item.votes})</p>
            </div>
          </div>
        ))}
      </div>
    </Popover>
  );
}

export default PollItem;
