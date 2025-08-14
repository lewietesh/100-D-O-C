// src/components/dashboard/SupportTicketForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Send, X, Paperclip } from 'lucide-react';

interface TicketFormData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const ticketSchema = yup.object({
  subject: yup.string().required('Subject is required').min(5, 'Subject must be at least 5 characters'),
  message: yup.string().required('Message is required').min(20, 'Message must be at least 20 characters'),
  priority: yup.string().oneOf(['low', 'medium', 'high', 'urgent']).required('Priority is required'),
});

interface SupportTicketFormProps {
  onClose: () => void;
}

export const SupportTicketForm: React.FC<SupportTicketFormProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TicketFormData>({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      setLoading(true);
      
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      formData.append('priority', data.priority);
      
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Ticket submitted:', data, 'Attachments:', attachments);
      
      reset();
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error('Failed to submit ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Create Support Ticket</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            {...register('subject')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your issue"
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority *
          </label>
          <select
            {...register('priority')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            {...register('message')}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Please provide detailed information about your issue..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700">Click to upload files</span>
              <span className="text-gray-500"> or drag and drop</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Max 10MB per file. Supported formats: JPG, PNG, PDF, DOC, TXT
            </p>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
};
