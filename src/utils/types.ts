// navigation/types.ts
export type RootParamList = {
  Home: undefined;
  MainTabs: undefined;
  MainTabsArrival: undefined;
  MainTabsRegistration: undefined;

  deficedetail: {
    reason?: string;
    imei?: string;
    name?: string;
  };

  // Optional future screens
  RegisterMode?: undefined;
};
