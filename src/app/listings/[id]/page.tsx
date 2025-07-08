import { supabase } from "@/lib/supabase";
import MessageForm from "@/components/MessageForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ListingGallery from "@/components/ListingGallery";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams() {
  const { data: listings } = await supabase.from("listings").select("id");
  
  return (
    listings?.map((listing) => ({
      id: listing.id.toString(),
    })) || []
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  const { data: listing } = await supabase
    .from("listings")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: listing?.title || "Listing Details",
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id: listingId } = await params;

  if (!listingId) return notFound();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .single();

  if (!listing) {
    return (
      <div className="p-6 text-center text-gray-500">
        Listing not found.
      </div>
    );
  }

  let images: string[] = [];
  try {
    images = JSON.parse(listing.image_url || "[]");
  } catch {
    images = [listing.image_url];
  }

  return (
    <main className="p-4 max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex justify-start mb-4">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Marketplace
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 space-y-4">
          <ListingGallery images={images} title={listing.title} />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
          <p className="text-blue-600 font-semibold text-xl">
            ₱{Number(listing.price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-sm text-gray-500">{listing.location}</p>
          <p className="ㅇ-4 text-gray-700 text-sm whitespace-pre-line">
            {listing.description || "No description provided."}
          </p>

          <div className="mt-6 space-y-2">
            <h2 className="font-bold text-sm text-gray-700">
              Seller: {listing.seller_email}
            </h2>
            <MessageForm listingId={listing.id} sellerEmail={listing.seller_email} />
          </div>
        </div>
      </div>
    </main>
  );
}