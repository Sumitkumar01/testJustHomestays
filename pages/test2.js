import { useState, useEffect } from 'react';

export default function ShowIcalData() {
  const [icalData, setIcalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/availabilityc?calID=' + encodeURIComponent('https://test.jhsstorage.biz/?wpsbc-ical=6tS5dbeU2G3v9sF2fzI64784eb7584be.ics'));
      const data = await response.json();
      setIcalData(data);
    };
    
    fetchData();
  }, []);

  return (
    <pre>{icalData && JSON.stringify(icalData, null, 2)}</pre>
  );
}
