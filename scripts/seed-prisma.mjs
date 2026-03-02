import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

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
    ],
    names: [
      "Obsidian GT Prototype", "Silver Phantom Cruiser", "Titanium Enigma SUV", "Nero Volt EV",
    ]
  },
  {
    category: "Timepieces",
    itemPrompts: [
      "A close-up of a luxury mechanical watch with a skeleton dial and gold accents",
      "A minimalist executive dress watch with a black leather strap and titanium case",
      "A premium diving watch with a ceramic bezel and stainless steel bracelet",
      "An avant-garde hyper-watch with clear sapphire casing and complex neon gears",
    ],
    names: [
      "Aethelgard Skeleton Chrono", "Minimalist Titanium Noir", "Oceanic Depthmaster PRO", "Quantum Sapphire Tourbillon",
    ]
  },
  {
    category: "Executive Apparel",
    itemPrompts: [
      "A tailored bespoke charcoal grey wool suit hung on a wooden hanger, high fashion",
      "A premium black leather weekend duffel bag on a marble table",
      "A pair of polished black Oxford leather dress shoes with pristine shine",
      "A beautiful luxury leather briefcase with gold hardware",
    ],
    names: [
      "Bespoke Charcoal Two-Piece", "Noir Leather Weekender", "Executive Onyx Oxfords", "Aurelius Leather Briefcase", 
    ]
  }
];

// Expanded version via replication logic to hit approx 50 products quickly
async function seed() {
  console.log("Connecting to PostgreSQL via Prisma...");
  
  try {
    console.log("Emptying the existing products collection...");
    await prisma.product.deleteMany({});
    
    let products = [];
    
    let idCounter = 1;
    // Iterate 4 times to generate roughly ~48 products
    for (let loop = 0; loop < 4; loop++) {
        for (const group of templates) {
        for (let i = 0; i < group.names.length; i++) {
            const name = group.names[i] + (loop > 0 ? ` V${loop + 1}` : "");
            const prompt = group.itemPrompts[i];
            const seedVal = idCounter + 5000 + (loop * 100);
            
            const price = Math.floor(Math.random() * (15000 - 100) + 100);
            const hasSale = Math.random() > 0.7;
            const salePrice = hasSale ? price * ((Math.floor(Math.random() * 3) + 6) / 10) : null;
            
            const mainImage = generateImageURL(prompt, seedVal);
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
                description: `Experience the pinnacle of executive luxury with the ${name}. ${prompt}. Carefully curated to ensure the utmost quality and distinction.`,
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
                slug: generateSlug(name) + "-" + seedVal,
            });
            
            idCounter++;
        }
        }
    }
    
    console.log(`Inserting ${products.length} products...`);
    await prisma.product.createMany({
        data: products,
        skipDuplicates: true
    });
    
    console.log(`✅ Seed completed successfully with ${products.length} real-world luxury products.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
