import { Button, TextInput } from '@mantine/core';
import { ActionFunction, Form, useMatches } from 'remix';
import invariant from 'tiny-invariant';
import { prisma } from '~/db.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  invariant(name, 'name is required');
  invariant(email, 'email is required');

  await prisma.user.update({
    where: {
      email: email.toString(),
    },
    data: {
      name: name.toString(),
    },
  });

  return null;
};

function SettingsTab() {
  const matches = useMatches()[0].data;
  return (
    <Form method="post" className="flex flex-col w-full mx-auto my-10 space-y-3 sm:w-3/4 md:w-2/3 xl:w-1/2">
      <TextInput placeholder="Your name" label="Name" name="name" required defaultValue={matches.name} />
      <input hidden value={matches.email} readOnly name="email" />
      <Button className="w-[200px] mx-auto" variant="subtle" type="submit">
        Update
      </Button>
    </Form>
  );
}

export default SettingsTab;
