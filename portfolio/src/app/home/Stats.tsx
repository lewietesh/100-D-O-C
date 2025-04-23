'use client';

import { motion } from 'framer-motion';

// ✅ Replace with real values from your portfolio
const stats = [
  { id: 1, name: 'Projects Completed', value: '12+' },
  { id: 2, name: 'Years of Experience', value: '5+' },
  { id: 3, name: 'Clients Served', value: '10+' },
];

export default function Stats({ data = stats }: { data?: typeof stats }) {
  return (
    <section className="bg-background-light dark:bg-background-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-3">
          {data.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="mx-auto flex max-w-xs flex-col gap-y-4"
            >
              <dt className="text-base text-text-secondary dark:text-gray-400">{stat.name}</dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-text-light dark:text-text-dark sm:text-5xl">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
