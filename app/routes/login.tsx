import { Button, Center } from '@mantine/core';
import { Form, LoaderFunction } from 'remix';
import { auth } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: '/' });
  return null;
};

export default function Screen() {
  return (
    <Center className="mt-[20vh]">
      <Form method="post" action="/auth0">
        <Button variant="subtle" type="submit">
          Sign In with Auth0
        </Button>
      </Form>
    </Center>
  );
}
