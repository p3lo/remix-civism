import { Button, Modal } from '@mantine/core';
import { ActionFunction, Form, json, LoaderFunction, redirect, useLoaderData, useMatches, useNavigate } from 'remix';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';
import { Poll, User } from '~/utils/types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const pollId = url.searchParams.get('poll');
  invariant(pollId, 'pollId is required');
  return json({ pollId });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const pollId = formData.get('poll');
  invariant(pollId, 'pollId is required');
  await prisma.poll.delete({
    where: {
      id: +pollId,
    },
  });

  return redirect(`/profile/mypolls/`);
};

function MypollsDelete() {
  const navigate = useNavigate();
  const { pollId } = useLoaderData();
  const user = useMatches()[0].data as User;
  const polls = useMatches()[2].data.polls as Poll[];

  const getPollIndex = polls.findIndex((poll: Poll) => poll.id === +pollId);
  if (polls[getPollIndex].authorId !== user.id) {
    navigate('/profile/mypolls');
  }

  function onDismiss() {
    navigate('/profile/mypolls');
  }
  return (
    <Modal opened={true} onClose={onDismiss} title="Confirm to delete poll!" centered>
      <p className="mb-5 font-bold">{polls[getPollIndex].poll}</p>
      <Form method="post">
        <input type="hidden" name="poll" value={pollId} />
        <Button variant="subtle" type="submit" className="flex w-[200px] justify-center mx-auto" color="red">
          Delete
        </Button>
      </Form>
    </Modal>
  );
}

export default MypollsDelete;
