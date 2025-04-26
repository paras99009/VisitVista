import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";
import runChat from "@/config/gemini";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  onSent: () => {},
  input: "",
  setInput: () => {},
  recentPrompt: "",
  setRecentPrompt: () => {},
  showResult: false,
  setShowResult: () => {},
  loading: false,
  setLoading: () => {},
  result: "",
  setResult: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  onSent: () => void;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  recentPrompt: string;
  setRecentPrompt: React.Dispatch<React.SetStateAction<string>>;
  showResult: boolean;
  setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false); // Prevent multiple auth checks

  const delayPara = (index:number,nextWord:string)=>{
    setTimeout(function()  {
      setResult(prev=>prev+nextWord)
      
    }, 75*index);
   }
   


  const onSent = async () => {
    setResult("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    const response = (await runChat(input)) ?? "";
    const response1 = response?.split("**") || [];
    let newRes: string = "";
    if (!response1[0]) {
      setResult(response);
      return;
    }
    for (let i = 0; i < response1.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newRes += response1[i];
      } else {
        newRes += "<b>" + response1[i] + "</b>";
      }
    }
    const newRes2 = newRes.split("**").join("<br/>").replace(/\*/g, "<br/>");
    const newResponseArray = newRes2.split(" ");
    setShowResult(true);
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i] + " ";
      delayPara(i,nextWord);
    }
    setInput("")

      
    setLoading(false);
    
  };

  const checkAuthUser = async (): Promise<boolean> => {
    if (hasCheckedAuth) return isAuthenticated; // Prevent multiple executions
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        console.log("User authenticated:", currentAccount);
        return true; // Explicitly return true
      }
    } catch (error) {
      console.error("Error in checkAuthUser:", error);
    } finally {
      setIsLoading(false);
      setHasCheckedAuth(true); // Mark auth check as done
    }
    setIsAuthenticated(false);
    return false; // Explicitly return false for error case
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (!cookieFallback || cookieFallback === "[]") {
      navigate("/sign-up");
    }
    checkAuthUser();
  }, []); // Empty dependency ensures it runs only once on mount

  const value1 = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    onSent,
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    result,
    setResult,
  };

  return <AuthContext.Provider value={value1}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
