// app/admin/page.tsx (or your component file)

import { useUserContext } from "@/context/AuthContext";
 // adjust imports based on your file structure
import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { useQuery } from "@tanstack/react-query";
import { getAllPlaces } from "@/lib/appwrite/api";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

function Admin() {
  const { user } = useUserContext();
  const isAdmin = user.email === "test1@gmail.com";

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
        <div className="w-full min-h-screen p-6 space-y-8 bg-black">
          <h1 className="text-4xl font-bold text-light-4">Admin Panel</h1>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold text-gray-700">
                Admin Name: {user.name}
              </p>
              <p className="text-md text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-lg hover:scale-[1.02] transition-transform">
              <CardContent className="p-6 text-center">
                <p className="text-5xl font-bold text-indigo-600">
                  {users?.length || 0}
                </p>
                <p className="text-lg font-medium text-gray-600">Users</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:scale-[1.02] transition-transform">
              <CardContent className="p-6 text-center">
                <p className="text-5xl font-bold text-emerald-600">
                  {savedDocs?.length || 0}
                </p>
                <p className="text-lg font-medium text-gray-600">
                  Saved Documents
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:scale-[1.02] transition-transform">
              <CardContent className="p-6 text-center">
                <p className="text-5xl font-bold text-orange-600">
                  {places?.documents?.length || 0}
                </p>
                <p className="text-lg font-medium text-gray-600">Places</p>
              </CardContent>
            </Card>
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
