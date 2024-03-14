import { useMemo, useState, useEffect, useRef } from 'react';
import { addDays, eachDayOfInterval, format, startOfToday } from 'date-fns';
import { nl } from 'date-fns/locale';
import './App.scss';

function App() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [randomDays, setRandomDays] = useState([0]);
  const [, setIsScrolling] = useState(false);
  const intervalRef = useRef(0);
  const ref = useRef<HTMLInputElement>(null);

  const handleClick = (left: boolean) => {
    const element = ref.current;
    if (element) {
      const scrollAmount = left ? -100 : 100;
      element.scrollLeft += scrollAmount;
    }
  };

  const handleMouseDown = (left: boolean) => {
    setIsScrolling(true);
    intervalRef.current = setInterval(() => {
      handleClick(left);
    }, 100);
  };

  const handleMouseUp = () => {
    clearInterval(intervalRef.current);
    setIsScrolling(false);
  };

  const fourteenDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfToday(),
      end: addDays(startOfToday(), 14),
    });
  }, []);

  useEffect(() => {
    const newRandomDays = [];
    while (newRandomDays.length < 4) {
      const randomDay = Math.floor(Math.random() * 14);
      if (newRandomDays.indexOf(randomDay) === -1) {
        newRandomDays.push(randomDay);
      }
    }
    setRandomDays(newRandomDays);
  }, []);

  const randomDates = useMemo(() => {
    return randomDays.map((day) => fourteenDays[day]);
  }, [randomDays, fourteenDays]);

  const RenderedDays = () => {
    return fourteenDays.map((day, index) => (
      <div
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        className={`dayBox ${
          day.getTime() === selectedDate.getTime() ? 'selected' : ''
        } ${randomDates.includes(day) ? 'disabled' : ''}`}
        onClick={() => !randomDates.includes(day) && setSelectedDate(day)}
        onKeyDown={() => !randomDates.includes(day) && setSelectedDate(day)}
        role="button"
        tabIndex={0}
      >
        <div className="day">{format(day, 'EEE', { locale: nl })}</div>
        <div className="date">{format(day, 'dd MMM', { locale: nl })}</div>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="main">
        <button
          type="button"
          className="button"
          onClick={() => handleClick(true)}
          onMouseDown={() => handleMouseDown(true)}
          onMouseUp={handleMouseUp}
        >
          &lt;
        </button>

        <div className="dateRow" ref={ref} role="rowgroup">
          <RenderedDays />
        </div>

        <button
          type="button"
          className="button"
          onClick={() => handleClick(false)}
          onMouseDown={() => handleMouseDown(false)}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          &gt;
        </button>
      </div>
      <div className="showDate" role="textbox">
        <div>
          {format(selectedDate, 'EEEE', { locale: nl })}
          <br />
          {format(selectedDate, 'dd MMMM', { locale: nl })}
        </div>
      </div>
    </div>
  );
}

export default App;
