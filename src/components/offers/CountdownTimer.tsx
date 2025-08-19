import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: string | Date;
  onExpire: () => void;
}

const CountdownTimer = ({ endTime, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsExpired(true);
        onExpire();
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  if (isExpired) {
    return (
      <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2">
        <span className="text-red-600 font-semibold text-sm">
          Offer Expired
        </span>
      </div>
    );
  }

  const formatTimeUnit = (value: number) => {
    return value < 10 ? `0${value}` : value.toString();
  };

  return (
    <div className="bg-orange-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
      <Clock className="w-4 h-4 text-gray-600" />
      {timeLeft.days > 0 && (
        <span className="text-gray-800 font-mono font-semibold">
          {timeLeft.days}d:
        </span>
      )}
      <span className="text-gray-800 font-mono font-semibold">
        {formatTimeUnit(timeLeft.hours)}:{formatTimeUnit(timeLeft.minutes)}:
        {formatTimeUnit(timeLeft.seconds)}
      </span>
    </div>
  );
};

export default CountdownTimer;
