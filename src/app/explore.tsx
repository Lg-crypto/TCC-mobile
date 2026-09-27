import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ExploreScreen() {
  useEffect(() => {
    router.replace('/sobre');
  }, []);

  return null;
}
