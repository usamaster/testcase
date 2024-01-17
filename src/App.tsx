import { useMemo, useState, useEffect } from "react";
import { addDays, eachDayOfInterval, format, startOfToday } from "date-fns";
import { nl } from "date-fns/locale";
import { Overflowbox } from "@hffxx/react-overflow-box";
import "./App.scss";

function App() {
  const [sliceDays, setSliceDays] = useState(0);
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [randomDays, setRandomDays] = useState([0]);

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

  const SlicedDays = () => {
    return fourteenDays.slice(sliceDays, sliceDays + 6).map((day, index) => (
      <div
        key={index}
        className={`dayBox ${
          day.getTime() === selectedDate.getTime() ? "selected" : ""
        } ${randomDates.includes(day) ? "disabled" : ""}`}
        onClick={() => !randomDates.includes(day) && setSelectedDate(day)}
      >
        <div className="day">{format(day, "EEE", { locale: nl })}</div>
        <div className="date">{format(day, "dd MMM", { locale: nl })}</div>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="main">
        <button
          className="button"
          onClick={() => setSliceDays(sliceDays && sliceDays - 1)}
        >
          &lt;
        </button>

        <Overflowbox className="overflowBox">
          <div className="dateRow">
            <SlicedDays />
          </div>
        </Overflowbox>
        <button
          className="button"
          onClick={() =>
            setSliceDays(sliceDays < 9 ? sliceDays + 1 : sliceDays)
          }
        >
          &gt;
        </button>
      </div>
      <div className="showDate">
        <div>
          {format(selectedDate, "EEEE", { locale: nl })}
          <br />
          {format(selectedDate, "dd MMMM", { locale: nl })}
        </div>
      </div>
    </div>
  );
}

export default App;
