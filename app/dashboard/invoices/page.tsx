import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data'; //chapter 11. 추가
 
export default async function Page({
    searchParams,
}:{
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query); //서버에서 데이터를 가져와 컴포넌트에 prop로 전달

    return (
    <div className="w-full">
        <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search placeholder="Search invoices..." />  {/* search는 client 구성 요소 이므로 useSearchParams() 훅을 사용하여 구성 요소에 접근 */}
            {/* 일반적으로 client 매개변수를 읽으려면 useSEarchParams() 훅을 사용하여 서버로 돌아갈 필요가 없도록 사용하세요! */}
            <CreateInvoice />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
            <Table query={query} currentPage={currentPage} /> {/* table은 server 구성 요소 이므로 searchParams 페이지에서 구성 요소에 접근 */}
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
        </div>
    </div>
    );
}