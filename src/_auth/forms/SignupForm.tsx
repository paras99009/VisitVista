import * as z from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


// import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";

import { SignupValidation } from "@/validation";
import { createUserAccount } from "@/lib/appwrite/api";
import { Loader, MapPin } from "lucide-react";
import { useState } from "react";





const SignupForm = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();

const navigate = useNavigate();
const [ loading, setLoading] = useState(false)


  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      setLoading(true)
      const newUser = await createUserAccount({
        email: user.email,
        password: user.password,
        name: user.name,
        username: user.username,
      });

      if (!newUser) throw new Error("User creation failed");
      // Optionally, you can set the user in a global state or context
       setLoading(false)
      console.log("User created:", newUser);
      navigate("/"); // or navigate to /home/dashboard
  
    } catch (error) {
      console.error("Signup failed:", error);
      // Optionally toast or display message
    }finally{
      setLoading(false)
    }

  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
      <h1 className="text-5xl text-bold flex flex-col gap-1"><span><MapPin height={47} width={37}/></span> <p>Visit Vista</p></h1>

        <h2 className="h3-bold md:h2-bold ">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use snapgram, Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            Sign up
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
           {loading ? (
           <Loader/>
           ):(
          
           <Link
             to="/sign-in"
             className="text-primary-500 text-small-semibold ml-1">
             Log in
           </Link>
          )
           }

            
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;