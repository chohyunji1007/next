'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; //chapter 10. 추가
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const  handleSearch = useDebouncedCallback((term)=>{
    console.log(`Searching ... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if(term){ //검색값이 존재 할때 ?query='term'
      params.set('query', term);
    }else{ //검색값이 존재하지 않을 때 url에서 query 삭제
      params.delete('query');
    }
    // console.log(term);
    replace(`${pathname}?${params.toString()}`); //page를 다시 load하지 않고 url이 업데이트 됨!
  }, 300); // handelSearch()를 useDebouncedCallback을 통해 래핑 해 사용자가 입력을 중지한 후 300ms 후에 코드가 실행되도록 함
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(event) => {
          handleSearch(event.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
