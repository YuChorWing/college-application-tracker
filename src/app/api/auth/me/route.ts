import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // 导入上面的认证配置
import { prisma } from '@/lib/prisma';

// 处理GET请求：获取当前用户信息
export async function GET() {
  try {
    // 1. 从请求中获取会话（验证用户是否登录）
    const session = await getServerSession(authOptions);

    // 2. 未登录：返回401未授权
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 3. 已登录：从数据库查询用户信息
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      // 只返回需要的字段（避免暴露敏感信息如password）
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImageUrl: true,
        createdAt: true
      }
    });

    // 4. 用户不存在（可能被删除）：返回404
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 } // 404 Not Found
      );
    }

    // 5. 成功：返回用户信息
    return NextResponse.json(user);

  } catch (error) {
    // 6. 服务器错误：返回500
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 } // 500 Internal Server Error
    );
  }
}
