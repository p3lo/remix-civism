import { Button, Checkbox, Collapse, Input, Textarea } from '@mantine/core';
import { useState } from 'react';
import { ActionFunction, Form, LoaderFunction, redirect, useMatches } from 'remix';
import { auth } from '~/utils/auth.server';
import { BsTrash } from 'react-icons/bs';
import { prisma } from '~/db.server';

interface Option {
  option: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const auth_profile = await auth.isAuthenticated(request);
  if (!auth_profile) {
    return redirect('/login');
  }
  return {};
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let is_private: boolean;
  let options: Option[] = [];
  let question: string | undefined = formData.get('question')?.toString();
  let slug: string | undefined = formData.get('slug')?.toString();
  let authorId: string | undefined = formData.get('authorId')?.toString();
  let description: string = formData.get('description')?.toString() || '';
  if (formData.get('is_private')) {
    is_private = true;
  } else {
    is_private = false;
  }
  formData.forEach((element, key) => {
    if (key.startsWith('answer')) {
      options.push({ option: element.toString() });
    }
  });
  if (question && slug && authorId) {
    await prisma.poll.create({
      data: {
        poll: question,
        slug,
        poll_description: description,
        private: is_private,
        authorId: +authorId,
        options: {
          create: options,
        },
      },
    });
    return redirect(`/${slug}`);
  }
  return null;
};

export default function New() {
  const matches = useMatches()[0].data;
  const [answers, setAnswers] = useState([{ id: generateUUID(16) }, { id: generateUUID(16) }]);
  const [opened, setOpen] = useState(false);
  const slug = generateUUID(32);
  function generateUUID(digits: number) {
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
    let uuid = [];
    for (let i = 0; i < digits; i++) {
      uuid.push(str[Math.floor(Math.random() * str.length)]);
    }
    return uuid.join('');
  }
  function deleteAnswer(id: string) {
    setAnswers(answers.filter((item) => item.id != id));
  }
  function addAnswer() {
    setAnswers([...answers, { id: generateUUID(16) }]);
  }
  return (
    <div className=" mt-[10vh] flex flex-col space-y-4 w-full">
      <p className="mx-auto text-2xl font-extrabold">Create new poll</p>
      <Form method="post" className="flex flex-col w-full mx-auto space-y-2 sm:w-3/4 md:w-1/2">
        <Textarea
          className="w-full"
          placeholder="Your poll question"
          label="Poll question"
          autosize
          minRows={2}
          name="question"
          required={true}
        />
        <div className="flex justify-between">
          <Checkbox name="is_private" defaultChecked={false} label="Private poll" />
          <Button variant="subtle" size="xs" compact type="button" onClick={() => setOpen((o) => !o)}>
            Add description
          </Button>
        </div>
        <Collapse in={opened}>
          <Textarea
            className="w-full"
            placeholder="Additional information (optional)"
            label="Description"
            autosize
            minRows={2}
            name="description"
            required={false}
          />
        </Collapse>
        <input hidden={true} name="slug" value={slug} readOnly />
        <input hidden={true} name="authorId" value={matches.id} readOnly />

        <p className="mx-auto font-bold">Poll answers</p>
        {answers.map((item, index) => (
          <div key={item.id} className="flex items-center w-full space-x-2">
            <Input
              className="grow"
              icon={<p className="">{index + 1}.</p>}
              placeholder="Answer"
              name={`answer_${item.id}`}
              required={true}
            />
            {index > 1 && (
              <BsTrash
                className="w-4 h-4 text-red-600 transition ease-in-out delay-150 cursor-pointer hover:scale-125"
                onClick={() => deleteAnswer(item.id)}
              />
            )}
          </div>
        ))}
        <button type="button" className="px-3 py-2 border border-dashed w-[200px] mx-auto text-sm" onClick={addAnswer}>
          Add answer
        </button>
        <Button className="w-[200px] mx-auto" variant="subtle" type="submit">
          Save poll & publish
        </Button>
      </Form>
    </div>
  );
}
