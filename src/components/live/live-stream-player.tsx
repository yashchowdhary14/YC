'use client';

interface LiveStreamPlayerProps {
    src: string;
}

export default function LiveStreamPlayer({ src }: LiveStreamPlayerProps) {
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden">
            <video
                src={src}
                controls
                autoPlay
                muted
                className="w-full h-full object-contain"
                playsInline
            />
        </div>
    );
}
