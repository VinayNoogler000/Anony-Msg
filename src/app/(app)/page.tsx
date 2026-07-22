"use client"

import { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json";
import Autoplay from 'embla-carousel-autoplay'
import { Mail } from "lucide-react";

export default function Home() {
  const emblaAutoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <>
      <main className="grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold"> Dive into the World of Anonymous Conversations</h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg"> Explore AnonyMsg - Where Your identity remains a Secret. </p>
        </section>

        <Carousel 
          className="w-full max-w-48 sm:max-w-xs"
          plugins={[emblaAutoplayPlugin.current]}
          onMouseEnter={() => emblaAutoplayPlugin.current.stop()}  
          onMouseLeave={() => emblaAutoplayPlugin.current.play()}  
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <div className="p-1">
                  <Card>
                    <CardHeader> {message.title} </CardHeader>
                    <CardContent  className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground"> {message.received} </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2026 AnonyMsg. All rights reserved.
      </footer>
    </>
  );
}