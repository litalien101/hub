import SubtaskList from "./SubtaskList";
import ActivityTimeline from "./ActivityTimeline";

export default function TaskInspector({ task, onStatusChange }: any) {
  if (!task) {
    return (
      <aside className="w-[360px] border-l bg-white p-6 text-sm text-gray-500">
        Select a task
      </aside>
    );
  }

  return (
    <aside className="w-[360px] border-l bg-white p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold">{task.title}</h2>
      <p className="text-sm text-gray-500">
        Assigned to {task.assignedTo.email}
      </p>

      <div className="mt-4 space-y-2">
        <Btn onClick={() => onStatusChange(task.id, "IN_PROGRESS")}>
          Mark In Progress
        </Btn>
        <Btn onClick={() => onStatusChange(task.id, "BLOCKED")}>
          Block Task
        </Btn>
        <Btn onClick={() => onStatusChange(task.id, "DONE")}>
          Complete
        </Btn>
      </div>

      <SubtaskList task={task} />
      <ActivityTimeline activity={task.activity} />
    </aside>
  );
}

function Btn({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
}
