class EventService {
  static FindSeat = async (seat_id) => {
    const url = `http://localhost:7000/api/v1/seat/${id}`;
    const response = await fetch(url);
    if (response.status != 200) {
      return null;
    }
    const metadata = await response.json();
    return metadata["metadata"];
  };
  static FindSeats = async (event_id, status) => {
    const url = `http://localhost:7000/api/v1/seats/${event_id}?status=${status}`;
    const response = await fetch(url);
    if (response.status != 200) {
      return null;
    }
    const metadata = await response.json();
    return metadata["metadata"];
  };
  static FindEvent = async (id) => {
    const response = await fetch(`http://localhost:7000/api/v1/event/${id}`);
    if (response.status != 200) {
      return null;
    }
    const metadata = await response.json();
    return metadata["metadata"];
  };
  static FindVoucher = async (id) => {
    const response = await fetch(`http://localhost:7000/api/v1/voucher/${id}`);
    if (response.status != 200) {
      return null;
    }
    const metadata = await response.json();
    return metadata["metadata"];
  };
}

module.exports = EventService;
