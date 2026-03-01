import React, { useState } from 'react';

export default function DisclaimerOverlay({ onAccept }) {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="p-10 rounded-2xl bg-black border border-white/20 shadow-2xl flex flex-col items-center max-w-xl text-center">
                <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                    GeoScan
                    <span className="block text-2xl font-light text-gray-400 mt-1">for New York City</span>
                </h1>

                <h2 className="text-lg text-gray-500 mb-8 italic">
                    by bartu dönmez
                </h2>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 text-left">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Bu proje, kentsel hareketliliğin analizi ve görselleştirilmesi üzerine bir çalışmadır. New York City TLC (Taksi ve Limuzin Komisyonu) açık verileri kullanılarak geliştirilmiştir.
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Saatlik taksi yoğunlukları, DBSCAN algoritması ile kümeler halinde analiz edilmekte ve interaktif bir harita üzerinde siyah-beyaz tonlarla görselleştirilmektedir. Noktalara tıklayarak detaylı yoğunluk verilerine ulaşabilirsiniz.
                    </p>
                    <p className="text-gray-400 text-xs mt-6 text-center">
                        * Bu uygulama tamamen <strong>eğitim amaçlı</strong> geliştirilmiştir. Ticari bir amacı yoktur.
                    </p>
                </div>

                <label className="flex items-center space-x-3 mb-8 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="appearance-none w-5 h-5 border-2 border-gray-500 rounded-sm bg-black checked:bg-white checked:border-white transition-colors cursor-pointer"
                        />
                        {isChecked && (
                            <svg className="absolute w-3.5 h-3.5 text-black pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        Yukarıdaki bilgilendirmeyi okudum ve kabul ediyorum.
                    </span>
                </label>

                <button
                    onClick={onAccept}
                    disabled={!isChecked}
                    className={`
                        px-12 py-4 font-bold rounded-full w-full transition-all duration-300
                        ${isChecked
                            ? 'bg-red-600 text-white hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
                    `}
                >
                    Sisteme Giriş Yap
                </button>

                <div className="mt-6 text-xs text-gray-400 text-center">
                    Veri Kaynağı:{' '}
                    <a
                        href="https://github.com/fivethirtyeight/uber-tlc-foil-response"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-300 hover:text-white underline transition-colors"
                    >
                        FiveThirtyEight NYC TLC FOIL Data
                    </a>
                </div>

                <div className="mt-6 text-xs text-gray-500 text-center">
                    Veri Kaynağı:{' '}
                    <a
                        href="https://github.com/fivethirtyeight/uber-tlc-foil-response"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-white underline transition-colors"
                    >
                        FiveThirtyEight Uber TLC FOIL Open Dataset
                    </a>
                </div>
            </div>
        </div>
    );
}
