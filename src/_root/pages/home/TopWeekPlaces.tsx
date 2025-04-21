
import PlaceCard from "@/components/shared/PlaceCard"
import { getAllPlaces } from "@/lib/appwrite/api"
import { Models } from "appwrite"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"

function TopWeekPlaces() {
    const [places, setPlaces] = useState<Models.Document[]>([])
    const [loading, setLoading] = useState(false)
  
    useEffect(() => {
        setLoading(true)
      const fetchPlaces = async () => {
        try {
          const response = await getAllPlaces()
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
<div className='w-full shadow-md flex flex-col  justify-start  gap-4 items-center'>
  <h1 className='text-2xl md:text-4xl font-bold px-4 mt-4 mb-4  items-center'>Top Places this Month</h1> 
  <div className="w-full flex flex-wrap  justify-center p-4 gap-4 items-center">
    {
      loading ? (
        
            <Loader className="animate-spin text-primary" size={32} />
     
      ) : (
        places.map((place,index) => ( 
          index<8 &&
          <div key={place.$id} className="w-full sm:w-[48%] md:w-[23%]">
            <PlaceCard post={place} />
          </div>
        ))
      )
    }
  </div>
</div>
  )
}

export default TopWeekPlaces
