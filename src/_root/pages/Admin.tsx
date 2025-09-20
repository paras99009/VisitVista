// app/admin/page.tsx (or your component file)

import { useUserContext } from "@/context/AuthContext";
 // adjust imports based on your file structure
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { useQuery } from "@tanstack/react-query";
import { getAllPlaces } from "@/lib/appwrite/api";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import UserCard from "@/components/shared/UserCard";
import { Bookmark, MapPinHouse, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Admin() {
  const { user } = useUserContext();
  console.log(user, "this is user in admin page");
  let isAdmin = false;
  if(user.email==="student@gmail.com"){
    isAdmin= true;
  }
  const navigate = useNavigate();

  // Dummy queries (replace with actual query logic using Appwrite)
  const { data: places } = useQuery({
    queryKey: ["places"],
    queryFn: getAllPlaces,
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // simulate fetching all users
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId
      );
      return res.documents;
    },
  });



  const { data: savedDocs } = useQuery({
    queryKey: ["saves"],
    queryFn: async () => {
      const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollectionId
      );
      return res.documents;
    },
  });

  return (
    <>
  {isAdmin ? (
    <div className="w-full min-h-screen p-6 space-y-10 bg-black">
      <h1 className="text-4xl font-bold text-light-4">Admin Panel</h1>

      {/* Profile Section */}
     {/* Profile Section */}
<div className="flex  justify-between items-center bg-gray-900 p-6 rounded-xl shadow-md flex-wrap gap-6">
  <div className="flex items-center space-x-6">
    <Avatar className="h-20 z-30 w-20" >
      <AvatarImage src={user.imageUrl} />
      <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
    </Avatar>
    <div>
      <p className="text-2xl font-bold text-white">
        Admin Name: {user.name}
      </p>
      <p className="text-lg text-gray-400">Email: {user.email}</p>
    </div>
  </div>
  
  {/* Create Place Button */}
  <button
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-semibold transition-all"
    onClick={() => {
      // Navigate to the create place page
      navigate("/create"); 
    }}
  >
    + Create Place
  </button>
</div>

      {/* Divider */}
      <div className="h-[2px] w-full bg-white/20" />

      {/* Analytics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 text-center space-y-2">
            <div className="flex justify-center">
             <User className="h-10 w-10" />
            </div>
            <p className="text-5xl font-bold text-indigo-500">
              {users?.length || 0}
            </p>
            <p className="text-lg font-medium text-gray-400">Users</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 text-center space-y-2">
            <div className="flex justify-center">
           <Bookmark className="h-10 w-10" />
            </div>
            <p className="text-5xl font-bold text-emerald-500">
              {savedDocs?.length || 0}
            </p>
            <p className="text-lg font-medium text-gray-400">Saved Documents</p>
          </CardContent>
        </Card>
      <Link to="/" className="w-full">
        <Card className="shadow-lg hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 text-center space-y-2">
            <div className="flex justify-center">
              <MapPinHouse className="h-10 w-10" />
            </div>
            <p className="text-5xl font-bold text-orange-500">
              {places?.documents?.length || 0}
            </p>
            <p className="text-lg font-medium text-gray-400">Places</p>
          </CardContent>
        </Card>
        </Link>
      </div>

      {/* Divider */}
      <div className="h-[2px] w-full bg-white/20" />

      {/* Users List Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-light-4 mb-4">Users List</h2>
        <ul className="grid xl:grid-cols-4 gap-6">
          {users?.map((user) => (
            <li key={user.$id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Access Denied</h1>
      <p className="text-lg">You are not authorized to access this page</p>
    </div>
  )}
</>

  );
}

export default Admin;
