import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // Update: Using toast for notifications

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, MapPin } from "lucide-react";

// import { useUserContext } from "@/context/AuthContext";
import { SigninValidation } from "@/validation";
import { signInAccount } from "@/lib/appwrite/api";
import { useState } from "react";

const SignInForm = () => {
  
  const navigate = useNavigate();
  // const { checkAuthUser } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);  // State to manage login button loader

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
  setIsLoading(true);

  const session = await signInAccount(user);
  console.log(session, "this is session in signin form");

  // 🔁 Wait a bit for the session to propagate before checking
  await new Promise((res) => setTimeout(res, 1000)); // 1000ms delay

  // const isLoggedIn = await checkAuthUser();
  // console.log(isLoggedIn, "this is isLoggedIn in signin form");

  form.reset();

  if (session) {
    toast.success("Logged in successfully!");
    navigate("/"); // redirect after successful login
  } else {
    toast.error("Login failed. Please try again.");
  }

  setIsLoading(false);
};


  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h1 className="text-5xl text-bold flex gap-1">
          <span><MapPin height={47} width={35}/></span> <p>Visit Vista</p>
        </h1>

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className="flex flex-col gap-5 w-full mt-4">
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
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader className="animate-spin text-primary" size={32} /> Loading...
              </div>
            ) : (
              "Log in"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
