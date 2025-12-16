import { useState, useEffect, useRef } from 'react';
import { supabase, type Chat, type Message } from '../../lib/supabase';
import { sendMessage as sendAIMessage, sendMessageWithFiles, sendMessageStream, sendMessageWithFilesStream } from '../../lib/openrouter';
import { toast } from 'sonner';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

import imgProfilePicture from "../../assets/ee35dae001cba7772f5d3a802010a54031e7442f.png";
import imgImage1 from "../../assets/be31261aa7d54f90cd871f13f3c2994720b2f880.png";
import { Loader2, Send, LogOut, Plus, Menu, MessageSquare, X, Paperclip, FileText, Image, Video, File, Trash2, Brain } from 'lucide-react';
import { DatabaseSetup } from './DatabaseSetup';
import Spline from '@splinetool/react-spline';

/**
 * ChatInterface Component
 * 
 * Features:
 * - Text messaging with AI (Nova 2 Lite)
 * - File attachments (images, videos, documents)
 * - Multimodal AI responses
 * - File size validation (10MB limit)
 * - Drag & drop support for files
 * - Keyboard shortcuts (Enter to send, Escape to clear attachments)
 */
export function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [databaseError, setDatabaseError] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [splineLoading, setSplineLoading] = useState(true);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUser();
    loadChats();
  }, []);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
    }
  }, [currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup any object URLs to prevent memory leaks
      messages.forEach(message => {
        if (message.attachments) {
          try {
            const attachments = JSON.parse(message.attachments);
            attachments.forEach((attachment: any) => {
              if (attachment.url && attachment.url.startsWith('blob:')) {
                URL.revokeObjectURL(attachment.url);
              }
            });
          } catch (e) {
            // Ignore parsing errors
          }
        }
      });
    };
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
    }
  };

  const loadChats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading chats:', error);
      // Check if tables don't exist
      if (error.code === 'PGRST205') {
        setDatabaseError(true);
      }
    } else {
      setChats(data || []);
    }
  };

  const loadMessages = async (chatId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const createNewChat = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        title: 'New Chat',
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create chat');
    } else {
      setChats([data, ...chats]);
      setCurrentChat(data);
      setMessages([]);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) {
      toast.error('Failed to delete chat');
    } else {
      // Remove chat from local state
      setChats(chats.filter(chat => chat.id !== chatId));
      
      // If the deleted chat was the current one, clear it
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
      
      toast.success('Chat deleted successfully');
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    setProcessingFiles(true);
    
    // Filter out files that are too large (10MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) attached successfully`);
    }
    
    setProcessingFiles(false);
    // Reset the input so the same file can be selected again
    if (e.target) e.target.value = '';
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateChatTitle = (message: string): string => {
    // Remove common question words and clean the message
    const cleanMessage = message
      .toLowerCase()
      .replace(/^(what|how|why|when|where|who|can|could|would|should|is|are|do|does|did|will|help|explain|tell|show)\s+/i, '')
      .replace(/[?!.]+$/, '')
      .trim();
    
    // Split into words and take meaningful ones
    const words = cleanMessage.split(/\s+/).filter(word => 
      word.length > 2 && 
      !['the', 'and', 'for', 'with', 'you', 'me', 'my', 'this', 'that', 'about', 'from'].includes(word)
    );
    
    // Take first 3-4 meaningful words, max 25 characters
    let title = words.slice(0, 4).join(' ');
    if (title.length > 25) {
      title = words.slice(0, 3).join(' ');
    }
    if (title.length > 25) {
      title = words.slice(0, 2).join(' ');
    }
    
    // Fallback to first few words if still too long
    if (title.length > 25 || title.length < 3) {
      title = message.split(/\s+/).slice(0, 3).join(' ');
      if (title.length > 25) {
        title = title.substring(0, 22) + '...';
      }
    }
    
    // Capitalize first letter
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const getMessageStyling = (content: string): { borderRadius: string; padding: string } => {
    // Always use consistent rounded corners and padding for proper content storage
    return {
      borderRadius: 'rounded-2xl',
      padding: 'p-4'
    };
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachedFiles.length === 0) || !currentChat || loading) return;

    const userMessage = inputValue.trim();
    const filesToSend = [...attachedFiles];
    setInputValue('');
    setAttachedFiles([]);
    setLoading(true);

    try {
      // Create object URLs for image files to display previews
      const fileAttachments = filesToSend.map(file => {
        let url = null;
        try {
          if (file.type.startsWith('image/')) {
            url = URL.createObjectURL(file);
          }
        } catch (error) {
          console.warn('Failed to create object URL for file:', file.name, error);
        }
        
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url
        };
      });

      // Prepare user message content - don't include file names in content since they're shown separately
      let displayContent = userMessage;

      // Save user message with file attachments
      const messageData = {
        chat_id: currentChat.id,
        role: 'user',
        content: displayContent,
        attachments: fileAttachments.length > 0 ? JSON.stringify(fileAttachments) : null,
      };
      
      console.log('Saving message with attachments:', messageData);
      
      const { data: userMsg, error: userError } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (userError) {
        console.error('Error saving message:', userError);
        throw userError;
      }
      
      console.log('Saved message:', userMsg);

      setMessages((prev) => [...prev, userMsg]);

      // Update chat title if it's the first message
      if (messages.length === 0) {
        const chatTitle = generateChatTitle(userMessage || 'File Upload');
        await supabase
          .from('chats')
          .update({ title: chatTitle })
          .eq('id', currentChat.id);

        loadChats();
      }

      // Get AI response
      const conversationHistory = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage || 'Please analyze the attached files.' },
      ];

      // Use the appropriate function based on whether files are attached
      const aiResponse = filesToSend.length > 0 
        ? await sendMessageWithFiles(conversationHistory, filesToSend)
        : await sendAIMessage(conversationHistory);

      // Save AI response
      const { data: aiMsg, error: aiError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChat.id,
          role: 'assistant',
          content: aiResponse,
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setMessages((prev) => [...prev, aiMsg]);

      // Update chat updated_at
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentChat.id);

      loadChats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const hasMessages = messages.length > 0;

  // Responsive sidebar handling
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = sidebarCollapsed ? 'w-[80px]' : 'w-[350px]';
  const mainLeftMargin = isMobile ? 'left-0' : (sidebarCollapsed ? 'left-[80px]' : 'left-[350px]');

  return (
    <div className="bg-white relative min-h-screen w-full" data-name="Web Page">
      <div className="fixed inset-0 z-0" data-name="image 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute inset-0 w-full h-full object-cover" src={imgImage1} />
        </div>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`fixed z-30 p-3 rounded-full bg-[rgba(56,55,73,0.8)] backdrop-blur-[25px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(56,55,73,0.9)] transition-all duration-300 ${
            sidebarCollapsed 
              ? 'top-4 left-4' 
              : 'top-4 left-[290px]'
          }`}
        >
          {sidebarCollapsed ? (
            <Menu className="size-5 text-white" />
          ) : (
            <X className="size-5 text-white" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed border-[0px_1px_0px_0px] border-[rgba(255,255,255,0.1)] border-solid h-screen overflow-hidden top-0 z-20 transition-all duration-300 ease-in-out ${isMobile ? (sidebarCollapsed ? '-left-[350px]' : 'left-0 w-[350px]') : `left-0 ${sidebarWidth}`
        }`} data-name="Sidebar">
        <div className="absolute backdrop-blur-[25px] backdrop-filter h-full left-[-2px] top-0 w-full" data-name="Background" style={{ backgroundImage: "linear-gradient(192.383deg, rgba(56, 55, 73, 0.37) 1.5697%, rgba(14, 11, 17, 0.37) 97.97%)" }} />

        {/* Hamburger Menu Button - Desktop Only, visible when sidebar is expanded */}
        {!isMobile && !sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="absolute top-[33px] right-[20px] z-20 p-2 rounded-full hover:bg-[rgba(255,255,255,0.15)] hover:scale-110 transition-all duration-200"
          >
            <Menu className="size-5 text-white" />
          </button>
        )}

        {/* Logo */}
        {sidebarCollapsed ? (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute left-1/2 top-[33px] -translate-x-1/2 p-2 rounded-full hover:bg-[rgba(255,255,255,0.15)] hover:scale-110 transition-all duration-200"
            title="Open sidebar"
            data-name="Logo Button"
          >
            <div className="relative size-[32px] rounded-full bg-gradient-to-br from-[#A592C4] to-[#845EBD] flex items-center justify-center">
              <Brain className="size-5 text-white" />
            </div>
          </button>
        ) : (
          <div className="absolute content-stretch flex gap-[12px] items-center left-[20px] top-[33px]" data-name="Logo">
            <div className="relative size-[32px] rounded-full bg-gradient-to-br from-[#A592C4] to-[#845EBD] flex items-center justify-center">
              <Brain className="size-5 text-white" />
            </div>
            <p className="font-['FONTSPRING_DEMO_-_Integral_CF:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-nowrap text-white">BrainBot</p>
          </div>
        )}

        {/* New Chat Button */}
        <button
          onClick={createNewChat}
          className={`absolute backdrop-blur-[25px] backdrop-filter content-stretch flex gap-[7px] h-[40px] items-center overflow-clip py-[11px] left-[20px] top-[84px] rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'px-[12px] w-[40px] justify-center' : 'px-[12px] justify-start'
            }`}
          style={{ backgroundImage: "linear-gradient(174.623deg, rgba(165, 146, 196, 0.67) 35.416%, rgba(132, 94, 189, 0.67) 112.4%), linear-gradient(90deg, rgba(56, 55, 73, 0.56) 0%, rgba(73, 75, 83, 0.56) 100%)" }}
          title={sidebarCollapsed ? "New chat" : undefined}
        >
          <Plus className="size-4 text-white flex-shrink-0" />
          {!sidebarCollapsed && (
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[normal] text-center text-nowrap text-white">New chat</p>
          )}
        </button>

        {/* Recent Chats */}
        <div className={`absolute left-[20px] top-[155px] max-h-[700px] overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'w-[40px]' : 'w-[310px]'
          }`}>
          {!sidebarCollapsed && (
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[normal] text-[rgba(255,255,255,0.6)] mb-2">Your chats</p>
          )}
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`relative group ${sidebarCollapsed ? 'flex justify-center' : ''}`}
              >
                <button
                  onClick={() => setCurrentChat(chat)}
                  className={`font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[normal] text-white p-3 rounded-full hover:bg-[rgba(255,255,255,0.15)] transition-all duration-200 ${currentChat?.id === chat.id ? 'bg-[rgba(255,255,255,0.2)]' : ''
                    } ${sidebarCollapsed ? 'flex items-center justify-center w-[40px] h-[40px]' : 'text-left truncate w-full pr-10'
                    }`}
                  title={sidebarCollapsed ? chat.title : undefined}
                >
                  {sidebarCollapsed ? (
                    <MessageSquare className="size-4" />
                  ) : (
                    chat.title
                  )}
                </button>
                
                {/* Delete Button */}
                {!sidebarCollapsed && (
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-red-500/20 transition-all duration-200 ${
                      isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    title="Delete chat"
                  >
                    <Trash2 className="size-4 text-[rgba(255,255,255,0.6)] hover:text-red-400" />
                  </button>
                )}
                
                {/* Delete Button for Collapsed Sidebar */}
                {sidebarCollapsed && (
                  <button
                    onClick={(e) => deleteChat(chat.id, e)}
                    className={`absolute -right-8 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-red-500/20 transition-all duration-200 bg-[rgba(56,55,73,0.8)] backdrop-blur-sm ${
                      isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    title="Delete chat"
                  >
                    <Trash2 className="size-3 text-[rgba(255,255,255,0.6)] hover:text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className={`absolute content-stretch flex items-center left-[20px] bottom-[20px] transition-all duration-300 ${sidebarCollapsed ? 'gap-0 flex-col' : 'gap-[10px]'
          }`}>
          <div className="relative rounded-[20px] shrink-0 size-[40px]" data-name="Profile Picture">
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
              <div className="absolute bg-[#d9d9d9] inset-0 rounded-[20px]" />
              <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[20px] size-full" src={imgProfilePicture} />
            </div>
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[normal] flex-1">
                <p className="text-white truncate">{userEmail.split('@')[0]}</p>
                <p className="text-[rgba(255,255,255,0.7)]">Free Plan</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-white hover:text-[#845EBD] transition-colors"
                title="Logout"
              >
                <LogOut className="size-4" />
              </button>
            </>
          )}
          {sidebarCollapsed && (
            <button
              onClick={handleLogout}
              className="text-white hover:text-[#845EBD] transition-colors mt-2"
              title="Logout"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Page */}
      <div className={`fixed h-screen overflow-clip top-0 right-0 z-10 transition-all duration-300 ${mainLeftMargin}`} data-name="Main Chat Page">
        <div className="absolute backdrop-blur-[25px] backdrop-filter h-full left-0 top-0 w-full" data-name="Background" style={{ backgroundImage: "linear-gradient(212.397deg, rgba(20, 10, 20, 0.7) 14.032%, rgba(106, 99, 129, 0.7) 47.283%, rgba(22, 12, 22, 0.7) 81.838%)" }} />

        {!currentChat ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-[36px] text-white">
              Select a chat or create a new one
            </p>
          </div>
        ) : !hasMessages ? (
          <>
            {/* Welcome Message and 3D Model - Centered */}
            <div className="absolute left-1/2 top-0 bottom-[120px] -translate-x-1/2 flex flex-col items-center justify-center w-full">
              {/* Live Spline 3D Model */}
              <div className="relative mb-8 w-[300px] h-[300px]" data-name="Live 3D model">
                {splineLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[rgba(56,55,73,0.3)] rounded-lg backdrop-blur-sm">
                    <Loader2 className="size-8 text-white animate-spin" />
                  </div>
                )}
                <Spline
                  scene="https://prod.spline.design/GWBH-MfpGvHG8eEy/scene.splinecode"
                  className="w-full h-full rounded-lg"
                  onLoad={() => setSplineLoading(false)}
                  onError={() => setSplineLoading(false)}
                />
              </div>

              {/* Welcome Message */}
              <div className="font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium leading-[1.5] text-[36px] text-center text-white tracking-[-0.72px]">
                <p className="mb-0">Ready to learn?</p>
                <p>Let's build your expertise.</p>
              </div>
            </div>
          </>
        ) : (
          /* Messages */
          <div className="absolute left-[20px] sm:left-[50px] right-[20px] sm:right-[50px] top-[50px] bottom-[150px] overflow-y-auto">
            <div className="max-w-[800px] mx-auto space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${getMessageStyling(message.content).padding} ${getMessageStyling(message.content).borderRadius} ${message.role === 'user'
                        ? 'bg-gradient-to-r from-[#A592C4] to-[#845EBD] text-white'
                        : 'backdrop-blur-[25px] backdrop-filter bg-gradient-to-r from-[rgba(56,55,73,0.56)] to-[rgba(19,15,25,0.56)]  text-white'
                      }`}
                  >
                    {message.role === 'user' ? (
                      <div>
                        {/* Text content */}
                        {message.content && message.content.trim() && (
                          <p className="whitespace-pre-wrap break-words ">{message.content}</p>
                        )}
                        
                        {/* Image previews */}
                        {message.attachments && (() => {
                          try {
                            const attachments = JSON.parse(message.attachments);
                            if (!Array.isArray(attachments)) return null;
                            
                            return (
                              <div className="space-y-2">
                                {attachments.map((attachment: any, index: number) => {
                                  if (!attachment || typeof attachment !== 'object') return null;
                                  
                                  return (
                                    <div key={index}>
                                      {attachment.type?.startsWith('image/') && attachment.url ? (
                                        <div className="relative">
                                          <img 
                                            src={attachment.url} 
                                            alt={attachment.name || 'Attached image'}
                                            className="max-w-full max-h-[300px] rounded-lg object-cover shadow-lg"
                                            onError={(e) => {
                                              // Fallback if image URL is broken
                                              const target = e.currentTarget;
                                              target.style.display = 'none';
                                            }}
                                            onLoad={(e) => {
                                              // Ensure image is visible when loaded successfully
                                              e.currentTarget.style.display = 'block';
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="text-sm text-white/80 flex items-center gap-2">
                                          <File className="size-4" />
                                          {attachment.name || 'File attachment'}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          } catch (e) {
                            console.warn('Failed to parse message attachments:', e);
                            return null;
                          }
                        })()}
                      </div>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // Custom styling for markdown elements
                            h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-medium mb-2 text-white">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 text-white break-words">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-white space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-white space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-white">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-white">{children}</em>,
                            code: ({ children, className }) => {
                              const isInline = !className;
                              return isInline ? (
                                <code className="bg-[rgba(255,255,255,0.1)] px-1 py-0.5 rounded text-sm text-white font-mono">
                                  {children}
                                </code>
                              ) : (
                                <code className={className}>{children}</code>
                              );
                            },
                            pre: ({ children }) => (
                              <pre className="bg-[rgba(0,0,0,0.3)] p-3 rounded-lg overflow-x-auto mb-2 border border-[rgba(255,255,255,0.1)]">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-[rgba(255,255,255,0.3)] pl-4 italic text-[rgba(255,255,255,0.8)] mb-2">
                                {children}
                              </blockquote>
                            ),
                            a: ({ children, href }) => (
                              <a href={href} className="text-[#A592C4] hover:text-[#845EBD] underline" target="_blank" rel="noopener noreferrer">
                                {children}
                              </a>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto mb-2">
                                <table className="min-w-full border border-[rgba(255,255,255,0.2)] rounded">
                                  {children}
                                </table>
                              </div>
                            ),
                            th: ({ children }) => (
                              <th className="border border-[rgba(255,255,255,0.2)] px-3 py-2 bg-[rgba(255,255,255,0.1)] text-white font-semibold text-left">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="border border-[rgba(255,255,255,0.2)] px-3 py-2 text-white">
                                {children}
                              </td>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="backdrop-blur-[25px] backdrop-filter bg-gradient-to-r from-[rgba(56,55,73,0.56)] to-[rgba(19,15,25,0.56)] border border-white border-opacity-20 text-white px-4 py-2 rounded-full">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Message Input */}
        {currentChat && (
          <div className="absolute left-[20px] sm:left-[50px] bottom-[24px] right-[20px] sm:right-[50px] max-w-[800px] mx-auto" data-name="Message box">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
              <div className="mb-2 p-3 rounded-[50px] backdrop-blur-[25px] backdrop-filter bg-gradient-to-r from-[rgba(56,55,73,0.56)] to-[rgba(19,15,25,0.56)] border border-white border-opacity-20">
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => {
                    const getFileIcon = (fileType: string) => {
                      if (fileType.startsWith('image/')) return <Image className="size-4 text-blue-400" />;
                      if (fileType.startsWith('video/')) return <Video className="size-4 text-purple-400" />;
                      if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) return <FileText className="size-4 text-green-400" />;
                      return <File className="size-4 text-gray-400" />;
                    };

                    const formatFileSize = (bytes: number) => {
                      if (bytes === 0) return '0 Bytes';
                      const k = 1024;
                      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                      const i = Math.floor(Math.log(bytes) / Math.log(k));
                      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                    };

                    return (
                      <div key={index} className="flex items-center gap-2 bg-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 max-w-[200px]">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm truncate">{file.name}</div>
                          <div className="text-[rgba(255,255,255,0.6)] text-xs">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          onClick={() => removeAttachedFile(index)}
                          className="text-white hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="h-[48px] sm:h-[56px] overflow-clip rounded-full relative" data-name="Input container">
              <div className="absolute backdrop-blur-[25px] backdrop-filter bg-gradient-to-r  from-[rgba(56,55,73,0.56)] h-[48px] sm:h-[56px] left-0 rounded-full to-[rgba(19,15,25,0.56)] top-0 w-full" data-name="background" />
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.md,.json,.csv,.xlsx,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {/* Helper text for file attachments */}
              {attachedFiles.length > 0 && (
                <div className="absolute left-[24px] top-[60px] text-xs text-[rgba(255,255,255,0.5)]">
                  Press Escape to clear attachments
                </div>
              )}
              
              <input
                type="text"
                placeholder={attachedFiles.length > 0 ? "Add a message or send files..." : "What do you need to master today?"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading && !processingFiles) {
                    handleSendMessage();
                  } else if (e.key === 'Escape' && attachedFiles.length > 0) {
                    setAttachedFiles([]);
                  }
                }}
                disabled={loading || processingFiles}
                className="absolute left-[20px] sm:left-[24px] top-1/2 -translate-y-1/2 right-[108px] sm:right-[120px] bg-transparent border-none outline-none text-white placeholder-[rgba(255,255,255,0.6)] font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium text-sm sm:text-base"
              />
              
              {/* Attach Button */}
              <button
                onClick={handleFileAttach}
                disabled={loading || processingFiles}
                className="absolute right-[60px] sm:right-[70px] top-1/2 -translate-y-1/2 size-[32px] sm:size-[36px] rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] flex items-center justify-center transition-all disabled:opacity-50"
                title="Attach files (images, videos, documents)"
              >
                {processingFiles ? (
                  <Loader2 className="size-3 sm:size-4 text-white animate-spin" />
                ) : (
                  <Paperclip className="size-3 sm:size-4 text-white" />
                )}
              </button>
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={loading || (!inputValue.trim() && attachedFiles.length === 0)}
                className="absolute right-[12px] sm:right-[16px] top-1/2 -translate-y-1/2 size-[32px] sm:size-[36px] rounded-full bg-gradient-to-r from-[#A592C4] to-[#845EBD] flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="size-3 sm:size-4 text-white animate-spin" />
                ) : (
                  <Send className="size-3 sm:size-4 text-white" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Database Setup Modal */}
      {databaseError && (
        <DatabaseSetup onRetry={() => {
          setDatabaseError(false);
          loadChats();
        }} />
      )}
    </div>
  );
}