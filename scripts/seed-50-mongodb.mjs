import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please explicitly provide MONGODB_URI in .env.local");
  process.exit(1);
}

const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const generateImageURL = (prompt, seed) => {
  const enc = encodeURIComponent(prompt + " 8k, highly detailed, photorealistic, luxury, studio lighting, masterpiece");
  return `https://image.pollinations.ai/prompt/${enc}?width=1000&height=1000&nologo=true&seed=${seed}`;
};

const templates = [
  {
    category: "Luxury Vehicles",
    itemPrompts: [
      "A sleek matte black luxury sports car parked in an underground executive garage",
      "A silver premium luxury sedan driving on a coastal highway at sunset",
      "A customized dark grey luxury SUV with black rims in front of a modern mansion",
      "A futuristic electric supercar with aerodynamic curves in a minimalist white studio",
      "A classic vintage luxury convertible restored to perfection, black with red leather interior",
      "An aggressive track-focused supercar in metallic midnight blue",
      "A luxury executive town car with tinted windows and chrome accents",
      "A beautiful red Italian sports car on a winding mountain road",
      "A hybrid luxury grand tourer with sleek lines and gullwing doors",
      "A heavy-duty ultra-luxury armored SUV in matte olive green",
    ],
    names: [
      "Obsidian GT Prototype", "Silver Phantom Cruiser", "Titanium Enigma SUV", "Nero Volt EV", "Crimson Archangel",
      "Midnight Apex V12", "Executive Sovereign", "Rosso Corsa Berlinetta", "Hyperion GT", "Aegis Sentinel XL"
    ]
  },
  {
    category: "Timepieces",
    itemPrompts: [
      "A close-up of a luxury mechanical watch with a skeleton dial and gold accents",
      "A minimalist executive dress watch with a black leather strap and titanium case",
      "A premium diving watch with a ceramic bezel and stainless steel bracelet",
      "A grand complication luxury watch with moonphase and perpetual calendar",
      "An avant-garde hyper-watch with clear sapphire casing and complex neon gears",
      "A vintage pilot's watch with a distressed leather strap and luminescent numerals",
      "A sophisticated women's luxury watch adorned with precise diamonds",
      "A sleek monopusher chronograph in rose gold with a sunburst dial",
      "A rugged tactical luxury watch made of forged carbon fiber",
      "An elegant platinum ultra-thin dress watch on a velvet surface",
    ],
    names: [
      "Aethelgard Skeleton Chrono", "Minimalist Titanium Noir", "Oceanic Depthmaster PRO", "Astral Moonphase Elite", "Quantum Sapphire Tourbillon",
      "Aero-Heritage Pilot", "Empress Diamond Radiance", "Rose Gold Zenith", "Carbon Shadow Ops", "Platinum Silhouette"
    ]
  },
  {
    category: "Executive Apparel",
    itemPrompts: [
      "A tailored bespoke charcoal grey wool suit hung on a wooden hanger, high fashion",
      "A premium black leather weekend duffel bag on a marble table",
      "A pair of polished black Oxford leather dress shoes with pristine shine",
      "A silk designer tie with subtle geometric patterns draped over a white dress shirt",
      "A luxurious cashmere overcoat in camel color hanging in a minimalist boutique",
      "A beautiful luxury leather briefcase with gold hardware",
      "A set of platinum and onyx cufflinks resting on a velvet tray",
      "A sleek modern designer trench coat in midnight black",
      "A premium leather wallet with a minimalist money clip design",
      "A high-end designer silk scarf folded neatly in an illuminated display piece",
    ],
    names: [
      "Bespoke Charcoal Two-Piece", "Noir Leather Weekender", "Executive Onyx Oxfords", "Geometric Silk Cravat", "Camel Cashmere Overcoat",
      "Aurelius Leather Briefcase", "Platinum Onyx Cufflinks", "Midnight Trench", "Minimalist Apex Wallet", "Luminance Silk Scarf"
    ]
  },
  {
    category: "Premium Electronics",
    itemPrompts: [
      "A sleek high-end wireless over-ear headphone made of aluminum and black leather",
      "A futuristic minimalist smartphone with a bezel-less display floating in dark space",
      "A luxury mechanical keyboard with solid brass casing and blank black keycaps",
      "An audiophile-grade vacuum tube amplifier glowing warmly on a wooden desk",
      "A premium ultra-thin executive laptop made of matte black carbon fiber",
      "A smart luxury home speaker with acoustic fabric and brushed titanium",
      "A professional mirrorless camera system in dark grey magnesium alloy",
      "A high-end cinematic drone with carbon fiber arms and a red lens accent",
      "A minimalist designer turntable playing a vinyl record",
      "An ultra-premium smartwatch with an OLED display and a forged carbon band",
    ],
    names: [
      "Acoustic Horizon Headphones", "Nexus Zero Edge Phone", "Brass Titan Mechanical Keyboard", "Vacuum Tube Resonance Amp", "Carbon StealthBook Pro",
      "Titanium Echo Speaker", "Alpha Magnesium Camera", "AeroLens Cinema Drone", "Vinyl Masterpiece Turntable", "Carbon Vertex Smartwatch"
    ]
  },
  {
    category: "Corporate Decor",
    itemPrompts: [
      "A large abstract minimalist sculpture in black marble and bronze in a living room",
      "A modern luxury executive desk chair made of aerospace aluminum and black mesh",
      "A dark concrete geometric planter with a beautiful bonsai tree",
      "A futuristic levitating desk lamp emitting a warm glow",
      "A beautiful luxury chess set made of crystal and obsidian on a glass board",
      "A premium hand-poured candle in a heavy matte black glass vessel",
      "A large dramatic modern art painting of black and gold strokes in a corporate lobby",
      "A luxury geometric whiskey decanter set with two crystal glasses",
      "An expensive designer floating shelf made of dark walnut wood",
      "A stunning architectural table clock with exposed brass gears",
    ],
    names: [
      "Bronze Noir Sculpture", "Aerospace Executive Chair", "Concrete Zen Bonsai", "Levity Desk Lamp", "Obsidian Grandmaster Chess",
      "Lumina Noir Candle", "Gold Strive Canvas", "Crystal Apex Decanter", "Walnut Horizon Shelf", "Brass Chronos Table Clock"
    ]
  }
];

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log("Connected successfully to database");

    const db = client.db("ecommerce"); // Using default from .env or just the connection default
    const productsCollection = db.collection("products");
    
    console.log("Emptying the existing products collection...");
    await productsCollection.deleteMany({});
    
    let products = [];
    
    let idCounter = 1;
    for (const group of templates) {
      for (let i = 0; i < group.names.length; i++) {
        const name = group.names[i];
        const prompt = group.itemPrompts[i];
        const seedVal = idCounter + 1000;
        
        const price = Math.floor(Math.random() * (15000 - 100) + 100);
        const hasSale = Math.random() > 0.7;
        const salePrice = hasSale ? price * ((Math.floor(Math.random() * 3) + 6) / 10) : null;
        
        // Single AI image generated for exactly this product description
        const mainImage = generateImageURL(prompt, seedVal);
        // Create variations by changing seed
        const subImages = [
          generateImageURL(prompt + " different angle", seedVal + 10000),
          generateImageURL(prompt + " close up detail", seedVal + 20000),
        ];

        let tags = ["luxury", "premium", "executive"];
        if (group.category === "Luxury Vehicles") tags.push("vehicle", "automotive");
        if (group.category === "Timepieces") tags.push("watches", "accessories");

        products.push({
          name: name,
          title: name,
          description: `Experience the pinnacle of executive luxury with the ${name}. ${prompt}. Carefully curated to ensure the utmost quality and distinction, it defines the modern paradigm of excellence.`,
          price: price,
          salePrice: salePrice,
          category: group.category,
          image: mainImage,
          images: [mainImage, ...subImages],
          stock: Math.floor(Math.random() * 50) + 1,
          isFeatured: Math.random() > 0.8,
          featuredOrder: Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : 0,
          rating: (Math.random() * (5.0 - 4.0) + 4.0),
          numReviews: Math.floor(Math.random() * 250),
          tags: tags,
          slug: generateSlug(name),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        idCounter++;
      }
    }
    
    console.log(`Inserting ${products.length} products...`);
    await productsCollection.insertMany(products);
    
    console.log("✅ Seed completed successfully with 50 real-world luxury products and AI-generated imagery.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seed();
