import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import CardStats from "./CardStats";

type PostCardProps = {
  post: Models.Document;
};

const PlaceCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.madeby || !Array.isArray(post.tags)) {
    console.warn("Invalid post data", post);
    return null;
  }

  return (
    <div className="bg-dark-3   rounded-xl shadow-md w-[300px] h-[450px] flex flex-col overflow-hidden relative" style={{zIndex:-1}}>
      {/* Image */}
      <div className="relative w-full h-[180px]">
        <Link to={`/places/${post.$id}`}>
          <img
            src={
              post.imageUrl1
                ? post.imageUrl1.replace("/preview", "/view")
                : "/assets/icons/profile-placeholder.svg"
            }
            alt="post"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow p-4 overflow-hidden">
        <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-4">
          <Link to={`/places/${post.$id}`}>
            <p className="text-light-1 text-2xl font-semibold  line-clamp-1">
              {post.name}
            </p>
          </Link>

          <div>
            <p className="text-md text-light-1 line-clamp-2">
              Location: {post.location || "N/A"}
            </p>
            <ul className="flex gap-1 mt-2 flex-wrap">
              {post.tags.slice(0, 5).map((tag: string, index: number) => (
                <li
                  key={`${tag}-${index}`}
                  className="text-light-4 text-sm font-medium"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats at bottom */}
        <div className="pt-2">
          <CardStats post={post} userId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
