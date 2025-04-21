

import {  INewUser } from '@/types'
import {
useQuery,
useMutation,
useQueryClient,
useInfiniteQuery

} from '@tanstack/react-query'
import {  createUserAccount, deleteSavedPost,getCurrentUser,getInfinitePlace,getPlaceById,likePost, savePost, searchPost, signInAccount, signOutAccount} from '../api'
import { QUERY_KEYS } from './queryKeys';





// Ye custom hook `useCreateUserAccount` ek mutation return karega jo naye user ka account create karega
export const useCreateUserAccount = () => {
    return useMutation(
        {
            // mutationFn ka kaam hai API function ko call karna jab mutation execute ho
            mutationFn: (user: INewUser) => createUserAccount(user)
        }
    )
}

// Ye custom hook `useSignInAccount` ek mutation return karega jo existing user ko sign in karega
export const useSignInAccount = () => {
    return useMutation(
        {
            // mutationFn ka kaam hai API function ko call karna jab mutation execute ho
            mutationFn: (user: { email: string, password: string }) => signInAccount(user)
        }
    )
}
export const useSignOutAccount = () => {
    return useMutation(
        {
            // mutationFn ka kaam hai API function ko call karna jab mutation execute ho
            mutationFn: ()=> signOutAccount()
        }
    )
}





export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        postId,
        likesArray,
      }: {
        postId: string;
        likesArray: string[];
      }) => likePost(postId, likesArray),
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };


  export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost( postId, userId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };
 
  export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };  









export const useSearchPost = (searchTerm : string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn: ()=> searchPost(searchTerm),
    enabled: !!searchTerm
  })

}




export const useGetPost = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS],
    queryFn: getInfinitePlace,
    initialPageParam: null, // Ensure a proper initial value
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.documents.length === 0) return null;
      return lastPage.documents[lastPage.documents.length - 1].$id; // Use the document ID
    },
  });
};





export const useGetPostById = (postId:string)=>{
  return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID,postId],
      queryFn: ()=> getPlaceById(postId),
      enabled: !!postId
      
  })
}


export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};
