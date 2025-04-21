
import GridPostList from "@/components/shared/GridPostList";
import { getCurrentUser } from "@/lib/appwrite/api";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";




const Saved = () => {

    
  const [currentUser, setCurrentUser] = useState<Models.Document | null>(null);
    const [savePosts, setSavePosts] = useState([]);
   
  
    useEffect(() => {
      const fetchSavedPosts = async () => {
        try {
          const user = await getCurrentUser();
          console.log("Current User", user);
  
          if (!user || !user.save) {
            console.error("User data or saved posts not available.");
            setSavePosts([]);
            return;
          }
  
          const posts = user.save
            .map((savePost: Models.Document) => ({
              ...savePost.place,
              creator: {
                imageUrl: user.imageUrl,
              },
            }))
            .reverse();
  
          setCurrentUser(user);
          console.log("Saved Posts", posts);
          setSavePosts(posts);
        } catch (error) {
          console.error("Error fetching saved posts:", error);
          setSavePosts([]);
        } 
      };
  
      fetchSavedPosts();
    }, []);

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader  className="animate-spin text-primary" size={32}/>
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList  post={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;