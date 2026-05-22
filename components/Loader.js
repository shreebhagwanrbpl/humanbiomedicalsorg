"use client";

import { motion } from "framer-motion";
// import { HeartPulse } from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">

            <div className="flex flex-col items-center">

                {/* Loader */}
                <div className="relative flex items-center justify-center">

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                        }}
                        className="w-20 h-20 rounded-full border-4 border-violet-200 border-t-violet-600"
                    />

                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="absolute w-10 h-10 object-contain"
                    />
                </div>

                {/* Text */}
                <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                    }}
                    className="mt-5 text-slate-600 font-medium tracking-wide"
                >
                    Loading...
                </motion.p>
            </div>
        </div>
    );
}