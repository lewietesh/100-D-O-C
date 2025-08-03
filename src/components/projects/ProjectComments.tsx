'use client';

import { useState, useEffect } from 'react';
import { ProjectComment } from '@/types/projects';
import { useProjectComments } from '@/hooks/useProjects';
import { useToast } from '@/app/context/ToastContext';

interface ProjectCommentsProps {
          projectSlug: string;
          initialComments?: ProjectComment[];
}

interface CommentFormData {
          name: string;
          email: string;
          message: string;
          parent_comment?: string;
}

const CommentForm = ({
          onSubmit,
          loading,
          replyTo,
          onCancelReply
}: {
          onSubmit: (data: CommentFormData) => void;
          loading: boolean;
          replyTo?: { id: string; name: string } | null;
          onCancelReply?: () => void;
}) => {
          const [formData, setFormData] = useState<CommentFormData>({
                    name: '',
                    email: '',
                    message: '',
                    parent_comment: replyTo?.id
          });

          // Update parent_comment when replyTo changes
          useEffect(() => {
                    setFormData(prev => ({ ...prev, parent_comment: replyTo?.id }));
          }, [replyTo]);

          const handleSubmit = (e: React.FormEvent) => {
                    e.preventDefault();
                    if (formData.name.trim() && formData.message.trim()) {
                              onSubmit({
                                        ...formData,
                                        parent_comment: replyTo?.id
                              });
                              setFormData({ name: '', email: '', message: '', parent_comment: undefined });
                              onCancelReply?.();
                    }
          };

          return (
                    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
                              {replyTo ? (
                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                                                  <div className="flex justify-between items-center">
                                                            <span className="text-sm text-blue-800">
                                                                      Replying to <strong>{replyTo.name}</strong>
                                                            </span>
                                                            <button
                                                                      type="button"
                                                                      onClick={onCancelReply}
                                                                      className="text-blue-600 hover:text-blue-800 text-sm"
                                                            >
                                                                      Cancel
                                                            </button>
                                                  </div>
                                        </div>
                              ) : (
                                        <h3 className="text-lg font-semibold mb-4">Leave a Comment</h3>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Name *
                                                  </label>
                                                  <input
                                                            type="text"
                                                            id="name"
                                                            required
                                                            value={formData.name}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Your name"
                                                  />
                                        </div>

                                        <div>
                                                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                            Email (optional)
                                                  </label>
                                                  <input
                                                            type="email"
                                                            id="email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="your.email@example.com"
                                                  />
                                        </div>
                              </div>

                              <div className="mb-4">
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                  Message *
                                        </label>
                                        <textarea
                                                  id="message"
                                                  required
                                                  value={formData.message}
                                                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                                  rows={4}
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Share your thoughts about this project..."}
                                        />
                              </div>

                              <button
                                        type="submit"
                                        disabled={loading || !formData.name.trim() || !formData.message.trim()}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                              >
                                        {loading ? 'Posting...' : replyTo ? 'Post Reply' : 'Post Comment'}
                              </button>

                              <p className="text-xs text-gray-500 mt-2">
                                        Comments are moderated and will appear after approval.
                              </p>
                    </form>
          );
};

const CommentItem = ({
          comment,
          onReply,
          level = 0
}: {
          comment: ProjectComment;
          onReply?: (parentId: string, parentName: string) => void;
          level?: number;
}) => {
          const [showReplies, setShowReplies] = useState(true);
          const maxLevel = 3; // Maximum nesting level

          return (
                    <div className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : 'border-l-4 border-blue-200 pl-4'} py-3`}>
                              <div className="flex justify-between items-start mb-2">
                                        <div>
                                                  <h4 className="font-medium text-gray-900">{comment.name}</h4>
                                                  <span className="text-sm text-gray-500">
                                                            {new Date(comment.date_created).toLocaleDateString('en-US', {
                                                                      year: 'numeric',
                                                                      month: 'long',
                                                                      day: 'numeric'
                                                            })}
                                                  </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                                  {!comment.approved && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                      Pending
                                                            </span>
                                                  )}
                                                  {level < maxLevel && onReply && (
                                                            <button
                                                                      onClick={() => onReply(comment.id, comment.name)}
                                                                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                            >
                                                                      Reply
                                                            </button>
                                                  )}
                                        </div>
                              </div>

                              <p className="text-gray-700 leading-relaxed mb-3">{comment.message}</p>

                              {/* Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                        <div className="mt-4">
                                                  <button
                                                            onClick={() => setShowReplies(!showReplies)}
                                                            className="text-sm text-gray-600 hover:text-gray-800 mb-2 flex items-center"
                                                  >
                                                            <svg
                                                                      className={`w-4 h-4 mr-1 transition-transform ${showReplies ? 'rotate-90' : ''}`}
                                                                      fill="none"
                                                                      stroke="currentColor"
                                                                      viewBox="0 0 24 24"
                                                            >
                                                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} repl{comment.replies.length === 1 ? 'y' : 'ies'}
                                                  </button>

                                                  {showReplies && (
                                                            <div className="space-y-4">
                                                                      {comment.replies.map((reply) => (
                                                                                <CommentItem
                                                                                          key={reply.id}
                                                                                          comment={reply}
                                                                                          onReply={onReply}
                                                                                          level={level + 1}
                                                                                />
                                                                      ))}
                                                            </div>
                                                  )}
                                        </div>
                              )}
                    </div>
          );
};

const ProjectComments = ({ projectSlug, initialComments = [] }: ProjectCommentsProps) => {
          const { comments, loading, addComment } = useProjectComments(projectSlug);
          const { showToast } = useToast();
          const [submitLoading, setSubmitLoading] = useState(false);
          const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

          // Use comments from hook if available, otherwise use initial comments
          const displayComments = comments.length > 0 ? comments : initialComments;
          const approvedComments = displayComments.filter(comment => comment.approved);

          // Build threaded comment structure
          const buildCommentTree = (comments: ProjectComment[]): ProjectComment[] => {
                    const commentMap = new Map<string, ProjectComment>();
                    const rootComments: ProjectComment[] = [];

                    // First, create a map of all comments
                    comments.forEach(comment => {
                              commentMap.set(comment.id, { ...comment, replies: [] });
                    });

                    // Then, build the tree structure
                    comments.forEach(comment => {
                              const commentWithReplies = commentMap.get(comment.id)!;

                              if (comment.parent_comment) {
                                        const parent = commentMap.get(comment.parent_comment);
                                        if (parent) {
                                                  parent.replies = parent.replies || [];
                                                  parent.replies.push(commentWithReplies);
                                        }
                              } else {
                                        rootComments.push(commentWithReplies);
                              }
                    });

                    return rootComments;
          };

          const threadedComments = buildCommentTree(approvedComments);

          const handleSubmitComment = async (formData: CommentFormData) => {
                    try {
                              setSubmitLoading(true);

                              await addComment({
                                        name: formData.name,
                                        email: formData.email || undefined,
                                        message: formData.message,
                                        parent_comment: formData.parent_comment
                              });

                              // Show success toast
                              showToast(
                                        replyTo
                                                  ? 'Reply submitted successfully! It will appear after moderation.'
                                                  : 'Comment submitted successfully! It will appear after moderation.',
                                        'success'
                              );
                              setReplyTo(null);
                    } catch (err) {
                              // Show error toast
                              const errorMessage = err instanceof Error ? err.message : 'Failed to post comment';
                              showToast(errorMessage, 'error');
                    } finally {
                              setSubmitLoading(false);
                    }
          };

          const handleReply = (parentId: string, parentName: string) => {
                    setReplyTo({ id: parentId, name: parentName });
                    // Scroll to comment form
                    document.querySelector('#comment-form')?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center'
                    });
          };

          const handleCancelReply = () => {
                    setReplyTo(null);
          };

          return (
                    <section className="mb-10">
                              <h2 className="text-2xl font-semibold mb-6">Comments & Feedback</h2>

                              {/* Comment Form */}
                              <div id="comment-form" className="mb-8">
                                        <CommentForm
                                                  onSubmit={handleSubmitComment}
                                                  loading={submitLoading}
                                                  replyTo={replyTo}
                                                  onCancelReply={handleCancelReply}
                                        />
                              </div>

                              {/* Comments List */}
                              {threadedComments.length > 0 ? (
                                        <div className="space-y-6">
                                                  <h3 className="text-lg font-medium text-gray-900">
                                                            Comments ({approvedComments.length})
                                                  </h3>
                                                  <div className="space-y-6">
                                                            {threadedComments.map((comment) => (
                                                                      <CommentItem
                                                                                key={comment.id}
                                                                                comment={comment}
                                                                                onReply={handleReply}
                                                                      />
                                                            ))}
                                                  </div>
                                        </div>
                              ) : (
                                        <div className="text-center py-8 text-gray-500">
                                                  <p>No comments yet. Be the first to share your thoughts!</p>
                                        </div>
                              )}
                    </section>
          );
};

export default ProjectComments;
