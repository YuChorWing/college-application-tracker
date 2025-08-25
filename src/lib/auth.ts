import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma'; // 导入Prisma单例
import bcrypt from 'bcryptjs'; // 用于密码哈希验证

// 定义认证配置
export const authOptions: NextAuthOptions = {
  // 会话策略：使用JWT（适合无服务器环境）
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 会话有效期30天
  },

  // 配置登录提供商（这里使用账号密码登录）
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      
      // 验证账号密码
      async authorize(credentials,req) {
        // 检查邮箱和密码是否提供
        if (!credentials?.email || !credentials?.password) {
          // throw new Error('请输入邮箱和密码');
          return null;
        }

        // 从数据库查询用户
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // 检查用户是否存在
        if (!user) {
          // throw new Error('邮箱或密码错误');
          return null;
        }

        // 检查密码是否正确（对比哈希值）
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash || '' // 确保数据库中存储了哈希后的密码
        );

        if (!isPasswordValid) {
          // throw new Error('邮箱或密码错误');
          return null;
        }

        // 返回用户信息（会被存入JWT）
        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImageUrl: user.profileImageUrl ?? undefined
        };
      }
    })
  ],

  // JWT回调：自定义token内容
  callbacks: {
    async jwt({ token, user }) {
      // 首次登录时，将用户信息存入token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.profileImageUrl = user.profileImageUrl;
      }
      return token;
    },

    // Session回调：自定义会话内容
    async session({ session, token }) {
      // 将JWT中的信息同步到session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.profileImageUrl = token.profileImageUrl as string;
      }
      return session;
    }
  },

  // 登录页URL（认证失败时重定向）
  pages: {
    signIn: '/login', // 自定义登录页
  }
};