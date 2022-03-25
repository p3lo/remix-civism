import { Popover } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'remix';
import { getDate } from '~/utils/functions';
import { Poll } from '~/utils/types';

function PollItem({ poll }: { poll: Poll }) {
  const [opened, setOpened] = useState(false);
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
      width={260}
      spacing={5}
      styles={{ body: { pointerEvents: 'none' } }}
      target={
        <Link
          to={poll.slug}
          className="flex flex-col p-2 border-gray-300 border-opacity-50 rounded-lg cursor-pointer hover:border"
          onMouseEnter={() => setOpened(true)}
          onMouseLeave={() => setOpened(false)}
        >
          <p className="font-bold">{poll.poll}</p>

          <div className="flex space-x-1 text-xs opacity-50">
            <p>{poll.author.name}</p>
            <div className="border-l" />
            <p>{getDate(poll.created_at)}</p>
          </div>
        </Link>
      }
    >
      <div>kokot</div>
    </Popover>
  );
}

export default PollItem;
