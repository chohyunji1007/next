import { Inter, Lusitana } from 'next/font/google';
// 구글 모튤에서 Inter 글꼴을 가져와 사용
export const inter = Inter({subsets : ['latin']});

export const lusitana = Lusitana({
    weight : ['400', '700'],
    subsets : ['latin'],
});