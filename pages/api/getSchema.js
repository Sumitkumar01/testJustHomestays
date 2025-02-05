import axios from 'axios';
import fs from 'fs/promises';
import { parse } from 'json2csv';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchData = async () => {
  const response = await axios.get('https://api.vistarooms.com/api/v2/property-list', {
    params: { page: 1 },
    headers: {
      Accept: '*/*',
      'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
      apiKey: '45CF5-15516',
      secretKey: '0b202f12835710c65165de4021ae65cbdfa577b3',
    },
  });

  return response.data.response.data[0];
};

const saveDataToCsv = async (data) => {
  const filePath = 'stayvista_schema.csv';

  try {
    const csv = parse(data, { header: true });
    await fs.writeFile(filePath, csv);
    console.log(`Schema saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving CSV:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await fetchData();
      await saveDataToCsv(data);
      res.status(200).json({ message: 'Schema saved to stayvista_schema.csv' });
    } catch (error) {
      console.error('Error fetching and saving schema:', error);
      res.status(500).json({ message: 'Error fetching and saving schema', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
