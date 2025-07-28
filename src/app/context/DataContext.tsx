// app/contexts/DataContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dataService } from '@/app/utils/dataService';
import { Service } from '@/app/models/services.model';
import { Project } from '@/app/models/projects.model';
import { BlogPost } from '@/app/models/blog.model';
import { ServiceOrder } from '@/app/models/orders.model';
import { Notification } from '@/app/models/notifications.model';
import { ContactMessage } from '@/app/models/contact.model';

interface DataContextType {
  // Services
  services: Service[];
  featuredServices: Service[];
  getServiceBySlug: (slug: string) => Service | undefined;
  getServicesByCategory: (category: string) => Service[];
  createService: (service: Omit<Service, 'id' | 'createdAt'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => Service | undefined;
  
  // Projects
  projects: Project[];
  getProjectBySlug: (slug: string) => Project | undefined;
  getProjectsByCategory: (category: string) => Project[];
  createProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => Project | undefined;
  
  // Blogs
  blogs: BlogPost[];
  publishedBlogs: BlogPost[];
  getBlogBySlug: (slug: string) => BlogPost | undefined;
  createBlog: (blog: Omit<BlogPost, 'id' | 'date'>) => BlogPost;
  updateBlog: (id: string, updates: Partial<BlogPost>) => BlogPost | undefined;
  
  // Orders
  orders: ServiceOrder[];
  getOrdersByStatus: (status: string) => ServiceOrder[];
  createOrder: (order: Omit<ServiceOrder, 'id'>) => ServiceOrder;
  updateOrder: (id: string, updates: Partial<ServiceOrder>) => ServiceOrder | undefined;
  
  // Contact Messages
  contacts: ContactMessage[];
  createContact: (message: Omit<ContactMessage, 'id' | 'createdAt'>) => ContactMessage;
  
  // Notifications
  notifications: Notification[];
  unreadNotifications: Notification[];
  markNotificationAsRead: (id: string) => Notification | undefined;
  
  // Utility
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load initial data
  const refreshData = () => {
    setServices(dataService.getServices());
    setProjects(dataService.getProjects());
    setBlogs(dataService.getBlogs());
    setOrders(dataService.getOrders());
    setContacts(dataService.getContacts());
    setNotifications(dataService.getNotifications());
  };
  
  useEffect(() => {
    refreshData();
  }, []);
  
  // Derived state
  const featuredServices = services.filter(service => service.featured);
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');
  const unreadNotifications = notifications.filter(notification => !notification.read);
  
  // Service methods
  const getServiceBySlug = (slug: string) => services.find(service => service.slug === slug);
  const getServicesByCategory = (category: string) => services.filter(service => service.category === category);
  
  const createService = (service: Omit<Service, 'id' | 'createdAt'>) => {
    const newService = dataService.createService(service);
    refreshData();
    return newService;
  };
  
  const updateService = (id: string, updates: Partial<Service>) => {
    const updatedService = dataService.updateService(id, updates);
    refreshData();
    return updatedService;
  };
  
  // Project methods
  const getProjectBySlug = (slug: string) => projects.find(project => project.slug === slug);
  const getProjectsByCategory = (category: string) => projects.filter(project => project.category === category);
  
  const createProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject = dataService.createProject(project);
    refreshData();
    return newProject;
  };
  
  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProject = dataService.updateProject(id, updates);
    refreshData();
    return updatedProject;
  };
  
  // Blog methods
  const getBlogBySlug = (slug: string) => blogs.find(blog => blog.slug === slug);
  
  const createBlog = (blog: Omit<BlogPost, 'id' | 'date'>) => {
    const newBlog = dataService.createBlog(blog);
    refreshData();
    return newBlog;
  };
  
  const updateBlog = (id: string, updates: Partial<BlogPost>) => {
    const updatedBlog = dataService.updateBlog(id, updates);
    refreshData();
    return updatedBlog;
  };
  
  // Order methods
  const getOrdersByStatus = (status: string) => orders.filter(order => order.status === status);
  
  const createOrder = (order: Omit<ServiceOrder, 'id'>) => {
    const newOrder = dataService.createOrder(order);
    refreshData();
    return newOrder;
  };
  
  const updateOrder = (id: string, updates: Partial<ServiceOrder>) => {
    const updatedOrder = dataService.updateOrder(id, updates);
    refreshData();
    return updatedOrder;
  };
  
  // Contact message methods
  const createContact = (message: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const newMessage = dataService.createContact(message);
    refreshData();
    return newMessage;
  };
  
  // Notification methods
  const markNotificationAsRead = (id: string) => {
    const updatedNotification = dataService.markNotificationAsRead(id);
    refreshData();
    return updatedNotification;
  };
  
  const value = {
    // Services
    services,
    featuredServices,
    getServiceBySlug,
    getServicesByCategory,
    createService,
    updateService,
    
    // Projects
    projects,
    getProjectBySlug,
    getProjectsByCategory,
    createProject,
    updateProject,
    
    // Blogs
    blogs,
    publishedBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    
    // Orders
    orders,
    getOrdersByStatus,
    createOrder,
    updateOrder,
    
    // Contact Messages
    contacts,
    createContact,
    
    // Notifications
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    
    // Utility
    refreshData,
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}