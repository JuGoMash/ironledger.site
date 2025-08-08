import { db } from './src/lib/db';

async function main() {
  // Create or update sample users
  const user1 = await db.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  });

  const user2 = await db.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
    },
  });

  // Delete existing posts for these users to avoid duplicates
  await db.post.deleteMany({
    where: {
      authorId: {
        in: [user1.id, user2.id],
      },
    },
  });

  // Create sample posts
  await db.post.createMany({
    data: [
      {
        title: 'Getting Started with Next.js 15',
        content: `Next.js 15 is the latest version of the popular React framework that brings exciting new features and improvements. In this post, we'll explore some of the key features that make Next.js 15 a powerful choice for modern web development.

Key Features:
- Enhanced App Router with improved performance
- Built-in support for React Server Components
- Improved TypeScript integration
- Better development experience with fast refresh
- Optimized builds and deployments

Whether you're building a simple blog or a complex web application, Next.js 15 provides the tools and features you need to create fast, scalable, and maintainable applications.`,
        published: true,
        authorId: user1.id,
      },
      {
        title: 'Understanding Prisma ORM',
        content: `Prisma is a next-generation ORM that makes database access easy with auto-generated and type-safe queries. In this post, we'll dive into the core concepts of Prisma and how it can improve your development workflow.

What makes Prisma special?
- Type-safe database access
- Auto-generated query builder
- Database migrations made simple
- Excellent TypeScript support
- Great developer experience

Getting started with Prisma is straightforward. Simply install the package, define your schema, and let Prisma handle the rest. The type safety alone will save you countless hours of debugging and runtime errors.`,
        published: true,
        authorId: user2.id,
      },
      {
        title: 'Building Modern UIs with shadcn/ui',
        content: `shadcn/ui is a collection of beautifully designed components that you can copy and paste into your apps. It's built on top of Tailwind CSS and Radix UI, providing a perfect balance between customization and consistency.

Why choose shadcn/ui?
- No lock-in - you own the components
- Fully customizable with Tailwind CSS
- Accessible by default
- Great TypeScript support
- Active community and regular updates

The component library includes everything from basic buttons and inputs to complex charts and data tables. Each component is carefully crafted to provide the best possible user experience while maintaining flexibility for customization.`,
        published: true,
        authorId: user1.id,
      },
      {
        title: 'Draft Post - Work in Progress',
        content: `This is a draft post that's still being worked on. It won't be visible on the public site until it's published.

Topics to cover:
- Real-time features with WebSockets
- Authentication strategies
- Performance optimization
- Deployment strategies
- Testing methodologies

Check back soon for the complete version of this post!`,
        published: false,
        authorId: user2.id,
      },
      {
        title: 'The Future of Web Development',
        content: `Web development is evolving rapidly, with new technologies and paradigms emerging constantly. In this post, we'll explore some of the trends that are shaping the future of web development.

Emerging Trends:
- Edge computing and serverless architectures
- WebAssembly for high-performance applications
- AI-powered development tools
- Progressive Web Apps (PWAs)
- JAMstack architecture

As developers, it's crucial to stay updated with these trends while focusing on the fundamentals that never change - clean code, good architecture, and user-centric design.

The future is bright for web development, with more powerful tools and frameworks making it easier than ever to build amazing applications that run smoothly across all devices and platforms.`,
        published: true,
        authorId: user1.id,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });