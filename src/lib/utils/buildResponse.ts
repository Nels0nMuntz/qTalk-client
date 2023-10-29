export const buildResponse = (body: string | object, init?: ResponseInit) => {
  const responseBody =
    typeof body === 'string'
      ? JSON.stringify({ message: body })
      : JSON.stringify(body);
  return new Response(responseBody, init);
};
