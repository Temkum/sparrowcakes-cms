import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = +new Date('2025-03-25') - +new Date();
  let timeLeft: TimeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 text-gray-600">
      <div className="text-center">
        <div className="text-2xl font-semibold">
          -{String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-sm">Days</div>
      </div>
      <div className="text-2xl font-semibold">:</div>
      <div className="text-center">
        <div className="text-2xl font-semibold">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-sm">Hrs</div>
      </div>
      <div className="text-2xl font-semibold">:</div>
      <div className="text-center">
        <div className="text-2xl font-semibold">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-sm">Min</div>
      </div>
      <div className="text-2xl font-semibold">:</div>
      <div className="text-center">
        <div className="text-2xl font-semibold">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-sm">Sec</div>
      </div>
    </div>
  );
}

export default function BannerDeal() {
  return (
    <div className="relative bg-[#f8e7dd] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/assets/images/bg-deal.jpg"
          alt="Organic food deal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 opacity-50"></div>
      </div>
      <div className="relative container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Content */}
          <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-center">
            <div className="max-w-lg">
              <div className="text-emerald-500 text-xl font-semibold mb-4">
                45% OFF
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Great deal on home made food.
              </h1>
              <p className="text-gray-600 mb-8">
                Enjoy delicious, homemade food with a special 45% discount.
                Don't miss out on this limited-time offer!
              </p>
              <div className="border border-gray-300 shadow-lg p-4 rounded-lg bg-orange-100 w-fit">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
