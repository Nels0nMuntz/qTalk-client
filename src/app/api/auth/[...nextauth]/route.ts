import NextAuth from 'next-auth';
import { authoOptions } from '@/lib/auth';

const handler = NextAuth(authoOptions);

export { handler as GET, handler as POST };
