import CardStats from '@/components/shared/CardStats'
import PlaceCard from '@/components/shared/PlaceCard'


import { useUserContext } from '@/context/AuthContext'
import { getAllPlaces } from '@/lib/appwrite/api'
import { useGetPostById } from '@/lib/appwrite/reac-query/queriesAndMutations'
import { Models } from 'appwrite'

import { InfoIcon, Loader, MapIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const PlaceDetails = () => {
  const {id} = useParams()
  const {data:post, isPending : isLoading} = useGetPostById(id ||" " );
  const {user  } = useUserContext();
  const [suggestedPlaces, setSuggestedPlaces] = useState<Models.Document[]>([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await getAllPlaces();
        const filteredPlaces = response?.documents.filter((place: Models.Document) => {
          return post?.mood?.some((mood: Models.Document) => place.mood.includes(mood));
        });
        setSuggestedPlaces(filteredPlaces || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, [post]);

  console.log("suggestedPlaces",suggestedPlaces)

 
  return (


    <div>
        <p className='m-4 text-md md:text-2xl'>
       You can also search these categories 
        <p className='text-light-3 text-sm md:text-xl'>
                {post?.mood?.join(', ') || 'Not specified'}
        </p>
        </p>

  

 
    <div className='post_details-container'>
        {isLoading || !post ? (
        <Loader  className="animate-spin text-primary" size={32} />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl1.replace('preview','view')}
            alt="creator"
            className="post_details-img"
          />

          <div className="post_details-info">
            <div className="flex-between w-full text-2xl  md:text-3xl">
             {post.name}
            </div>
            <p>
             Location:   {post.location}

            </p>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p> About :{post?.description.slice(0,180)}...</p>
              <ul className="flex gap-1 mt-2">
                Tags:
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
              <p>
                <span className="font-semibold">Moods:</span>{' '}
                {post?.mood?.join(', ') || 'Not specified'}
              </p>
              <p>
                <span className="font-semibold">Entry Fee:</span>{' '}
                {post?.entryFee || 'Free'}
              </p>
              <p>
                <span className="font-semibold">Best Time to Visit:</span>{' '}
                {post?.bestTimeToVisit || 'Anytime'}
              </p>
              <p>
                <span className="font-semibold">Opening Hours:</span>{' '}
                {post?.openingHours || 'Not available'}
              </p>
            <div>
              <Link to={`https://www.google.com/search?q=${post.name}`} target="_blank" className="text-light-3 hover:underline">
              <div className='flex items-center gap-2'>
              <InfoIcon/>
              View in Map

              </div>
              </Link>
            </div>
            <div>
              <Link to={`https://www.google.com/maps/place/${post.name} kanpur`} target="_blank" className="text-light-3 hover:underline">
              <div className='flex items-center gap-2'>
              <MapIcon/>
              View in Map

              </div>
              </Link>
            </div>
            </div>
       
              
            </div>
            

            <div className="w-full">
              <CardStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className='text-2xl font-semibold mt-4  mb-4 md:gap-4 lg:gap-8'>
        <p className='text-center'>
        Suggested Places

        </p>

        <div className='w-full grid grid-cols-1 gap-8 m-auto  md:grid-cols-2 lg:grid-cols-4 '>
          {
            suggestedPlaces.map((place: Models.Document,index) => ( 
              index< 4&&
              <div key={place.$id} className="w-full mt-8">
              <PlaceCard post={place} />
            </div>
            ))
          }


        </div>
        <div className='items-center justify-center flex  flex-row mt-4 rounded-xl'>
{          suggestedPlaces.length>0&&
  <Link to={'/explore'} className='bg-light-3  text-white  py-2 px-4 rounded-full hover:bg-light-4 transition duration-300'>
          <button className='bg-light-3  text-white  py-2 px-4 rounded-full hover:bg-light-4 transition duration-300'>

            Explore more {"-> "}

          </button>
          </Link>}
        </div>
      </div>
    </div>
    </div>
  )
}

export default PlaceDetails ; 
