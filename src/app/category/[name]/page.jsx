import CategoryClient from './CategoryClient';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name).replaceAll("-", " ").toUpperCase();
  
  return {
    title: `SECTOR: ${categoryName} | QuickQart 1/1`,
    description: `Explore the QuickQart inventory for ${categoryName}. Advanced 2026 commerce items.`,
    alternates: {
      canonical: `https://quickqart.com/category/${resolvedParams.name}`,
    },
    openGraph: {
      title: `${categoryName} INVENTORY | QuickQart 1/1`,
      description: `Premium QuickQart ${categoryName} sector tracking.`,
      url: `https://quickqart.com/category/${resolvedParams.name}`,
      siteName: "QuickQart",
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} INVENTORY | QuickQart 1/1`,
      description: `Premium QuickQart ${categoryName} sector tracking.`,
    }
  };
}

export default async function CategoryPage({ params }) {
  return <CategoryClient params={params} />;
}
