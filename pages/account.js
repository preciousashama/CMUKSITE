import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  // While redirecting, don't render anything
  if (!session) {
    return null;
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
