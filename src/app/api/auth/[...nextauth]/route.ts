import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth'; // 导入配置

// 创建 NextAuth 处理程序
const handler = NextAuth(authOptions);

// 仅导出 HTTP 方法处理函数
export { handler as GET, handler as POST };