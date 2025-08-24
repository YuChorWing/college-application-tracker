import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// 定义API响应类型
interface StudentDashboardData {
  student: {
    id: string;
    first_name: string;
    profile_image_url?: string;
  };
  applications: Array<{
    id: string;
    universityName: string;
    program: string;
    status: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'decided';
    deadline: string;
    createdAt: string;
  }>;
  stats: {
    total: number;
    submitted: number;
    inProgress: number;
    upcomingDeadlines: number;
  };
  upcomingDeadlines: Array<{
    id: string;
    universityName: string;
    type: string;
    date: string;
    status: string;
  }>;
  statusDistribution: Array<{
    name: 'not_started' | 'in_progress' | 'submitted' | 'under_review' | 'decided';
    value: number;
  }>;
}

export async function GET() {
  try {
    // 1. 验证用户会话
    const session = await getServerSession(authOptions);

    // 检查是否登录且为学生角色
    if (!session?.user || session.user.role !== 'student') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const userId = session.user.id;

    // 2. 获取学生基本信息
    const student = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        profileImageUrl: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    // 3. 获取所有申请
    const applications = await prisma.application.findMany({
      where: { id: userId },
      orderBy: { deadline: 'asc' }
    });

    // 4. 计算统计数据
    const totalApplications = applications.length;
    const submittedApplications = applications.filter(
      app => ['submitted','under_review','decided'].includes(app.status)
    ).length;
    const inProgressApplications = applications.filter(
      app => ['in_progress'].includes(app.status)
    ).length;

    // 5. 处理截止日期数据
    const allDeadlines = applications.flatMap(app =>
      app.deadlines.map(deadline => ({
        ...deadline,
        universityName: app.universityName
      }))
    );

    // 筛选未来30天内的截止日期
    const upcomingDeadlines = allDeadlines
      .filter(deadline => {
        const deadlineDate = new Date(deadline.date);
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        return deadlineDate >= today && deadlineDate <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // 限制显示前5个

    // 6. 计算状态分布
    const statusDistribution = [
      { name: 'not_started', value: 0 },
      { name: 'in_progress', value: 0 },
      { name: 'submitted', value: 0 },
      { name: 'under_review', value: 0 },
      { name: 'decided', value: 0 }
    ];

    applications.forEach(app => {
      const statusIndex = statusDistribution.findIndex(item => item.name === app.status);
      if (statusIndex !== -1) {
        statusDistribution[statusIndex].value++;
      }
    });

    // 7. 构造响应数据
    const dashboardData: StudentDashboardData = {
      student: {
        id: student.id,
        first_name: student.firstName,
        profile_image_url: student.profileImageUrl ?? undefined
      },
      applications: applications.map(app => ({
        id: app.id,
        universityName: app.universityName,
        program: app.program,
        status: app.status as StudentDashboardData['statusDistribution'][0]['name'],
        deadline: app.deadline.toISOString(),
        createdAt: app.createdAt.toISOString()
      })),
      stats: {
        total: totalApplications,
        submitted: submittedApplications,
        inProgress: inProgressApplications,
        upcomingDeadlines: upcomingDeadlines.length
      },
      upcomingDeadlines: upcomingDeadlines.map(deadline => ({
        id: deadline.id,
        universityName: deadline.universityName,
        type: deadline.type,
        date: deadline.date.toISOString(),
        status: deadline.status
      })),
      statusDistribution
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
