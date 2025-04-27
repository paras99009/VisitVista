
import { INewUser, IUpdatePost, NewPlaces } from "@/types";
import { ID, Models, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";


export async function createUserAccount(user: INewUser) {

    
    try {
      // ✅ Logout any existing session before creating a new one
      try {
        await account.deleteSessions();
      } catch (error) {
        console.log("No active session found, proceeding with sign-up.");
        console.log(error)
      }

      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );

      await account.createEmailPasswordSession(user.email, user.password);
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(user.name);
  
      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
      });
      console.log(newUser)
     
      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string,
  email: string,
  name: string,
  imageUrl: string,
  username: string,
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    console.log("✅ Document created:", newUser);
    return newUser;
  } catch (error) {
    console.log("❌ Error while saving user to DB:", error);
    throw error; // important: so error propagates to calling function
  }
}

  // ============================== GET ACCOUNT
  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
  }




export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );
     console.log("get current user function is running")


    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}




// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    console.log("Checking session before signing in...");
    const existingSession = await getAccount();
    console.log("Existing session:", existingSession);

    if (existingSession) {
      await account.deleteSessions();
    }

    const session = await account.createEmailPasswordSession(user.email, user.password);
    console.log("New session created:", session);

    return session;
  } catch (error: any) {
    console.error("Sign in error:", error);

    // Optional: throw error so that caller (handleSignin) can show toast
    throw new Error(error?.message || "Failed to sign in.");
  }
}



export async function signOutAccount(){

  try {
      const session = await account.deleteSession('current');

      return session;
      
  } catch (error) {
      console.log(error)
      console.log(" is in the signOutAccount")
      
  }
}





// ============================== CREATE POST
export async function createPost(post: NewPlaces) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
  
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    // Convert mood into array
    const moods = post.mood?.replace(/ /g, "").split(",") || [];
   
    // Create post
    const newPlace = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      ID.unique(),
      {
        name: post.name,
        description: post.description,
        imageUrl1: fileUrl,          // ✅ URL from Appwrite after upload
        imageId: uploadedFile.$id,  // ✅ Store file ID for delete later (optional)
        location: post.location,
        tags: tags,
        mood: moods,
        bestTimeToVisit: post.bestTimeToVisit,
        madeby: post.userId        // ✅ User ID from session
      }
    );
     console.log("from the api side",(newPlace))
    if (!newPlace) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPlace;
  } catch (error) {
    console.log(error);
    console.log("Error creating post");
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
    console.log("Error uploading file");
  }
}

// ============================== GET FILE URL
import { ImageGravity } from "appwrite"; // Import the enum




export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top, // Use enum value instead of string
      100
    );

    if (!fileUrl) throw new Error("File preview URL not found");

    return fileUrl;
  } catch (error) {
    console.log(error);
    console.log("Error getting file preview URL");
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
    console.log("Error deleting file");
  }
}



// ===========get top places ========================
export async function getAllPlaces() {
  try {
    const places = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      [Query.orderDesc('$createdAt'),Query.limit(8)],
    )

    console.log("get get all places function is running")
    return places;

    
  } catch (error) {
    console.log(error);
    console.log("Error fetching all places");
  }
}





export async function getTopPlaces() {

  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      [
        Query.orderDesc("likes"), // sorting by number of likes
        Query.limit(5)
      ]
    );
    console.log("get Top places function is running")

    return response;
  } catch (error) {
    console.error("Error fetching top places:", error);
  } 
}





export async function likePost(postId: string , likesArray:string[]){
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if(!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error)
    console.log("Error liking post")
  }
}

export async function savePost(postId: string , userId:string){
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        place: postId
        
      }
    )
    if(!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error)
    console.log("Error liking post")
  }
}


export async function deleteSavedPost(savedRecordId:string){
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    )
    if(!statusCode) throw Error;
    return statusCode;
  } catch (error) {
    console.log(error)
    console.log("Error liking post")
  }

}


type TopSuggestedPlace = Models.Document & {
  name: string;
  location: string;
  imageUrl: string;
};


export async function topSuggestedPlaces() : Promise<TopSuggestedPlace[]>{
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId, // Replace with your database ID
      appwriteConfig.placesCollectionId, // Replace with your collection ID for places
      [
        Query.limit(4), // Fetch 10 random places
        Query.orderAsc("$createdAt"), // Optionally, order results randomly
      ]
    );
    console.log("get Top suggested function is running")
    return  response.documents as TopSuggestedPlace[];
  } catch (error) {
    console.error("Error fetching top suggested places:", error);
    return [];
  }
}


export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}



// export async function topFavouritePlaces(): Promise<Models.DocumentList<Models.Document>> {
//   try {
//     const response = await databases.listDocuments(
//       appwriteConfig.databaseId, // Replace with your database ID
//       appwriteConfig.placesCollectionId, // Replace with your collection ID
//       [
//         Query.orderDesc("likes"), // Sort by the number of likes in descending order
//         Query.limit(4), // Limit to 4 places
//       ]
//     );
//     console.log("get Top Favourite places function is running")

//     return response ; // Cast to the expected type
//   } catch (error) {
//     console.error("Error fetching top favourite places:", error);
//     return { documents: [], total: 0, }; // Return an empty list in case of error
//   }
// }


export async function topPlacesFavourite() {
  try {
    const places = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      [
        Query.orderDesc('$createdAt'), // Sort by creation date in descending order
        Query.limit(4)
      ]
    );

    console.log("get Top Places favourite2 function is running")
  
    return places 
  } catch (error) {
    console.log(error);
    console.log("Error fetching top favorite places");
    throw error;
  }
}








export async function getPlaceById(postId:string){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      postId
    )
    if(!post) throw Error;
    return post;

    
  } catch (error) {
    console.log(error);
    console.log("Error getting post by id")
    
  }

}






export async function getInfinitePlace({ pageParam }: { pageParam: string | null }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam)); // Pass as a string, as it should be a document ID
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      queries
    );

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function searchPost(searchTerm : string){
 

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      [Query.search('mood',searchTerm)]
    ) 
    if(!posts){
      throw Error 
    }
    return posts;
    
  } catch (error) {
    console.log(error)
    console.log("error in search place")
  }
}




export async function getPlacesById(postId:string){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      postId
    )
    if(!post) throw Error;
    return post;

    
  } catch (error) {
    console.log(error);
    console.log("Error getting post by id")
    
  }

}



export async function updatePlaces(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: new URL(post.imageUrl), // Convert to URL
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to Appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("File upload failed");

      // Get new file URL
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to retrieve file URL");
      }

      image = { ...image, imageUrl: new URL(fileUrl), imageId: uploadedFile.$id };
    }

    // Convert tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl.toString(), // Store as string in DB
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    // Handle update failure
    if (!updatedPost) {
      if (hasFileToUpdate) await deleteFile(image.imageId);
      throw new Error("Failed to update post");
    }

    // Delete old file after successful update
    if (hasFileToUpdate) await deleteFile(post.imageId);

    return updatedPost;
  } catch (error) {
    console.error(error);
  }
}




export async function deletePlaces(postId: string, imageId: string){
  if(!postId || !imageId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.placesCollectionId,
      postId
    )
    return { status : "ok" };
    
  } catch (error) {
    console.log(error)  
    console.log("Error deleting post")
    
  }
}
