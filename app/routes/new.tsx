import { Button, Input, Textarea } from '@mantine/core';
import { useState } from 'react';
import { ActionFunction, Form, LoaderFunction, redirect, useMatches } from 'remix';
import { auth } from '~/utils/auth.server';
import { BsTrash } from 'react-icons/bs';

export const loader: LoaderFunction = async ({ request }) => {
  const auth_profile = await auth.isAuthenticated(request);
  if (!auth_profile) {
    return redirect('/login');
  }
  return {};
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData);
  return null;
};

export default function New() {
  const matches = useMatches()[0].data;
  const [answers, setAnswers] = useState([{ id: generateUUID(16) }, { id: generateUUID(16) }]);
  console.log(matches);
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
      <Form method="post" className="w-full  flex flex-col space-y-2">
        <Textarea
          className="w-full sm:w-3/4 md:w-1/2 mx-auto"
          placeholder="Your poll question"
          label="Poll question"
          autosize
          minRows={2}
          name="question"
        />
        <p className="font-bold mx-auto">Poll answers</p>
        {answers.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-2 w-full sm:w-3/4 md:w-1/2 mx-auto">
            <Input
              className="grow"
              icon={<p className="">{index + 1}.</p>}
              placeholder="Answer"
              name={`answer_${item.id}`}
            />
            <BsTrash
              className="w-4 h-4 text-red-600 transition ease-in-out delay-150 cursor-pointer hover:scale-125"
              onClick={() => deleteAnswer(item.id)}
            />
          </div>
        ))}
        <button type="button" className="px-3 py-2 border border-dashed w-[200px] mx-auto text-sm" onClick={addAnswer}>
          Add answer
        </button>
        <Button className="w-[200px] mx-auto" variant="subtle" type="submit">
          Add poll
        </Button>
      </Form>
    </div>
  );
}
