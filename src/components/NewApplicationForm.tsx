import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 表单数据验证 schema
const applicationSchema = z.object({
  universityName: z.string().min(1, '大学名称不能为空'),
  program: z.string().min(1, '专业名称不能为空'),
  status: z.enum(['not_started', 'in_progress', 'submitted']),
  deadline: z.date().refine(date => date >= new Date(), '截止日期不能是过去的日期'),
  notes: z.string().optional()
});

// 表单数据类型
type ApplicationFormData = z.infer<typeof applicationSchema>;

interface NewApplicationFormProps {
  onSuccess: () => void; // 提交成功后的回调
}

const NewApplicationForm: React.FC<NewApplicationFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 初始化表单
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    reset
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      status: 'in_progress',
      deadline: new Date()
    }
  });

  const watchDeadline = watch('deadline', new Date());

  // 处理表单提交
  const onSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // 转换日期为 ISO 字符串
      const formattedData = {
        ...data,
        deadline: data.deadline.toISOString()
      };

      // 发送请求到 API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error('创建申请失败，请重试');
      }

      // 提交成功
      reset();
      onSuccess(); // 调用父组件的成功回调（通常用于关闭模态框）
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '提交时发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 大学名称 */}
      <div>
        <label
          htmlFor="universityName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          大学名称 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="universityName"
          {...register('universityName')}
          className={`w-full px-3 py-2 border ${errors.universityName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="例如：哈佛大学"
        />
        {errors.universityName && (
          <p className="mt-1 text-sm text-red-500">{errors.universityName.message}</p>
        )}
      </div>

      {/* 专业 */}
      <div>
        <label
          htmlFor="program"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          专业 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="program"
          {...register('program')}
          className={`w-full px-3 py-2 border ${errors.program ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="例如：计算机科学"
        />
        {errors.program && (
          <p className="mt-1 text-sm text-red-500">{errors.program.message}</p>
        )}
      </div>

      {/* 申请状态 */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          申请状态 <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          {...register('status')}
          className={`w-full px-3 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="not_started">未开始</option>
          <option value="in_progress">进行中</option>
          <option value="submitted">已提交</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
        )}
      </div>

      {/* 截止日期 */}
      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          截止日期 <span className="text-red-500">*</span>
        </label>
        <Controller
          name="deadline"
          control={control}
          rules={{ required: '截止日期不能为空' }}
          render={({ field }) => (
            <DatePicker
              id="deadline"
              selected={field.value}
              // 正确处理日期变化：只传递有效日期
              onChange={(date) => {
                if (date) {
                  field.onChange(date); // 传递Date类型给表单
                }
              }}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className={`w-full px-3 py-2 border ${errors.deadline ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholderText="选择截止日期"
              popperPlacement="bottom-start"
              renderCustomHeader={({ date, changeYear, changeMonth }) => (
                <div className="flex justify-between items-center p-2">
                  <button
                    type="button"
                    onClick={() => changeYear(date.getFullYear() - 1)}
                    className="p-1"
                  >
                    上一年
                  </button>
                  <h3 className="font-medium">
                    {date.getFullYear()}年 {date.getMonth() + 1}月
                  </h3>
                  <button
                    type="button"
                    onClick={() => changeYear(date.getFullYear() + 1)}
                    className="p-1"
                  >
                    下一年
                  </button>
                </div>
              )}
            />
          )}
        />
        {errors.deadline && (
          <p className="mt-1 text-sm text-red-500">{errors.deadline.message}</p>
        )}
      </div>

      {/* 备注 */}
      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          备注（可选）
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="添加关于此申请的备注信息..."
        ></textarea>
      </div>

      {/* 错误提示 */}
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
          {submitError}
        </div>
      )}

      {/* 提交按钮 */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onSuccess()} // 取消按钮，调用成功回调关闭模态框
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? '提交中...' : '创建申请'}
        </button>
      </div>
    </form>
  );
};

export default NewApplicationForm;
