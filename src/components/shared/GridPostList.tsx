import { useUserContext } from '@/context/AuthContext';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import CardStats from './CardStats';

type GridPostListProps={
    post: Models.Document[],
    showUser? : boolean 
    showStats? : boolean 


}

function GridPostList({post , showUser=true , showStats= true} : GridPostListProps) {

    const {user} = useUserContext();
   

  return (
    <ul className='grid-container'>
      {post.map((post)=>{

        // if (!post?.imageUrl) return null; // Skip if imageUrl is not present
        return (
          <li key={post.$id} className='relative min-w-80 h-80'>
            <Link to={`/places/${post.$id}`} className='grid-post_link'>
          
        <img
          src={post?.imageUrl1?.replace('preview', 'view')}
          alt='post-image'
          className='h-full w-full object-cover'
          key={post.$id}
        />
      
            </Link>
            <div className='grid-post_user'>
              {showUser  && (
                <div className='flex items-center justify-start gap-2 flex-1'>
                 
                  <p className='line-clamp-1 text-2xl'>{post.name}</p>

                </div>
              )}
              {
                showStats && (<CardStats userId={user.id} post={post}/>)
              }

            </div>
          </li>
        )
      })}

    </ul>
  )
}

export default GridPostList
