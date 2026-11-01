import {useEffect, useState} from "react";

export function useProfile() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch('/api/profile').then(async response => {
      setData(response.ok ? await response.json() : false);
    }).catch(() => setData(false)).finally(() => setLoading(false));
  }, []);

  return {loading, data};
}