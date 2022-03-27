import { Popover, Progress } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'remix';
import { getDate, getPercent } from '~/utils/functions';
import { Poll } from '~/utils/types';
import { AiOutlineEye } from 'react-icons/ai';

function PollItem({ poll }: { poll: Poll }) {
  const [opened, setOpened] = useState(false);
  const totalVotes: number = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
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
        <div className="flex items-start border-b border-opacity-50 border-dotted">
          <Link to={poll.slug} className="flex flex-col p-2 rounded-lg cursor-pointer grow group">
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
            className="w-5 h-5 m-2 transition duration-150 ease-out transform cursor-help hover:scale-125"
            onMouseEnter={() => setOpened(true)}
            onMouseLeave={() => setOpened(false)}
          />
        </div>
      }
    >
      <div className="flex flex-col space-y-2 w-[450px]">
        <p className="mx-auto mt-2 font-bold">Poll votes</p>
        {poll.options.map((item) => (
          <div className="flex flex-col" key={item.id}>
            <p className="text-sm">{item.option}</p>
            <div className="flex items-center space-x-1">
              <p className="text-xs opacity-50">{`${getPercent(item.votes, totalVotes)}%`}</p>
              <Progress value={getPercent(item.votes, totalVotes)} size={25} radius="xs" className="grow" />
              <p className="text-xs opacity-50 w-[45px] text-center">({item.votes})</p>
            </div>
          </div>
        ))}
      </div>
    </Popover>
  );
}

export default PollItem;
