const parkings = [
  {
    UUID: "001001",
    pNo: "1",
    pName: "Mall of Arabia Parking 1",
    pLocation: "26 of July, 6th of October",
    latitude: 30.009085587861577,
    longitude: 30.97411632686194,
    slotNo: "1",
    status: "1",
    timestamp: "2020-05-11 11:39:42.648604",
  },
  {
    UUID: "001002",
    pNo: "1",
    pName: "Mall of Arabia Parking 2",
    pLocation: "26 of July, 6th of October",
    latitude: 30.008978745977316,
    longitude: 30.973941983271672,
    slotNo: "2",
    status: "0",
    timestamp: "2020-05-11 11:39:42.648604",
  },
  {
    UUID: "001003",
    pNo: "1",
    pName: "Mall of Arabia Parking 3",
    pLocation: "26 of July, 6th of October",
    latitude: 30.008864936017503,
    longitude: 30.973794461772226,
    slotNo: "3",
    status: "1",
    timestamp: "2020-05-11 11:39:42.648604",
  },
];

const profile = {
  username: "Dalia",
  location: "Egypt",
  email: "dalia@gmail.com",
  avatar: require("../assets/images/logo.png"),
  budget: 5000,
  monthly_cap: 7000,
  notifications: true,
  newsletter: false,
};

export { parkings, profile };
