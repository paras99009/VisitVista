
import { Link } from "react-router-dom";

const categories = [
  { name: "Party", icon: "🥳", color: "bg-yellow-300" },
  { name: "Relaxed", icon: "😌", color: "bg-blue-300" },
  { name: "Adventurous", icon: "🧗‍♂️", color: "bg-green-300" },
  { name: "Romantic", icon: " 💖", color: "bg-pink-300" },
  { name: "Spiritual", icon: "🕉️", color: "bg-purple-300" },
];

const TopCategory = () => {




  return (
    <div className="top-category-section w-full py-10 px-5">
      <h2 className="text-2xl md:text-4xl font-bold text-center mt-4 mb-4 md:mb-8">Explore Top Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {categories.map((category) => (
          <Link
          to={`/explore`}
            key={category.name}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl shadow-lg transition-all ${category.color} hover:scale-105`}
            
          ><p className="h-8 w-8 ">

           {category.icon}
          </p>
            <p className="text-lg font-semibold">{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCategory;
