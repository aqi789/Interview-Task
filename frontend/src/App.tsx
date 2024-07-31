import Project from "./components/Project";
import Task from "./components/Task";
import TimeTracker from "./components/TimeTracker";

function App() {
  return (
    <>
      <div className="container mx-auto ">
        <h1 className="text-3xl font-bold text-center absolute top-0 left-1/2 transform -translate-x-1/2 my-4">
          Time Tracker
        </h1>
        <div className="text-center absolute top-11 left-1/2 transform -translate-x-1/2 my-4 border p-5 bg-white">
          <Project />
          <Task projectId={1} />
          <TimeTracker taskId={1} />
        </div>
      </div>
    </>
  );
}

export default App;
