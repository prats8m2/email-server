const createAuth = (clientName: string, username: string, password: string) => {
  return `${clientName}\\${username}:${password}`;
};

export default createAuth;
