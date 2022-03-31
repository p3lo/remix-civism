import {
  Form,
  json,
  Link,
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix';
import type { MetaFunction } from 'remix';
import styles from './tailwind.css';
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  ActionIcon,
  useMantineColorScheme,
  Button,
  Avatar,
  Menu,
  Divider,
} from '@mantine/core';
import { BsSun, BsMoon } from 'react-icons/bs';
import { useLocalStorage } from '@mantine/hooks';
import { auth } from './utils/auth.server';
import { prisma } from './db.server';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Civism',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export const loader: LoaderFunction = async ({ request }) => {
  const auth_profile = await auth.isAuthenticated(request);
  if (auth_profile) {
    const profile = await prisma.user.findUnique({
      where: {
        email: auth_profile._json.email,
      },
    });

    return json(profile);
  } else {
    return null;
  }
};

export default function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  return (
    <Document>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <Layout>
            <Outlet />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  const profile = useLoaderData();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <div className="flex flex-col justify-between h-screen">
      <header className="p-3 shadow-xl ">
        <div className="grid grid-cols-3">
          <div className="flex justify-center col-start-2">
            <Link to="/">
              <h1 className="text-2xl font-extrabold">Civism</h1>
            </Link>
          </div>
          <div className="flex items-center justify-end space-x-3">
            {profile ? (
              <Menu
                trigger="click"
                delay={500}
                control={
                  <Avatar color="cyan" radius="xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
              >
                <Menu.Item>
                  <Link to="/profile/settings">Profile</Link>
                </Menu.Item>
                <Divider />
                <Menu.Item>
                  <Link to="/new">New poll</Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/profile/mypolls">My polls</Link>
                </Menu.Item>

                <Divider />
                <Form method="post" action="/logout">
                  <Menu.Item component="button" type="submit" color="red">
                    Logout
                  </Menu.Item>
                </Form>
              </Menu>
            ) : (
              <Link to="/login">
                <Button variant="subtle">Login</Button>
              </Link>
            )}
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <BsSun size={18} className="text-yellow-400" /> : <BsMoon size={18} className="text-blue-500" />}
            </ActionIcon>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <div className="">{children}</div>
      </main>
      <footer className="p-4 border-t opacity-50"></footer>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document>
      <div className="min-h-full px-4 py-16 bg-white sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">500</p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  Something went wrong!
                </h1>
                <p className="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
              </div>
              <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  return (
    <Document>
      <div className="min-h-full px-4 py-16 bg-white sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">{caught.status}</p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-gray-200 sm:pl-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  {caught.statusText}
                </h1>
                <p className="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
              </div>
              <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Document>
  );
}
