'use server'; //파일 내에서 내보낸 모든 기능을 서버 기능으로 표시 //chapter12. 추가

import { z } from 'zod'; //'zod' : typescript 우선 검증 라이브러리
import { sql } from '@vercel/postgres'; //db에 sql 전달 하려고
import { revalidatePath } from 'next/cache'; // 데이터를 업데이트 하므로 캐시를 지우고 서버에 대한 새 요청을 트리거할 때 사용
import { redirect } from 'next/navigation'; //페이지 리다이렉션
const FormSchema = z.object({ // 양식 개체의 모양과 일치하는 스키마 정의
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id:true, date:true}); // .omit({ 유효성 검사에서 제외할 필드 : 생성할 form에서 없는 값 })

export async function createInvoice(formData: FormData){
    const {customerId, amount, status } = CreateInvoice.parse({ //데이터 유효성 검사를 하고 내려옴
        customerId : formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100; //js에서 부동 소수점 오류를 제거하고 정확성을 높이기 위해 db에 돈은 센트 단위로 저장하는 것이 좋음
    const date = new Date().toISOString().split('T')[0];
    // const rawFormData = Object.fromEntries(formData.entries()) //data가 많은 경우 entries() 사용
    try{
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    //db가 업데이트 되면 /dashboard/invoices 경로의 유효성 검사를 하고 다시 서버에서 새로운 데이터를 가져옴
    revalidatePath('/dashboard/invoices');
    //새로 데이터를 가져온 뒤 리다이렉션
    redirect('/dashboard/invoices');
    }catch(error){
        return{
            message : 'Database Error : Failed to Create Invoice.',
        };
    }
    

    
}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 
// ...
 
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
  try{
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  }catch(error){
    return { message : 'Database Error: Failed to Update Invoice. '};
  }
  
 
  
}

export async function deleteInvoice(id: string) {
//   throw new Error('Failed to Delete Invoice');
 
  // Unreachable code block
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice' };
  }
}
