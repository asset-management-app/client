"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { FC, Fragment } from "react";
import SearchIcon from "@public/icon/search.svg";
import Image from "next/image";

interface SearchProps {
  setCurrentPage?: (value: number) => void;
}

const Search: FC<SearchProps> = (props) => {
  const { setCurrentPage } = props;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1')
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    // setCurrentPage(1);
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  return (
    <Fragment>
      <div className="relative w-52 h-full">
        <input
          id=""
          defaultValue={searchParams.get("query")?.toString()}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className="w-full pr-9 rounded border-solid border outline-none px-2 py-1 border-graycustom"
        />
        <button type="button" className="absolute top-0 p-2 h-full right-0 border-l-graycustom border-l">
          <Image src={SearchIcon} width={15} height={15} alt={"search icon"} />
        </button>
      </div>
    </Fragment>
  );
};
export default Search;
