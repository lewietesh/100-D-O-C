// app/utils/dataService.ts
import { Service } from '../models/services.model';
import { Project } from '../models/projects.model';
import { BlogPost } from '../models/blog.model';
import { ServiceOrder } from '../models/orders.model';
import { User } from '../models/user.model';
import { ContactMessage } from '../models/contact.model';
import { Notification } from '../models/notifications.model';

// Import data
import { services as servicesData } from '@/data/services';
import { projects as projectsData } from '@/data/projects';
import { blogs as blogsData } from '@/data/blogs';
import { orders as ordersData } from '@/data/orders';
import { users as usersData } from '@/data/users';
import { contacts as contactsData } from '@/data/contacts';
import { notifications as notificationsData } from '@/data/notifications';

// Service class to handle JSON data operations
class DataService {
  private services: Service[] = servicesData;
  private projects: Project[] = projectsData;
  private blogs: BlogPost[] = blogsData;
  private orders: ServiceOrder[] = ordersData;
  private users: User[] = usersData;
  private contacts: ContactMessage[] = contactsData;
  private notifications: Notification[] = notificationsData;

  // Services
  getServices(): Service[] {
    return this.services;
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find(service => service.id === id);
  }

  getServiceBySlug(slug: string): Service | undefined {
    return this.services.find(service => service.slug === slug);
  }

  getServicesByCategory(category: string): Service[] {
    return this.services.filter(service => service.category === category);
  }

  getFeaturedServices(): Service[] {
    return this.services.filter(service => service.featured);
  }

  // Projects
  getProjects(): Project[] {
    return this.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  getProjectBySlug(slug: string): Project | undefined {
    return this.projects.find(project => project.slug === slug);
  }

  getProjectsByCategory(category: string): Project[] {
    return this.projects.filter(project => project.category === category);
  }

  // Blogs
  getBlogs(): BlogPost[] {
    return this.blogs;
  }

  getBlogById(id: string): BlogPost | undefined {
    return this.blogs.find(blog => blog.id === id);
  }

  getBlogBySlug(slug: string): BlogPost | undefined {
    return this.blogs.find(blog => blog.slug === slug);
  }

  getPublishedBlogs(): BlogPost[] {
    return this.blogs.filter(blog => blog.status === 'published');
  }

  // Orders
  getOrders(): ServiceOrder[] {
    return this.orders;
  }

  getOrderById(id: string): ServiceOrder | undefined {
    return this.orders.find(order => order.id === id);
  }

  getOrdersByStatus(status: string): ServiceOrder[] {
    return this.orders.filter(order => order.status === status);
  }

  // Add mock methods for creating and updating data
  // These would normally interact with a database, but for our JSON approach
  // they'll just simulate the operations by updating in-memory data
  
  createOrder(order: Omit<ServiceOrder, 'id'>): ServiceOrder {
    const newOrder: ServiceOrder = {
      id: `ord-${Date.now()}`,
      ...order,
    };
    this.orders.push(newOrder);
    
    // Create a notification for this order
    this.createNotification({
      type: 'order',
      title: 'New Service Order',
      message: `${order.clientName} has requested ${order.serviceName}`,
      read: false,
      resourceId: newOrder.id,
      resourceType: 'order',
      createdAt: new Date().toISOString(),
    });
    
    return newOrder;
  }
  
  updateOrder(id: string, updates: Partial<ServiceOrder>): ServiceOrder | undefined {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updates, updatedAt: new Date().toISOString() };
      return this.orders[index];
    }
    return undefined;
  }
  
  // Contact Messages
  getContacts(): ContactMessage[] {
    return this.contacts;
  }
  createContact(message: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage {
    const newMessage: ContactMessage = {
      id: `cont-${Date.now()}`,
      ...message,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.contacts.push(newMessage);
    
    // Create a notification for this contact message
    this.createNotification({
      type: 'contact',
      title: 'New Contact Message',
      message: `${message.name} sent a message about ${message.subject}`,
      read: false,
      resourceId: newMessage.id,
      resourceType: 'contact',
      createdAt: new Date().toISOString(),
    });
    
    return newMessage;
  }
  
  // Notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }
  
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(notification => !notification.read);
  }
  
  markNotificationAsRead(id: string): Notification | undefined {
    const index = this.notifications.findIndex(notification => notification.id === id);
    if (index !== -1) {
      this.notifications[index] = { ...this.notifications[index], read: true };
      return this.notifications[index];
    }
    return undefined;
  }
  
  createNotification(notification: Omit<Notification, 'id'>): Notification {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      ...notification,
    };
    this.notifications.push(newNotification);
    return newNotification;
  }
  
  // Utility methods for admin operations
  
  createService(service: Omit<Service, 'id' | 'createdAt'>): Service {
    const newService: Service = {
      id: `serv-${Date.now()}`,
      ...service,
      createdAt: new Date().toISOString(),
    };
    this.services.push(newService);
    return newService;
  }
  
  updateService(id: string, updates: Partial<Service>): Service | undefined {
    const index = this.services.findIndex(service => service.id === id);
    if (index !== -1) {
      this.services[index] = { 
        ...this.services[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.services[index];
    }
    return undefined;
  }
  
  createBlog(blog: Omit<BlogPost, 'id' | 'date'>): BlogPost {
    const newBlog: BlogPost = {
      id: `blog-${Date.now()}`,
      ...blog,
      date: new Date().toISOString(),
    };
    this.blogs.push(newBlog);
    
    // Create a notification for this blog post if it's published
    if (blog.status === 'published') {
      this.createNotification({
        type: 'system',
        title: 'New Blog Post Published',
        message: `"${blog.title}" has been published`,
        read: false,
        resourceId: newBlog.id,
        resourceType: 'blog',
        createdAt: new Date().toISOString(),
      });
    }
    
    return newBlog;
  }
  
  updateBlog(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
    const index = this.blogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
      // If status changed from draft to published, create notification
      if (this.blogs[index].status !== 'published' && updates.status === 'published') {
        this.createNotification({
          type: 'system',
          title: 'Blog Post Published',
          message: `"${this.blogs[index].title}" has been published`,
          read: false,
          resourceId: id,
          resourceType: 'blog',
          createdAt: new Date().toISOString(),
        });
      }
      
      this.blogs[index] = { 
        ...this.blogs[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.blogs[index];
    }
    return undefined;
  }
  
  createProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      ...project,
      createdAt: new Date().toISOString(),
    };
    this.projects.push(newProject);
    return newProject;
  }
  
  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const index = this.projects.findIndex(project => project.id === id);
    if (index !== -1) {
      this.projects[index] = { 
        ...this.projects[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      return this.projects[index];
    }
    return undefined;
  }
}

// Export as a singleton instance
export const dataService = new DataService();