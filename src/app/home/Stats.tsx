'use client';

import { motion, animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Stat {
  id: number;
  name: string;
  value: number;
}

const data: Stat[] = [
  { id: 1, name: 'Projects Completed', value: 12 },
  { id: 2, name: 'Years of Experience', value: 5 },
  { id: 3, name: 'Clients Served', value: 10 },
];

// Counter component
function Counter({ targetNumber }: { targetNumber: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const animation = animate(0, targetNumber, {
        duration: 2,
        ease: 'easeOut',
        onUpdate(value) {
          setCurrentValue(Math.floor(value));
        },
      });

      return () => animation.stop();
    }
  }, [isInView, targetNumber]);

  return <span ref={ref}>{currentValue}+</span>;
}

export default function Stats() {
  return (
    <section className="relative w-full overflow-x-hidden bg-background-light dark:bg-background-dark py-24 sm:py-32">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Background"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/60  -z-10" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
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
              <dt className=" text-white dark:text-white">{stat.name}</dt>
              <dd className="order-first text-4xl font-bold tracking-tight text-white sm:text-5xl">
                <Counter targetNumber={stat.value} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
