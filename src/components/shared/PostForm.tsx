
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea';
import FormUploader from "./FormUploader";
import { PlaceValidation } from "@/validation";
import { Models } from 'appwrite';
import { createPost } from "@/lib/appwrite/api";
import { useUserContext } from '@/context/AuthContext';



 //defining the post type 
type PostFormProps = {  
  post?: Models.Document;
  action : 'Create' | 'Update'
}

const PostForm = ({ post, action } : PostFormProps) => {


  const {user} = useUserContext()
  // const navigate = useNavigate();




  //defining the form 
    const form = useForm<z.infer<typeof PlaceValidation>>({
        resolver: zodResolver(PlaceValidation),
        defaultValues: {
          name: post ? post.name : "",
          description: post ? post.description : "",
          file: post ? post.imageUrl : "",
          location: post ? post.location : "",
          tags: post ? post.tags : [],
          mood: post ? post.mood : [],
          entryFee: post ? post.entryFee : "",
          bestTimeToVisit: post ? post.bestTimeToVisit : "",
          openingHours: post ? post.openingHours : "",
        },
      });
      


        // 2. Define a submit handler.
        async function onSubmit(values: z.infer<typeof PlaceValidation>) {
            const newPost = await createPost({
                ...values,
                userId : user.id,
                mood: values.mood ?? "",
                entryFee: values.entryFee ?? "",
                bestTimeToVisit: values.bestTimeToVisit ?? "",
                openingHours: values.openingHours ?? "",
                tags: values.tags ?? "", // ✅ tags should remain a string, not array
              });
              if(!newPost){
                console.log({
                  title:"PLease Try Again"
                })
              }
            //  navigate("/");
      
      
      
              console.log(values)
          }
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl ">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className='shad-textarea custom-scrollbar' placeholder="shadcn" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className='shad-textarea custom-scrollbar' placeholder="shadcn" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Photo</FormLabel>
                  <FormControl>
                    <FormUploader fieldChange = {field.onChange} mediaUrl={post?.imageUrl.replace("/preview", "/view")} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Location</FormLabel>
                  <FormControl>
                    <Input  type='text' className='shad-input' placeholder="Location" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Tags (seperated by comma " , ")</FormLabel>
                  <FormControl>
                    <Input type='text' className='shad-input' placeholder="Art, Expression, Learing" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Moods (seperated by comma " , ")</FormLabel>
                  <FormControl>
                    <Input type='text' className='shad-input' placeholder="Art, Expression, Learing" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="entryFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the Entry Fee</FormLabel>
                  <FormControl>
                    <Input type='text' className='shad-input' placeholder="Art, Expression, Learing" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bestTimeToVisit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Best Time to Visit</FormLabel>
                  <FormControl>
                    <Input type='text' className='shad-input' placeholder="Art, Expression, Learing" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openingHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the opening Hours</FormLabel>
                  <FormControl>
                    <Input type='text' className='shad-input' placeholder="Art, Expression, Learing" {...field} />
                  </FormControl>
                 
                  <FormMessage className='shad-form_message' />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-4 justify-end'>
            <Button type="button" className='shad-button_dark_4'>Cancel</Button>
           {/* {isLoadingCreate? (
            <Loader/>
           ):( */}

            <Button type="submit" className='shad-button_primary whitespace-nowrap' > {action} Post</Button>
           {/* )} */}

            </div>
          </form>
        </Form>
      )
}

export default PostForm
