'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutListener = () => {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      router.push('/login');
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, [router]);

  return null;
};

export default LogoutListener;
