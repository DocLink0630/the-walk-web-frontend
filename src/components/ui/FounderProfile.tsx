import {forwardRef} from "react";
import type { FounderProfile as FounderProfileType } from "@/types/founder";
import FramedImage from "./FramedImage";

export interface FounderProfileProps extends FounderProfileType{
    className?: string;
}

const FounderProfile = forwardRef<HTMLDivElement, FounderProfileProps> (
    ({ name, title, image, imageAlt, className = "" }, ref) =>{
        return(
            <div className={className}>
                <FramedImage
                    ref={ref}
                    src={image}
                    alt={imageAlt ?? name}
                    className="relative w-full aspect-[3/4]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="mt-6">
                    <h3 className="font-ui text-[16px] md:text-[18px] font-medium tracking-[0.12em] uppercase text-[#0A0A0A] mb-2">
                        {name}
                    </h3>
                    <p className="font-ui text-[12px] md:text-[13px] font-semibold tracking-[0.18em] uppercase text-[#9A7329]">
                        {title}
                    </p>
                </div>
            </div>
        )
    }
);
FounderProfile.displayName = "FounderProfile";
export default FounderProfile;
