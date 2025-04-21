import PlaceCard from '@/components/shared/PlaceCard'
import {  topPlacesFavourite } from '@/lib/appwrite/api'
import { Models } from 'appwrite'
import { Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function TopFavouritePLaces() {

        const [places, setPlaces] = useState<Models.Document[]>([])
        const [loading, setLoading] = useState(false)
      
        useEffect(() => {
            setLoading(true)
          const fetchPlaces = async () => {
            try {
              const response = await topPlacesFavourite()
              if (response && response.documents) {
                setPlaces(response.documents)
              }
            } catch (error) {
              console.error("Failed to fetch places", error)
            } finally {
              setLoading(false)
            }
          }
      
          fetchPlaces()
        }, [])

    return (
        <div className="top-suggested-section w-full py-10 px-5">
          <h2 className="text-2xl md:text-4xl font-bold text-center mt-4 mb-4 md:mb-8">
            Top Favourite Places
          </h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
              {places.map((place) => (
                <div key={place.$id} className="w-full">
                  <PlaceCard post={place} />
                </div>
              ))}
            </div>
          )}
        </div>
      );
      
}

export default TopFavouritePLaces
