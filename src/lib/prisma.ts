import { PrismaClient } from '@/generated/prisma'

// 全局声明，防止热重载重复创建实例
declare global {
  var prisma: PrismaClient | undefined
}

// 单例模式：优先使用全局实例，否则创建新实例
export const prisma = global.prisma || new PrismaClient()

// 开发环境下保存到全局，避免热重载重复创建
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}
