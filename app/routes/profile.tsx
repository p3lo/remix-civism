import { Tabs } from '@mantine/core';
import { ActionFunction, json, LoaderFunction, Outlet, redirect, useLoaderData, useSubmit } from 'remix';
import { FiSettings } from 'react-icons/fi';
import { BiPoll } from 'react-icons/bi';
import { auth } from '~/utils/auth.server';
import { useState } from 'react';

export const loader: LoaderFunction = async ({ request }) => {
  if (!(await auth.isAuthenticated(request))) {
    return redirect('/');
  }
  const url = new URL(request.url);

  let tabIndex: number;
  if (url.pathname === '/profile/settings') {
    tabIndex = 0;
  } else if (url.pathname === '/profile/mypolls') {
    tabIndex = 1;
  } else {
    return redirect('/profile/settings');
  }

  return json({ index: tabIndex });
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
  const tabInd = useLoaderData();
  const [activeTab, setActiveTab] = useState(tabInd.index);
  const submit = useSubmit();

  function onChange(tabindex: number) {
    setActiveTab(tabindex);
    const index = tabindex.toString();
    submit({ index }, { method: 'post' });
  }
  return (
    <div className="w-full my-10 mx-auto sm:w-[80%] md:w-[65%] xl:w-[50%]">
      <Tabs grow onTabChange={onChange} active={activeTab}>
        <Tabs.Tab label="Settings" icon={<FiSettings size={14} />} />
        <Tabs.Tab label="My polls" icon={<BiPoll size={14} />} />
      </Tabs>
      <Outlet />
    </div>
  );
}

export default ProfileLayout;
