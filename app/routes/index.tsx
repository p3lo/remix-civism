import { Form, json, LoaderFunction, useLoaderData } from 'remix';
import { Auth0Profile } from 'remix-auth-auth0';
import { auth } from '~/utils/auth.server';

type LoaderData = { profile: Auth0Profile };

export const loader: LoaderFunction = async ({ request }) => {
  const profile = await auth.isAuthenticated(request);
  if (profile) {
    return json<LoaderData>({ profile });
  } else {
    return null;
  }
};

export default function Index() {
  const profile = useLoaderData();
  return (
    <>
      <Form method="post" action="/logout">
        <button>Log Out</button>
      </Form>

      <hr />
      {profile && (
        <>
          <pre>
            <code>{JSON.stringify(profile, null, 2)}</code>
          </pre>
        </>
      )}
    </>
  );
}
