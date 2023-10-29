export { default } from 'next-auth/middleware';

export const config = { matcher: ['/t/:path*/submit', '/t/create'] };
