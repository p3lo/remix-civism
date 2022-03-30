import { Tabs } from '@mantine/core';
import { ActionFunction, LoaderFunction, Outlet, redirect, useSubmit } from 'remix';
import { FiSettings } from 'react-icons/fi';
import { BiPoll } from 'react-icons/bi';
import { auth } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  if (!(await auth.isAuthenticated(request))) {
    return redirect('/');
  }

  return {};
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const index = formData.get('index');
  if (index === '0') {
    return redirect(`/profile/settings`);
  } else if (index === '1') {
    return redirect(`/profile/mypolls`);
  }
  return null;
};

function ProfileLayout() {
  const submit = useSubmit();

  function test(tabindex: number) {
    const index = tabindex.toString();
    submit({ index }, { method: 'post' });
  }
  return (
    <div className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]">
      <Tabs grow onTabChange={test}>
        <Tabs.Tab label="Settings" icon={<FiSettings size={14} />} />
        <Tabs.Tab label="My polls" icon={<BiPoll size={14} />} />
      </Tabs>
      <Outlet />
    </div>
  );
}

export default ProfileLayout;
