import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

// Add a React component as default export
export default function Dashboard({ session }) {
  return (
    <div>
      <h1>Welcome to your Dashboard</h1>
      <p>Hello, {session.user.name || 'User'}!</p>
      {/* Your dashboard content here */}
    </div>
  );
}