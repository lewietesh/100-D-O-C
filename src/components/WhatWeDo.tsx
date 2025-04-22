'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaPlay } from 'react-icons/fa';

export default function WhatWeDo() {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-play when modal opens, pause when closed
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Video Preview Block */}
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <img
            src="https://cdn.pixabay.com/photo/2017/10/10/21/47/laptop-2838921_1280.jpg" // Optional poster frame or a styled thumbnail
            alt="Video preview"
            className="w-full h-auto object-cover aspect-video"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition hover:scale-105"
          >
            <span className="p-4 bg-white text-orange-500 rounded-full shadow-lg">
              <FaPlay className="h-5 w-5" />
            </span>
          </button>
        </div>

        {/* Text Content */}
        <div>
          <p className="text-sm font-bold text-orange-600 uppercase">What we do?</p>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            We create world-class digital products that communicate clearly.
          </h2>
          <div className="mt-8 space-y-6 text-gray-600 text-base sm:text-lg leading-relaxed">
            <div>
              <p className="font-semibold text-gray-900">Qualified Team:</p>
              <p>
                We engage with our clients beyond the conventional relationship to become creative technology partners.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Global Offices:</p>
              <p>
                With presence across continents, our reach empowers global solutions with local touch.
              </p>
            </div>
            <a href="#contact" className="inline-block font-medium text-orange-600 hover:underline mt-4">
              Start a Project →
            </a>
          </div>
        </div>
      </div>

      {/* 🎬 Video Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-xl overflow-hidden shadow-xl max-w-5xl w-full aspect-video">
                <video
                  ref={videoRef}
                  src="/videos/demo.mp4"
                  muted
                  controls
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 bg-white text-black p-2 rounded-full shadow hover:scale-105"
                >
                  ✕
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
