// Guaranteed generic, high-res Unsplash links with no query parameters to bypass any adblock/caching errors.

export const destinations = [
    {
        id: 1,
        name: "Kashmir, India",
        image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d",
        category: "Winter Paradise",
        brief: "Paradise on Earth with snow-capped peaks and pristine lakes.",
        description: "Known as 'Heaven on Earth', Jammu and Kashmir is world-famous for its scenic splendor, snow-capped mountains, plentiful wildlife, exquisite monuments, hospitable people, and local handicrafts. Shikara rides on Dal Lake are unforgettable.",
        reviews: [
            { id: 1, user: "Aisha R.", comment: "Truly heaven. The Dal Lake at sunset is pure magic.", rating: 5 },
            { id: 2, user: "Vikram S.", comment: "Gulmarg's snow is perfect. The hospitality is unmatched.", rating: 5 },
        ],
        averageRating: 4.9,
    },
    {
        id: 2,
        name: "Udaipur, India",
        image: "https://images.unsplash.com/photo-1598104886638-348e351834de",
        category: "Royal Heritage",
        brief: "The City of Lakes offering timeless royal grandeur.",
        description: "Often called the Venice of the East, Udaipur is located around azure water lakes and is hemmed in by lush green hills of Aravallis. The Lake Palace, located in the middle of Lake Pichola, is one of the most beautiful sights in Rajasthan.",
        reviews: [
            { id: 1, user: "Neha K.", comment: "Felt like royalty. The architecture is stunning.", rating: 5 },
            { id: 2, user: "David M.", comment: "A romantic city with incredible history.", rating: 4.8 },
        ],
        averageRating: 4.8,
    },
    {
        id: 3,
        name: "Munnar, India",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666cf2",
        category: "Verdant Hills",
        brief: "Lush green tea estates rolling over misty hills.",
        description: "Munnar is a town in the Western Ghats mountain range in India’s Kerala state. It's surrounded by rolling hills dotted with tea plantations established in the late 19th century. The mist-covered peaks feel ethereal.",
        reviews: [
            { id: 1, user: "Priya P.", comment: "The greenest place I have ever seen. So peaceful.", rating: 5 },
            { id: 2, user: "Rahul T.", comment: "Waking up to the view of tea gardens was surreal.", rating: 5 },
        ],
        averageRating: 4.9,
    },
    {
        id: 4,
        name: "Bora Bora",
        image: "https://images.unsplash.com/photo-1589394815804-964ce0fa5827",
        category: "Tropical Luxury",
        brief: "The ultimate tropical luxury with iconic overwater bungalows.",
        description: "Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus and a turquoise lagoon protected by a coral reef, it’s known for its scuba diving and luxury resorts.",
        reviews: [
            { id: 1, user: "Emma W.", comment: "Expensive but the water clarity is unmatched.", rating: 5 },
            { id: 2, user: "Lucas F.", comment: "Swimming with sharks and rays was a lifetime experience.", rating: 4.9 },
        ],
        averageRating: 4.9,
    },
    {
        id: 5,
        name: "Maldives",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8",
        category: "Ocean Escapes",
        brief: "A tropical nation of coral islands and crystal-clear oceans.",
        description: "The Maldives is an archipelagic state in South Asia situated in the Indian Ocean. It's known for its beaches, blue lagoons, and extensive reefs, making it a premier destination for snorkeling, diving, and sheer relaxation.",
        reviews: [
            { id: 1, user: "Sophia L.", comment: "Paradise found. Our overwater villa was perfect in every way.", rating: 5 },
            { id: 2, user: "Oliver J.", comment: "The coral reefs are teeming with life.", rating: 4.8 },
        ],
        averageRating: 4.9,
    },
    {
        id: 6,
        name: "Zermatt, Switzerland",
        image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99",
        category: "Alpine Retreat",
        brief: "Majestic snow-capped peaks dominated by the iconic Matterhorn.",
        description: "Zermatt, in southern Switzerland’s Valais canton, is a mountain resort renowned for skiing, climbing and hiking. The town, at an elevation of around 1,600m, lies below the iconic, pyramid-shaped Matterhorn peak.",
        reviews: [
            { id: 1, user: "Hans M.", comment: "The view of the Matterhorn from the village is unbeatable.", rating: 5 },
            { id: 2, user: "Claire B.", comment: "Incredible skiing but definitely bring a high budget.", rating: 4.7 },
        ],
        averageRating: 4.8,
    },
    {
        id: 7,
        name: "Amalfi Coast, Italy",
        image: "https://images.unsplash.com/photo-1516483638261-f40889d28e67",
        category: "Mediterranean",
        brief: "Vivid coastal luxury perched on steep cliffs.",
        description: "The Amalfi Coast is a 50-kilometer stretch of coastline along the southern edge of Italy’s Sorrentine Peninsula. It's a popular holiday destination, with sheer cliffs and a rugged shoreline dotted with small beaches and pastel-colored fishing villages.",
        reviews: [
            { id: 1, user: "Giulia C.", comment: "Positano is breathtakingly beautiful. The food is divine.", rating: 5 },
            { id: 2, user: "James P.", comment: "Driving the coast is scary but the views are worth it.", rating: 4.8 },
        ],
        averageRating: 4.9,
    },
    {
        id: 8,
        name: "Kyoto, Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
        category: "Cultural Zen",
        brief: "A city of timeless temples, bamboo forests, and sakura.",
        description: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
        reviews: [
            { id: 1, user: "Kenichi T.", comment: "The Arashiyama bamboo grove feels like another world.", rating: 5 },
            { id: 2, user: "Maria R.", comment: "Cherry blossom season here is an ethereal experience.", rating: 5 },
        ],
        averageRating: 5.0,
    }
];

export const destinationStripData = [
    { id: 1, title: "Kashmir Snow", desc: "Gulmarg white wonderland", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d" },
    { id: 2, title: "Udaipur Palaces", desc: "Royalty on the lake", image: "https://images.unsplash.com/photo-1598104886638-348e351834de" },
    { id: 3, title: "Munnar Mist", desc: "Emerald tea hills", image: "https://images.unsplash.com/photo-1593693397690-362cb9666cf2" },
    { id: 4, title: "Bora Bora", desc: "Tropical lagoon paradise", image: "https://images.unsplash.com/photo-1589394815804-964ce0fa5827" },
];
