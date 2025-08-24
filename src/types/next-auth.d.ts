import NextAuth from 'next-auth';

// 扩展User类型，添加自定义字段
declare module 'next-auth' {
  interface User {
    role: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  }

  // 扩展Session类型，确保会话中包含自定义字段
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string;
      profileImageUrl?: string;
    } & DefaultSession['user'];
  }
}

// 扩展JWT类型
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  }
}
