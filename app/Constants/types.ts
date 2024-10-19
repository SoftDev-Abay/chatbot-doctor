// types.ts
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Chat: { chatId: string }; // Chat screen now expects a 'chatId' parameter
};
