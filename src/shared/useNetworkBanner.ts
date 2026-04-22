import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useNetworkBanner(): boolean {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const apply = (state: NetInfoState) => {
      const connected = state.isConnected === true && state.isInternetReachable !== false;
      setOffline(!connected);
    };
    const unsub = NetInfo.addEventListener(apply);
    NetInfo.fetch().then(apply).catch(() => {});
    return () => unsub();
  }, []);

  return offline;
}
