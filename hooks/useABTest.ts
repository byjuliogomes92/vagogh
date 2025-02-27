// hooks/useABTest.ts
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AB_TEST_COOKIE_NAME = 'ab_test_version';
const AB_TEST_VERSIONS = ['hero', 'search'] as const;

type ABTestVersion = typeof AB_TEST_VERSIONS[number];

export const useABTest = (): ABTestVersion => {
  const [version, setVersion] = useState<ABTestVersion>('hero');

  useEffect(() => {
    const savedVersion = Cookies.get(AB_TEST_COOKIE_NAME) as ABTestVersion;
    if (savedVersion && AB_TEST_VERSIONS.includes(savedVersion)) {
      setVersion(savedVersion);
    } else {
      const randomVersion = AB_TEST_VERSIONS[Math.floor(Math.random() * AB_TEST_VERSIONS.length)];
      Cookies.set(AB_TEST_COOKIE_NAME, randomVersion, { expires: 7 }); // Cookie válido por 7 dias
      setVersion(randomVersion);
    }
  }, []);

  return version;
};