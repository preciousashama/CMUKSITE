import { useSession, signOut } from 'next-auth/react';

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div>
      <h1>Account</h1>
      <div className="info-group">
        <label>Username:</label>
        <p>{session.user?.name || 'No name available'}</p>
      </div>
      <div className="info-group">
        <label>Email:</label>
        <p>{session.user?.email || 'No email available'}</p>
      </div>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
