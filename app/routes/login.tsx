import { Button, Center } from '@mantine/core';
import { Form, LoaderFunction } from 'remix';
import { auth } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: '/' });
  return null;
};

export default function Screen() {
  return (
    <Center className="mt-10">
      <Form method="post" action="/auth0">
        <button>Sign in</button>
      </Form>
    </Center>
  );
}
