"use client";
import { FOUNDER_PROFILE, FOUNDER_QUOTE_PARAGRAPHS, FOUNDER_SECTION_COPY } from "@/data/founder";
import { FounderSectionProps } from "@/types/founder";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FounderProfile from "./ui/FounderProfile";
import FounderQuoteBlock from "./ui/FounderQuoteBlock";
gsap.registerPlugin(ScrollTrigger);

export default function FounderSection({
    id ="founder",
    eyebrow = FOUNDER_SECTION_COPY.eyebrow,
    profile = FOUNDER_PROFILE,
    paragraphs = FOUNDER_QUOTE_PARAGRAPHS,
}: FounderSectionProps){
    const sectionRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() =>{
            if(imageRef.current){
                gsap.from(imageRef.current, {
                    clipPath: "inset(0 100% 0 0 )",
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger:{
                        trigger:section,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
            if (quoteRef.current){
                gsap.from(quoteRef.current.children, {
                    y: 80,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 1,
                    delay: 0.3,
                    ease: "power4.out",
                    scrollTrigger:{
                        trigger: section,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        }, section);
        return () => ctx.revert();
    }, [profile, paragraphs, eyebrow]);

    return (
        <section
            ref={sectionRef}
            id={id}
            className="bg-white py-16 md:py-24 lg:py-[160px]"
        >
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    <div className="lg:col-span-5">
                        <FounderProfile ref={imageRef} {...profile} />
                    </div>
                    <div ref={quoteRef} className="lg:col-span-7">
                        <FounderQuoteBlock eyebrow={eyebrow} paragraphs={paragraphs}/>
                    </div>
                </div>
            </div>
        </section>
    )

}