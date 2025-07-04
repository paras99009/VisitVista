import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import useDebounce from "@/hooks/useDebounce";
import { Loader, X } from "lucide-react";  // Import the X (cross) icon from lucide-react
import GridPostList from "@/components/shared/GridPostList";
import { Input } from "@/components/ui/input";
import { useGetPost, useSearchPost } from "@/lib/appwrite/reac-query/queriesAndMutations";

export type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
  if (isSearchFetching) {
    return <Loader className="animate-spin text-primary" size={32} />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList post={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPost();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPost(debouncedSearch);

  const categoryNames = [
    "Party", "Romantic", "Cultural", "Relaxing", "Adventurous", "Family-Friendly", 
    "Luxury", "Nature", "Spiritual", "Wellness", "Historical", "Foodie", 
    "Solo Travel", "Pet-Friendly", "Offbeat", "Budget-Friendly", "Nightlife", 
    "Photography", "Festival Vibes", "Eco-Friendly"
  ];

  const searchUsingCategory = (category: string) => {
    if (category === searchValue) {
      // Clear search value if the category is clicked again
      setSearchValue("");
    } else {
      setSearchValue(category);
    }
  };

  const clearSearch = () => {
    setSearchValue(""); // Clears the search value when cross icon is clicked
  };

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    } else {
      window.scroll(0, 0);
    }
  }, [inView, searchValue]);

  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Places</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
          {searchValue && (
            <button
              className="text-light-2 p-2"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={16} /> {/* Using the cross icon from lucide-react */}
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-4 mt-6 mb-10 w-full max-w-5xl overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer w-65">
          {categoryNames.map((category, index) => {
            const colors = [
              "bg-red", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500",
              "bg-pink-500", "bg-orange-500", "bg-teal-500", "bg-indigo-500", "bg-cyan-500",
            ];
            const colorClass = colors[index % colors.length]; // Cycle through colors

            return (
              <button
                key={index}
                className={`small-medium md:base-medium text-white ${colorClass} h-10 rounded-xl w-56 flex items-center justify-center whitespace-nowrap`}
                onClick={() => searchUsingCategory(category)}
              >
                <p>{category}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-1 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} post={item.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      )}
    </div>
  );
};

export default Explore;
