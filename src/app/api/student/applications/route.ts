/* import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 申请创建数据验证 schema
const createApplicationSchema = z.object({
  universityId: z.cuid(), // 确保是有效的大学ID
  program: z.string().min(1, '专业名称不能为空').max(100),
  status: z.enum(['not_started', 'in_progress', 'submitted']),
  deadline: z.coerce.date (), // ISO格式的日期字符串
  notes: z.string().optional().nullable()
});

// 处理POST请求 - 创建新申请
export async function POST(req: NextRequest) {
  try {
    // 1. 验证用户身份
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 2. 解析并验证请求体
    const body = await req.json();
    const validatedData = createApplicationSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: '输入数据无效', details: validatedData.error.format() },
        { status: 400 }
      );
    }

    // 3. 验证大学是否存在
    const university = await prisma.university.findUnique({
      where: { id: validatedData.data.universityId }
    });

    if (!university) {
      return NextResponse.json(
        { error: '指定的大学不存在' },
        { status: 404 }
      );
    }

    // 4. 创建新申请
    const newApplication = await prisma.application.create({
      data: {
        ...validatedData.data,
        studentId: session.user.id // 关联当前登录学生
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true
          }
        }
      }
    });

    // 5. 返回创建的申请数据
    return NextResponse.json(newApplication, { status: 201 });

  } catch (error) {
    console.error('创建申请失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误，创建申请失败' },
      { status: 500 }
    );
  }
}

// 禁止GET请求
export async function GET() {
  return NextResponse.json(
    { error: '不支持GET请求，请使用POST' },
    { status: 405 }
  );
}
 */