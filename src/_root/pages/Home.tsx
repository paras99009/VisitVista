
import TopCategory from './home/TopCategory'
import TopWeekPlaces from './home/TopWeekPlaces'
import TopSuggestedPlaces from './home/TopSuggestedPlaces'
import TopFavouritePLaces from './home/TopFavouritePLaces'

function Home() {
  return (
    <div className='mt-4'>
      <TopWeekPlaces />
      <TopFavouritePLaces />
      <TopCategory />
      <TopSuggestedPlaces />
    </div>
  )
}

export default Home
