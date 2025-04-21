import { useUserContext } from "@/context/AuthContext"
import { Loader, SendIcon } from "lucide-react";


function AiChat() {
  const { user, onSent ,  input,
    setInput,
    recentPrompt,
    showResult,
    loading,
    result,
 } = useUserContext();

  return (
    <div className="hide-scrollbar">
    
    <div className="m-4 h-screen  overflow-y-auto hide-scrollbar">
      <p className="text-light-3 text-sm md:text-xl">
        Chat with our AI to get personalized recommendations and answers to your questions.
      </p>

      {/* First AI message */}
      <div className=" flex p-4 mt-4">
        <div className="flex gap-2">
          <img 
            src="/assets/icons/chat.svg" 
            className="h-8 w-8 rounded-full md:h-12 md:w-12" 
            alt="ai-logo" 
          />
          <div className="border-light-4 max-w-md md:max-w-lg border-2 rounded-xl p-4 mt-4 bg-gray-600">
          🌍 Hey there, traveler! Ready to explore? I'm your virtual travel buddy here to help you discover amazing places, plan perfect dates, or sort out any location troubles. Just ask me anything related to travel, tourism, or planning your next adventure! ✈️✨

          </div>
        </div>
      </div>

      {/* User reply */}
{  showResult&&     
     <div className=" flex flex-row-reverse  rounded-lg p-4 mt-4">
        <div className="flex flex-row-reverse gap-2">
          <img 
            src={user.imageUrl || "/assets/images/profile.png"} 
            className="h-8 w-8 rounded-full md:h-12 md:w-12" 
            alt="avatar" 
          />
          <div className="border-light-4 border-2 rounded-xl p-4 max-w-sm md:max-w-lg mt-4 bg-gray-600">
          {recentPrompt}
          </div>
        </div>
      </div>}
      

    <div>
{  showResult&&   <div className=" flex  p-4 mt-4">
<div className="flex gap-2">
  <img 
    src="/assets/icons/chat.svg" 
    className="h-8 w-8 rounded-full md:h-12 md:w-12" 
    alt="ai-logo" 
  />
  {loading?
  <Loader className="animate-spin text-primary" size={32}/>
  :
  <>
    <div className="border-light-4 max-w-md md:max-w-lg border-2 rounded-xl p-4 mt-4 bg-gray-600" dangerouslySetInnerHTML={{ __html: result }}></div>
  </>
   }

  </div>
</div>}
</div>
</div>
      <div className=" m-1   rounded-xl  bg-gray-700 p-4 flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Type your message..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 rounded-lg  focus:outline-none focus:ring-0 bg-gray-700 text-white" 
        />
        <button 
          onClick={onSent} 
          className="bg-light-4 text-white p-2 rounded-lg flex items-center w-13 rounded-xl"
        >
          <p className="hidden md:block">
          Send

          </p>
          <SendIcon/>
        </button>
      </div>




  
  
      {/* Input box at the bottom */}
      </div>
  );
}




export default AiChat
