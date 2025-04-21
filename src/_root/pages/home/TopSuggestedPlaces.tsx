import  { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { topSuggestedPlaces } from "@/lib/appwrite/api";
import PlaceCard from "@/components/shared/PlaceCard";

type Place = {
  $id: string;
  name: string;
  location: string;
  imageUrl: string;
};

const TopSuggestedPlaces = () => {
  const [place, setPlace] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await topSuggestedPlaces();
        const dummy = [];
        const usedIndexes = new Set();
  
        if (Array.isArray(data) && data.length > 0) {
          while (dummy.length < 4 && usedIndexes.size < data.length) {
            const randomIndex = Math.floor(Math.random() * data.length);
            if (!usedIndexes.has(randomIndex)) {
              usedIndexes.add(randomIndex);
              dummy.push(data[randomIndex]);
            }
          }
        }
  
        setPlace(dummy);
      } catch (error) {
        console.error("Failed to fetch suggested places:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPlaces();
  }, []);

  return (
    <div className="top-suggested-section w-full py-10 px-5">
      <h2 className="text-2xl md:text-4xl font-bold text-center mt-4 mb-4 md:mb-8">
        Top Suggested Places
      </h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {place.map((place) => (
            <div key={place.$id} className="w-full">
              <PlaceCard post={place} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default TopSuggestedPlaces;
