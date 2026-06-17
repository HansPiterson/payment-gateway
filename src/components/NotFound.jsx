import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-64 h-64 md:w-80 md:h-80 mb-6 pointer-events-none">
        <DotLottieReact
          src="https://lottie.host/f6740447-61a7-4b75-89a4-df75f55487aa/EM4gYhNeid.lottie"
          loop
          autoplay
        />
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-zinc-100 mb-4 tracking-tight">
        404 Not Found
      </h1>
      <p className="text-zinc-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
        Maaf, halaman yang Anda cari tidak ditemukan atau mungkin telah dipindahkan.
      </p>
      <a 
        href="/"
        className="py-3 px-8 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-xl transition-all shadow-md text-sm"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
