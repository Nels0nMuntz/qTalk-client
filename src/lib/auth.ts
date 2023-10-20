import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authoOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: 'text' },
        password: { label: "Password", type: 'text' },
      },
      async authorize(credentials, req) {
        const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  // callbacks: {
  //   async session({ session, token }) {
  //     if (token) {
  //       session.user.id = token.id;
  //       session.user.name = token.name;
  //       session.user.email = token.email;
  //       session.user.image = token.image;
  //       session.user.username = token.username;
  //     }

  //     return session
  //   },
  //   async jwt() {
  //     return {
  //       id: '1',
  //       name: 'John',
  //       email: 'john@doe.com',
  //       image: '',
  //       username: 'john_doe',
  //     };
  //   },
  //   redirect() {
  //     return '/';
  //   },
  // },
};

export const getAuthSession = () => getServerSession(authoOptions);
