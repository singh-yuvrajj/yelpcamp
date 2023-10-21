
const locationNames = [
    "Redwood National and State Parks",
    "Rocky Mountain National Park",
    "Grand Canyon National Park",
    "Yosemite National Park",
    "Everglades National Park",
    "Zion National Park",
    "Great Smoky Mountains National Park",
    "Arches National Park",
    "Olympic National Park",
    "Acadia National Park",
    "Yellowstone National Park",
    "Glacier National Park",
    "Mount Rainier National Park",
    "Hawaii Volcanoes National Park",
    "Big Bend National Park",
    "Bryce Canyon National Park",
    "Sequoia and Kings Canyon National Parks",
    "Denali National Park and Preserve",
    "Joshua Tree National Park",
    "Canyonlands National Park"
];

const campgrounds = [];

for (let i = 0; i < 20; i++) {
    const locationIndex = i % locationNames.length;
    campgrounds.push({
        title: locationNames[locationIndex],
        price: getRandomPrice(1000, 25550),
        image: "https://source.unsplash.com/collection/484351",
        description: `Description for ${locationNames[locationIndex]}`,
        location: getRandomLocation()
    });
}

function getRandomPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLocation() {
    const locations = ["New York", "Denver", "Los Angeles", "Chicago", "Miami", "Phoenix", "San Francisco", "Seattle", "Honolulu", "Austin"];
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
}


module.exports = campgrounds;