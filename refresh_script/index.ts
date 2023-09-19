import axios from 'axios';

const API_ENDPOINT = process.env.INTERNAL_API_ENDPOINT || 'http://internal_service';

async function refreshFeedsAndQueue() {
  try {
    // Fetch data from internal API server
    const response = await axios.get(`${API_ENDPOINT}/endpoint`);

    if (response.status === 200) {
      const data = response.data;
      
      // TODO: Queue Data
      console.log("Data fetched and processed successfully! ", data);
    } else {
      console.error('Failed to fetch data from internal API.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

refreshFeedsAndQueue();
