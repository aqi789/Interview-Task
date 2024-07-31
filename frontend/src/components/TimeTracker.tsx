import { useState, useEffect, useCallback } from "react";
import axios from "axios";

interface Timer {
  hours: number;
  minutes: number;
  seconds: number;
}

interface TimeEntry {
  id: number;
  duration: Timer;
}

const TimeTracker = ({ taskId }: { taskId: number }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [timer, setTimer] = useState<Timer>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editingDuration, setEditingDuration] = useState<Timer>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const fetchTimeEntries = useCallback(async () => {
    try {
      const response = await axios.get<TimeEntry[]>(
        `http://localhost:5000/api/tasks/${taskId}/time_entries`
      );
      if (Array.isArray(response.data)) {
        setTimeEntries(response.data);
      } else {
        console.error("Unexpected response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching time entries:", error);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTimeEntries();
  }, [fetchTimeEntries]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          const seconds = prevTime.seconds + 1;
          const minutes = prevTime.minutes + Math.floor(seconds / 60);
          const hours = prevTime.hours + Math.floor(minutes / 60);
          return {
            seconds: seconds % 60,
            minutes: minutes % 60,
            hours,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const stopTimer = async () => {
    setIsRunning(false);
    try {
      const response = await axios.post<TimeEntry>(
        `http://localhost:5000/api/tasks/${taskId}/time_entries`,
        { duration: timer }
      );
      setTimeEntries((prevEntries) => [...prevEntries, response.data]);
      setTimer({ hours: 0, minutes: 0, seconds: 0 });
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
  };

  const editEntry = (id: number, duration: Timer) => {
    setEditingEntryId(id);
    setEditingDuration(duration);
  };

  const updateEntry = async () => {
    try {
      if (editingEntryId !== null) {
        const response = await axios.put<TimeEntry>(
          `http://localhost:5000/api/tasks/${taskId}/time_entries/${editingEntryId}`,
          { duration: editingDuration }
        );
        setTimeEntries((prevEntries) =>
          prevEntries.map((entry) =>
            entry.id === editingEntryId ? response.data : entry
          )
        );
        setEditingEntryId(null);
        setEditingDuration({ hours: 0, minutes: 0, seconds: 0 });
      }
    } catch (error) {
      console.error("Error updating time entry:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">Let's start Tracking!</h1>
      <div>
        <span className="text-black">{timer.hours.toString().padStart(2, "0")}:</span>
        <span className="text-black">{timer.minutes.toString().padStart(2, "0")}:</span>
        <span className="text-black">{timer.seconds.toString().padStart(2, "0")}</span>
      </div>
      <button onClick={startTimer} disabled={isRunning} className="m-4">
        Start
      </button>
      <button onClick={pauseTimer} disabled={!isRunning} className="m-4">
        Pause
      </button>
      <button onClick={stopTimer} disabled={!isRunning} className="m-4">
        Stop
      </button>
      <ul className="text-black">
        {Array.isArray(timeEntries) ? (
          timeEntries.map((entry) => (
            <li key={entry.id}>
              {editingEntryId === entry.id ? (
                <div>
                  <input
                  className="m-1.5 pt-2 pb-2 w-20 p-1 border rounded text-white mb-2 bg-blue to-sky-300"
                    type="number"
                    value={editingDuration.hours}
                    onChange={(e) =>
                      setEditingDuration({
                        ...editingDuration,
                        hours: parseInt(e.target.value),
                      })
                    }
                    placeholder="Hours"
                  />
                  <input
                                    className=" pt-2 pb-2 m-1.5 w-20 p-1 border rounded text-white mb-2 bg-blue to-sky-300"
                    type="number"
                    value={editingDuration.minutes}
                    onChange={(e) =>
                      setEditingDuration({
                        ...editingDuration,
                        minutes: parseInt(e.target.value),
                      })
                    }
                    placeholder="Minutes"
                  />
                  <input
                                    className=" pt-2 pb-2 m-1.5 w-20 p-1 border rounded text-white mb-2 bg-blue to-sky-300"
                    type="number"
                    value={editingDuration.seconds}
                    onChange={(e) =>
                      setEditingDuration({
                        ...editingDuration,
                        seconds: parseInt(e.target.value),
                      })
                    }
                    placeholder="Seconds"
                  />
                  <button onClick={updateEntry} className="text-white mr-2">Save</button>
                  <button onClick={() => setEditingEntryId(null)} className="text-white">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="w-full" >
                  {entry.duration.hours}h {entry.duration.minutes}m{" "}
                  {entry.duration.seconds}s
                  <button
                    onClick={() => editEntry(entry.id, entry.duration)}
                    className="ml-9 text-white mb-2"
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <li>Error: timeEntries is not an array</li>
        )}
      </ul>
    </div>
  );
};

export default TimeTracker;
