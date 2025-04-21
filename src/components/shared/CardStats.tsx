import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { checkIsLiked } from "@/lib/utils";
import { Loader } from "lucide-react";
import {
} from "@/lib/appwrite/api";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/appwrite/reac-query/queriesAndMutations";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

function CardStats({ post, userId }: PostStatsProps) {
  const likesList = post?.likes.map((user:Models.Document)=>
    user.$id);
    const [likes,setLikes] = useState(likesList);
    const [isSaved,setIsSaved] = useState(false);

   

    const { mutate : likePosts } = useLikePost();
    const { mutate : savePost ,isPending:isSavingPost } = useSavePost();
    const { mutate : deleteSavedPost } = useDeleteSavedPost();


    const { data : currentUser } = useGetCurrentUser();
    const savedPostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post?.$id === post?.$id
      );
     
      useEffect(() => {
        if (currentUser) {
            const savedPostRecord = currentUser?.save.find(
                (record: Models.Document) => record.post?.$id === post?.$id
            );
            setIsSaved(!!savedPostRecord);  // Ensure it's set based on actual saved status
        }
    }, [currentUser]); 

    const handleLikePost = (e: React.MouseEvent)=>{
      e.stopPropagation();
      let newLikes = [...likes];
      const hasliked = newLikes.includes(userId);


      if(hasliked){
          newLikes = newLikes.filter((id)=> id !== userId);    
  }else{
      newLikes.push(userId);
  }
  setLikes(newLikes);
  likePosts({
      postId: post?.$id || " ",
      likesArray: newLikes,
  })
  }

  const handleSavePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
      e.stopPropagation();
  
      if (savedPostRecord) {
          setIsSaved(false);
          deleteSavedPost(savedPostRecord.$id, {
              onSuccess: () => {
              }
          });
          return;
      }
  
      savePost({ userId: userId, postId: post?.$id || " "}, {
          onSuccess: () => {
              setIsSaved(true);
          }
      });
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost ? (
          <Loader className="animate-spin text-primary" size={32}  />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

export default CardStats;
